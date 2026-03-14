import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/lib/supabase';

export default function PerformanceScreen() {
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    async function loadPerformanceData() {
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          Alert.alert('Authentication Error', 'You must be logged in to view performance predictions.');
          setLoading(false);
          return;
        }

        let apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

        const response = await fetch(`${apiUrl}/api/student/prediction`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch predictions: ${response.status}`);
        }

        const data = await response.json();
        setRiskLevel(data.riskLevel);

        if (data.riskLevel === 'High') {
          // Fallback to local alert to avoid Expo Go SDK 53 native module limitations
          Alert.alert(
            "Academic Alert ⚠️",
            "Your performance prediction shows High risk. Consider seeing an advisor or generating a new study plan."
          );
        }
      } catch (error) {
        console.error('[PerformanceScreen] Fetch Error:', error);
        Alert.alert('Error', 'Failed to load performance metrics.');
      } finally {
        setLoading(false);
      }
    }

    loadPerformanceData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 16 }}>Performance Metrics</ThemedText>

      {loading ? (
        <ActivityIndicator size="large" color="#1458b8" />
      ) : (
        <View style={styles.card}>
          <ThemedText style={styles.label}>Predicted Risk Level:</ThemedText>
          <ThemedText style={[
            styles.riskText,
            riskLevel === 'High' ? styles.highRisk : riskLevel === 'Medium' ? styles.mediumRisk : styles.lowRisk
          ]}>
            {riskLevel || 'Unknown'}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '90%'
  },
  label: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600'
  },
  riskText: {
    fontSize: 32,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  highRisk: {
    color: '#ef4444' // Red
  },
  mediumRisk: {
    color: '#f59e0b' // Amber
  },
  lowRisk: {
    color: '#10b981' // Emerald
  }
});
