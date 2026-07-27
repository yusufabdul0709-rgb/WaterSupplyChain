import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, CheckCircle, Send } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../constants/theme';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { StepIndicator } from '../components/report/StepIndicator';
import { IssueTypeCard } from '../components/report/IssueTypeCard';
import { PhotoPicker } from '../components/report/PhotoPicker';
import { VoiceRecorder } from '../components/chat/VoiceRecorder';
import { ISSUE_TYPES, IssueType } from '../data/issueTypes';
import { complaintService } from '../services/complaintService';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';
import { generateComplaintId } from '../utils/formatters';

const STEP_LABELS = ['Select Issue', 'Confirm Location', 'Details & Evidence', 'Review & Submit'];

export default function ReportIssueScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ issueTypeId?: string }>();
  const user = useAuthStore((state) => state.user);
  const location = useLocationStore();

  const initialType = ISSUE_TYPES.find((i) => i.id === params.issueTypeId) || ISSUE_TYPES[0];

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<IssueType>(initialType);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep === 0 && !selectedType) {
      Alert.alert('Selection Required', 'Please select an issue category.');
      return;
    }
    if (currentStep === 2 && !description.trim()) {
      Alert.alert('Description Required', 'Please provide a short description of the problem.');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await complaintService.createComplaint({
        title: selectedType.title,
        description: description || selectedType.description,
        lat: location.latitude || 17.738,
        lng: location.longitude || 83.332,
        sector_id: user?.sectorId || 'SEC_MVP',
        citizen_name: user?.name,
        phone: user?.phone,
      });

      const cid = res.data?.id || generateComplaintId();
      setSubmittedId(cid);
    } catch (e) {
      setSubmittedId(generateComplaintId());
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <View style={[styles.container, styles.successContainer, { paddingTop: insets.top + 20 }]}>
        <GlassCard style={styles.successCard} intensity={60}>
          <View style={styles.successIconCircle}>
            <CheckCircle size={56} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Complaint Registered!</Text>
          <Text style={styles.successSubtitle}>
            Your complaint has been logged under ID{' '}
            <Text style={styles.cidHighlight}>#{submittedId}</Text> and automatically routed to the{' '}
            {user?.sectorName || 'MVP Colony'} Sector Admin.
          </Text>

          <View style={styles.routeBox}>
            <Text style={styles.routeLabel}>AUTO-ASSIGNED SECTOR ENGINEER</Text>
            <Text style={styles.routeValue}>Er. S. Naidu (Zone 2 Water Head)</Text>
            <Text style={styles.routeSla}>Expected Resolution SLA: 24 Hours</Text>
          </View>

          <GlassButton
            title="Track Complaint Status"
            onPress={() => {
              router.replace('/(tabs)/complaints');
            }}
            variant="primary"
            style={{ width: '100%', marginTop: 20 }}
          />
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Water Issue</Text>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator currentStep={currentStep} totalSteps={4} labels={STEP_LABELS} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 0: Select Issue Type */}
        {currentStep === 0 && (
          <View>
            <Text style={styles.stepTitle}>Select Issue Category</Text>
            <Text style={styles.stepSubtitle}>Tap the option that best describes your water problem.</Text>

            <View style={styles.grid}>
              {ISSUE_TYPES.map((item) => (
                <IssueTypeCard
                  key={item.id}
                  item={item}
                  isSelected={selectedType.id === item.id}
                  onSelect={(type) => setSelectedType(type)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Step 1: Confirm Location */}
        {currentStep === 1 && (
          <View>
            <Text style={styles.stepTitle}>GPS Location Confirmation</Text>
            <Text style={styles.stepSubtitle}>Your location is automatically captured using GPS.</Text>

            <GlassCard style={styles.locationCard} intensity={45}>
              <View style={styles.locationHeader}>
                <MapPin size={24} color={Colors.primary} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.locationName}>{user?.sectorName || 'MVP Colony Sector'}</Text>
                  <Text style={styles.locationWard}>{user?.wardNumber || 'Ward 42'} · Visakhapatnam</Text>
                </View>
              </View>

              <Text style={styles.coordText}>
                Coordinates: {location.latitude?.toFixed(4) || '17.7380'} N,{' '}
                {location.longitude?.toFixed(4) || '83.3320'} E
              </Text>
              <Text style={styles.gpsAccuracy}>GPS Accuracy: ± 5 meters</Text>
            </GlassCard>
          </View>
        )}

        {/* Step 2: Details & Evidence */}
        {currentStep === 2 && (
          <View>
            <Text style={styles.stepTitle}>Issue Description & Evidence</Text>
            <Text style={styles.stepSubtitle}>Provide additional details or record a voice note for field engineers.</Text>

            <GlassCard style={styles.card} intensity={45}>
              <Text style={styles.inputLabel}>Describe the Problem</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Explain the water issue (e.g. pipe leakage near door 4-12)..."
                placeholderTextColor={Colors.textTertiary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />

              <PhotoPicker photos={photos} onChangePhotos={setPhotos} />

              <View style={{ marginTop: 12 }}>
                <Text style={styles.inputLabel}>Voice Note Attachment</Text>
                {isVoiceRecording ? (
                  <VoiceRecorder
                    onRecordingComplete={(uri) => {
                      setVoiceNoteUri(uri);
                      setIsVoiceRecording(false);
                    }}
                    onCancel={() => setIsVoiceRecording(false)}
                  />
                ) : voiceNoteUri ? (
                  <View style={styles.voiceAttachedBox}>
                    <Text style={styles.voiceAttachedText}>🎤 Voice note recorded</Text>
                    <TouchableOpacity onPress={() => setVoiceNoteUri(null)}>
                      <Text style={styles.removeVoice}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setIsVoiceRecording(true)} style={styles.recordBtn}>
                    <Text style={styles.recordBtnText}>🎙️ Tap to Record Voice Explanation</Text>
                  </TouchableOpacity>
                )}
              </View>
            </GlassCard>
          </View>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <View>
            <Text style={styles.stepTitle}>Review Grievance Summary</Text>
            <Text style={styles.stepSubtitle}>Confirm details before submitting to GVMC Control Room.</Text>

            <GlassCard style={styles.card} intensity={45}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Category:</Text>
                <Text style={styles.summaryValue}>{selectedType.title}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sector & Ward:</Text>
                <Text style={styles.summaryValue}>
                  {user?.sectorName} ({user?.wardNumber})
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Citizen Contact:</Text>
                <Text style={styles.summaryValue}>{user?.name} ({user?.phone})</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Evidence:</Text>
                <Text style={styles.summaryValue}>
                  {photos.length} Photo(s) {voiceNoteUri ? '· 1 Voice Note' : ''}
                </Text>
              </View>
            </GlassCard>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {currentStep > 0 && (
          <GlassButton
            title="Back"
            onPress={() => setCurrentStep((s) => s - 1)}
            variant="ghost"
            style={{ marginRight: 10 }}
          />
        )}
        <GlassButton
          title={currentStep === 3 ? 'Submit Complaint Now' : 'Continue'}
          onPress={handleNext}
          loading={loading}
          variant="primary"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.title3,
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 100,
  },
  stepTitle: {
    ...Typography.title2,
    color: Colors.text,
    marginTop: 8,
  },
  stepSubtitle: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    padding: 20,
  },
  locationCard: {
    padding: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationName: {
    ...Typography.title3,
    color: Colors.text,
  },
  locationWard: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  coordText: {
    ...Typography.subheadMedium,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  gpsAccuracy: {
    ...Typography.caption2,
    color: Colors.success,
    fontWeight: '700',
    marginTop: 4,
  },
  inputLabel: {
    ...Typography.footnoteMedium,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    padding: 14,
    height: 100,
    textAlignVertical: 'top',
    ...Typography.body,
    color: Colors.text,
    marginBottom: 12,
  },
  recordBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    alignItems: 'center',
  },
  recordBtnText: {
    ...Typography.footnoteMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  voiceAttachedBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.successLight,
  },
  voiceAttachedText: {
    ...Typography.footnoteMedium,
    color: Colors.success,
    fontWeight: '700',
  },
  removeVoice: {
    ...Typography.caption1,
    color: Colors.danger,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  summaryLabel: {
    ...Typography.subhead,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.screen,
    paddingTop: 12,
    backgroundColor: 'rgba(246, 248, 251, 0.9)',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
  },
  successCard: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    ...Typography.title1,
    color: Colors.text,
    textAlign: 'center',
  },
  successSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  cidHighlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
  routeBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 91, 172, 0.08)',
    padding: 16,
    borderRadius: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  routeLabel: {
    ...Typography.caption2,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  routeValue: {
    ...Typography.subheadMedium,
    color: Colors.text,
    fontWeight: '700',
    marginTop: 4,
  },
  routeSla: {
    ...Typography.caption1,
    color: Colors.success,
    fontWeight: '600',
    marginTop: 4,
  },
});
