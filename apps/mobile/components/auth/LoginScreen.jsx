import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { supabase } from '@/lib/supabase';
import { useRole } from '@/hooks/useRole';
import { BASE_URL } from '@/constants/api';

const { height } = Dimensions.get('window');

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Supabase Sign In
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const token = authData.session.access_token;

      // 2. Fetch User Data/Role from Backend
      const res = await fetch(`${BASE_URL}/student/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to verify role');

      // The AuthContext useEffect will catch the session change and update 'user' state,
      // but the prompt asks us to extract the role and call onLoginSuccess.
      // We'll fetch the role specifically if needed, or rely on the backend response.
      const userData = await res.json();
      const role = userData.role || 'STUDENT';

      if (onLoginSuccess) {
        onLoginSuccess(role);
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.illustrationContainer}>
          <Svg height="120" width="120" viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="#1418eb" stopOpacity="0.3" />
                <Stop offset="100%" stopColor="#1418eb" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            {/* Glows */}
            <Circle cx="20" cy="30" r="15" fill="url(#glow)" />
            <Circle cx="80" cy="40" r="15" fill="url(#glow)" />
            <Circle cx="50" cy="70" r="15" fill="url(#glow)" />
            
            {/* Lines */}
            <Path
              d="M20 30 L80 40 M80 40 L50 70 M50 70 L20 30"
              stroke="#6986c9"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
            
            {/* Nodes */}
            <Circle cx="20" cy="30" r="3" fill="#1418eb" />
            <Circle cx="80" cy="40" r="3" fill="#1418eb" />
            <Circle cx="50" cy="70" r="3" fill="#1418eb" />
            <Circle cx="35" cy="45" r="2" fill="#4468bb" />
            <Circle cx="65" cy="55" r="2" fill="#4468bb" />
          </Svg>
        </View>
        <Text style={styles.appName}>CampusAI</Text>
        <Text style={styles.subtitle}>SMART CAMPUS MANAGEMENT</Text>
      </View>

      {/* Card Section */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>SIGN IN</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={18} color="#8095b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="University Email"
            placeholderTextColor="#607a9f"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            color="#dbe6f0"
          />
        </View>

        {/* Password Input */}
        <View style={[styles.inputContainer, { marginTop: 16 }]}>
          <Ionicons name="lock-closed-outline" size={18} color="#8095b3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#607a9f"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            color="#dbe6f0"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#8095b3"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButtonContainer} onPress={handleLogin} disabled={loading}>
          <LinearGradient
            colors={['#1418eb', '#4468bb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButton}
          >
            {loading ? (
              <ActivityIndicator color="#edf2f7" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Bottom Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by AI  •  CampusAI</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1219',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topSection: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: 10,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#edf2f7',
  },
  subtitle: {
    fontSize: 13,
    color: '#8095b3',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#0e1525',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1b294b',
    padding: 28,
    marginHorizontal: 20,
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#4d6280',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131820',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#394960',
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  loginButtonContainer: {
    marginTop: 24,
  },
  loginButton: {
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#edf2f7',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#4d6280',
    letterSpacing: 1,
  },
});

export default LoginScreen;
