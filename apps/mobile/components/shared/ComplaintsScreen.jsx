import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const DEFAULT_AVATAR = require("../../assets/images/male_avtar/1.jpeg");

export default function ComplaintsScreen() {
  const router = useRouter();
  const { user, avatar } = useAuth();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const complaints = [
    // ... (complaints data remains the same)
    {
      id: 'CC-8429',
      title: 'AC Repair - Hall B',
      time: '2 hours ago',
      status: 'Pending',
      statusColor: '#ea580c',
      statusBg: '#ffedd5',
      description: "The air conditioning in the main lecture hall isn't cooling..."
    },
    {
      id: 'CC-8311',
      title: 'WiFi Connection Issue',
      time: 'Yesterday',
      status: 'In Progress',
      statusColor: '#2563eb',
      statusBg: '#dbeafe',
      description: "Unable to connect to 'EduRoam' in the library area..."
    },
    {
      id: 'CC-7954',
      title: 'Missing Library ID Card',
      time: '3 days ago',
      status: 'Resolved',
      statusColor: '#16a34a',
      statusBg: '#dcfce7',
      description: "New ID card has been issued and is ready for pickup."
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Custom Merged Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaints</Text>
        <View style={styles.headerRight} /> {/* Placeholder for balance */}
      </View>

      {/* New Complaint Form */}
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Ionicons name="add-circle" size={24} color="#1458b8" />
          <Text style={styles.formTitle}>Submit New Complaint</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity style={styles.pickerButton}>
            <Text style={styles.pickerText}>{category || 'Select category'}</Text>
            <Ionicons name="chevron-down" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the issue in detail..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Attachment (Optional)</Text>
          <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} contentFit="cover" />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Ionicons name="camera-outline" size={28} color="#94a3b8" />
                <Text style={styles.uploadText}>Tap to upload image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* My Complaints Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Complaints</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.complaintsList}>
        {complaints.map((item) => (
          <View key={item.id} style={styles.complaintCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.cardHeaderInfo}>
                <Text style={styles.complaintTitle}>{item.title}</Text>
                <Text style={styles.complaintSubtitle}>Ticket #{item.id} • {item.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.complaintDesc} numberOfLines={1}>{item.description}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Padding for Tab Bar */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  contentContainer: { paddingBottom: 100 },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#f6f7f8',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerRight: {
    width: 42, // Match backButton width for centering
  },

  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: { fontSize: 15, color: '#64748b' },
  
  textArea: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#0f172a',
    minHeight: 100,
  },
  
  uploadArea: {
    height: 100,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  
  imagePreviewContainer: { width: '100%', height: '100%', position: 'relative' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 10 },
  removeImageButton: { position: 'absolute', top: -10, right: -10, backgroundColor: '#fff', borderRadius: 12 },
  
  submitButton: {
    backgroundColor: '#1458b8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1458b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  viewAllText: { fontSize: 14, fontWeight: '700', color: '#1458b8' },

  complaintsList: { paddingHorizontal: 16, gap: 12 },
  complaintCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardHeaderInfo: { flex: 1, gap: 2 },
  complaintTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  complaintSubtitle: { fontSize: 12, color: '#64748b' },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  complaintDesc: { fontSize: 14, color: '#475569', lineHeight: 20 },
});
