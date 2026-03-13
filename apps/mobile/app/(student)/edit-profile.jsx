import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Mock save logic
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "A password reset link has been sent to your email: " + (user?.email || "your email"),
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Form */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter mobile number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <Ionicons name="mail-outline" size={20} color="#cbd5e1" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: '#94a3b8' }]}
                value={user?.email || ""}
                editable={false}
              />
            </View>
            <Text style={styles.helperText}>Email cannot be changed.</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Account Privacy</Text>
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
            <View style={styles.forgotPasswordContent}>
              <Ionicons name="lock-closed-outline" size={20} color="#1458b8" />
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  contentContainer: { paddingTop: 60, paddingBottom: 40 },

  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 10,
  },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '500',
  },
  disabledInput: { backgroundColor: '#f1f5f9', borderColor: '#f1f5f9' },
  helperText: { fontSize: 11, color: '#94a3b8', marginTop: 4, marginLeft: 4 },
  
  saveButton: {
    backgroundColor: '#1458b8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1458b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  securitySection: { marginTop: 32, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  
  forgotPasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  forgotPasswordContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  forgotPasswordText: { fontSize: 15, fontWeight: '600', color: '#1458b8' },
});
