import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const DEFAULT_AVATAR = require("@/assets/images/male_avtar/1.jpeg");

export default function AssistantScreen() {
  const { user, avatar } = useAuth();
  const [inputText, setInputText] = useState('');
  
  const userName = user?.name?.split(" ")[0] || "Alex";

  const quickActions = [
    "What's my next class?",
    "Check GPA",
    "Find Library hours",
    "Meal balance"
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={avatar || DEFAULT_AVATAR} 
            style={styles.profilePic} 
            contentFit="cover"
          />
          <View>
            <Text style={styles.appTitle}>CAMPUS CONNECT</Text>
            <Text style={styles.greeting}>Hi {userName}!</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={22} color="#1458b8" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.chatContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <View style={styles.robotIconContainer}>
            <Ionicons name="hardware-chip" size={32} color="#1458b8" />
          </View>
          <Text style={styles.welcomeTitle}>AI Assistant</Text>
          <Text style={styles.welcomeSubtitle}>Powered by University Intelligence</Text>
        </View>

        {/* Chat History */}
        <View style={styles.messageList}>
          {/* AI Message */}
          <View style={styles.aiMessageRow}>
            <View style={styles.aiAvatar}>
              <Ionicons name="hardware-chip" size={16} color="#fff" />
            </View>
            <View style={styles.aiBubble}>
              <Text style={styles.aiMessageText}>
                Hi {userName}! How can I help you today? I can check your grades, find your next class, or answer questions about campus facilities.
              </Text>
            </View>
          </View>

          {/* User Message */}
          <View style={styles.userMessageRow}>
            <View style={styles.userBubble}>
              <Text style={styles.userMessageText}>
                What's my next class and where is it located?
              </Text>
            </View>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={16} color="#7ba4df" />
            </View>
          </View>

          {/* AI Response with Context */}
          <View style={styles.aiMessageRow}>
            <View style={styles.aiAvatar}>
              <Ionicons name="hardware-chip" size={16} color="#fff" />
            </View>
            <View style={styles.aiBubble}>
              <Text style={styles.aiMessageText}>
                Your next class is <Text style={{fontWeight: 'bold', color: '#0f172a'}}>Advanced Algorithms</Text> at <Text style={{fontWeight: 'bold', color: '#0f172a'}}>2:00 PM</Text>. It's held in <Text style={{fontWeight: '700', color: '#1458b8'}}>Science Building, Room 402</Text>.
              </Text>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={40} color="#cbd5e1" />
                <Text style={styles.mapText}>Map Preview</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.chipButton}>
              <Text style={styles.chipText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{height: 20}} />
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputAreaWrapper}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={24} color="#64748b" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Ask anything about campus..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" style={{marginLeft: 2}} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'rgba(246, 247, 248, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 88, 184, 0.1)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profilePic: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#1458b830' },
  appTitle: { fontSize: 11, fontWeight: '600', color: '#1458b8', letterSpacing: 1, textTransform: 'uppercase' },
  greeting: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  searchButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(20, 88, 184, 0.05)', alignItems: 'center', justifyContent: 'center' },

  chatContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 60 },
  
  welcomeSection: { alignItems: 'center', marginBottom: 32 },
  robotIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1458b815', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  welcomeTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  welcomeSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },

  messageList: { gap: 20, marginBottom: 24 },
  
  aiMessageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, maxWidth: '85%' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1458b8', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  aiBubble: { backgroundColor: '#fff', padding: 16, borderRadius: 20, borderTopLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: 'rgba(20, 88, 184, 0.05)' },
  aiMessageText: { fontSize: 15, color: '#1e293b', lineHeight: 22 },
  
  mapPlaceholder: { width: width * 0.65, height: 140, backgroundColor: '#f1f5f9', borderRadius: 12, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  mapText: { color: '#94a3b8', fontSize: 12, fontWeight: '600', marginTop: 8 },

  userMessageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, maxWidth: '85%', alignSelf: 'flex-end' },
  userAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  userBubble: { backgroundColor: '#1458b8', padding: 16, borderRadius: 20, borderTopRightRadius: 4, shadowColor: '#1458b8', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  userMessageText: { fontSize: 15, color: '#fff', lineHeight: 22 },

  quickActionsContainer: { paddingVertical: 10, gap: 10, paddingHorizontal: 4 },
  chipButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(20, 88, 184, 0.2)' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#1458b8' },

  inputAreaWrapper: { padding: 16, backgroundColor: '#f6f7f8', borderTopWidth: 1, borderTopColor: 'rgba(20, 88, 184, 0.1)', paddingBottom: Platform.OS === 'ios' ? 30 : 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(20, 88, 184, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 2 },
  micButton: { padding: 4, marginRight: 8 },
  textInput: { flex: 1, fontSize: 15, color: '#0f172a', paddingVertical: 8 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1458b8', alignItems: 'center', justifyContent: 'center', marginLeft: 8, shadowColor: '#1458b8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
});
