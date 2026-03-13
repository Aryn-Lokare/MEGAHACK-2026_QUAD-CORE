import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const DEFAULT_AVATAR = require("../../assets/images/male_avtar/1.jpeg");

export default function AssistantScreen() {
  const { user, avatar } = useAuth();
  const userName = user?.name?.split(" ")[0] || "Alex";
  const router = useRouter();

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi ${userName}! How can I help you today? I can check your grades, find your next class, or answer questions about campus facilities.`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const quickActions = [
    "What's my next class?",
    "Check GPA",
    "Find Library hours",
    "Meal balance"
  ];

  const sendMessage = async (text) => {
    const trimmedText = (text || '').trim();
    if (!trimmedText) return;

    Keyboard.dismiss();

    // VERY IMPORTANT: Clear input synchronously to avoid race conditions
    setInputText('');
    
    // Use functional state update to avoid stale closures
    setMessages(prev => [...prev, { role: 'user', text: trimmedText }]);
    setIsLoading(true);

    try {
      console.log(`Sending message via AI Assistant API: ${trimmedText}`);
      // Fallback API URL to handle different environments, use port 5001 where the backend runs
      let apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';
      apiUrl = apiUrl.replace(':5000', ':5001'); // Force port 5001 if .env is still 5000
      
      // Add a 10-second timeout to prevent the app from hanging if the server is unreachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${apiUrl}/api/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmedText }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer || "I'm having trouble retrieving that information right now." }
      ]);
    } catch (error) {
      console.error("AI Query Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Sorry, I couldn't connect to the campus intelligence system. If you are on a real device, make sure the API URL points to your computer's IP address instead of localhost." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Custom Merged Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={styles.headerRight} /> {/* Placeholder for balance */}
      </View>

      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          {messages.map((msg, index) => {
            if (msg.role === 'assistant') {
              return (
                <View key={index} style={styles.aiMessageRow}>
                  <View style={styles.aiAvatar}>
                    <Ionicons name="hardware-chip" size={16} color="#fff" />
                  </View>
                  <View style={styles.aiBubble}>
                    <Text style={styles.aiMessageText}>{msg.text}</Text>
                  </View>
                </View>
              );
            } else {
              return (
                <View key={index} style={styles.userMessageRow}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userMessageText}>{msg.text}</Text>
                  </View>
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={16} color="#7ba4df" />
                  </View>
                </View>
              );
            }
          })}

          {isLoading && (
            <View style={styles.aiMessageRow}>
              <View style={styles.aiAvatar}>
                <Ionicons name="hardware-chip" size={16} color="#fff" />
              </View>
              <View style={styles.aiBubble}>
                <ActivityIndicator size="small" color="#1458b8" />
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.chipButton} onPress={() => sendMessage(action)}>
              <Text style={styles.chipText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ height: 20 }} />
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
            onSubmitEditing={() => sendMessage(inputText)}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)} disabled={isLoading || !inputText.trim()}>
            <Ionicons name="send" size={20} color="#fff" style={{ marginLeft: 2 }} />
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
