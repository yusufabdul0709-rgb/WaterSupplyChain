import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, BorderRadius } from '../../constants/theme';

interface PhotoPickerProps {
  photos: string[];
  onChangePhotos: (photos: string[]) => void;
}

export function PhotoPicker({ photos, onChangePhotos }: PhotoPickerProps) {
  const handleTakePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const res = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!res.canceled && res.assets[0]?.uri) {
      onChangePhotos([...photos, res.assets[0].uri]);
    }
  };

  const handlePickGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 3,
    });

    if (!res.canceled) {
      const uris = res.assets.map((a) => a.uri);
      onChangePhotos([...photos, ...uris].slice(0, 3));
    }
  };

  const handleRemovePhoto = (index: number) => {
    onChangePhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Attach Photo Evidence (Max 3)</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
        {photos.map((uri, i) => (
          <View key={i} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity onPress={() => handleRemovePhoto(i)} style={styles.removeBtn}>
              <X size={12} color="#FFF" />
            </TouchableOpacity>
          </View>
        ))}

        {photos.length < 3 && (
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={handleTakePhoto} style={styles.addBtn}>
              <Camera size={20} color={Colors.primary} />
              <Text style={styles.addText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePickGallery} style={[styles.addBtn, { marginLeft: 8 }]}>
              <ImageIcon size={20} color={Colors.secondary} />
              <Text style={styles.addText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    ...Typography.footnoteMedium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  photoRow: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.md,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRow: {
    flexDirection: 'row',
  },
  addBtn: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 91, 172, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    ...Typography.caption2,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
});
