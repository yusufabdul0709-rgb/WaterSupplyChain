import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const BACKEND_URL = 'http://10.0.2.2:8000'; // FastAPI Python Backend (port 8000)

const SECTORS_MOCK = [
  { id: 'SEC_GAJUWAKA', name: 'Gajuwaka Sector', lat: 17.6850, lng: 83.2150 },
  { id: 'SEC_MVP', name: 'MVP Colony Sector', lat: 17.7350, lng: 83.3300 },
  { id: 'SEC_SEETHAM', name: 'Seethammadhara Sector', lat: 17.7400, lng: 83.3050 },
  { id: 'SEC_MADHURA', name: 'Madhurawada Sector', lat: 17.8100, lng: 83.3500 },
  { id: 'SEC_ANAKAPALLE', name: 'Anakapalle Sector', lat: 17.6900, lng: 83.0000 }
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  
  // Auth Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Location & Complaint
  const [location, setLocation] = useState(null);
  const [nearestSector, setNearestSector] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        
        // Find nearest sector
        let minDistance = Infinity;
        let closest = null;
        SECTORS_MOCK.forEach(sector => {
          let dist = calculateDistance(loc.coords.latitude, loc.coords.longitude, sector.lat, sector.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = sector;
          }
        });
        setNearestSector(closest);
      })();
    }
  }, [token]);

  const handleAuth = async () => {
    setLoading(true);
    const endpoint = isLogin ? '/api/v1/auth/users/login' : '/api/v1/auth/users/register';
    const payload = isLogin ? { username: email, password } : { name, email, phone, password };
    
    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          setToken(data.token);
          setUser(data.user);
        } else {
          Alert.alert('Success', 'Registered successfully. Please login.');
          setIsLogin(true);
        }
      } else {
        Alert.alert('Error', data.detail || 'Authentication failed');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Ensure the backend server is running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  const submitComplaint = async () => {
    if (!title || !description || !location || !nearestSector) {
      Alert.alert('Error', 'Please fill all fields and wait for GPS location');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/complaints`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          lat: location.latitude,
          lng: location.longitude,
          sector_id: nearestSector.id
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        Alert.alert('Success', 'Complaint submitted successfully and routed to ' + nearestSector.name);
        setTitle('');
        setDescription('');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>GVMC Connect</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Login' : 'Sign Up (Email/Google Simulation)'}</Text>
          
          {!isLogin && (
            <>
              <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </>
          )}
          <TextInput style={styles.input} placeholder="Email (Gmail)" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          
          <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome, {user?.name}</Text>
        <TouchableOpacity onPress={() => setToken(null)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.locationCard}>
        <Text style={styles.sectionTitle}>Your Location Status</Text>
        {location ? (
          <>
            <Text style={styles.text}>Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</Text>
            {nearestSector && (
              <Text style={styles.highlightText}>Assigned Sector: {nearestSector.name}</Text>
            )}
          </>
        ) : (
          <ActivityIndicator size="small" color="#10b981" />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Report a Problem</Text>
        <TextInput style={styles.input} placeholder="Complaint Title (e.g., Broken Pipe)" value={title} onChangeText={setTitle} />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Describe the issue..." 
          value={description} 
          onChangeText={setDescription}
          multiline 
          numberOfLines={4} 
        />
        <TouchableOpacity style={styles.button} onPress={submitComplaint} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Complaint'}</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>
          Your complaint will be automatically routed to the {nearestSector?.name || 'nearest'} sector admin based on your GPS location.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    color: '#38bdf8',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  text: {
    color: '#f8fafc',
    marginBottom: 8,
  },
  highlightText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  }
});
