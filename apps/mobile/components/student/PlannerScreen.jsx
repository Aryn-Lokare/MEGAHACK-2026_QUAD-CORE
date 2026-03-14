import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const DEFAULT_AVATAR = require("../../assets/images/male_avtar/1.jpeg");

export default function PlannerScreen() {
  const { user, avatar } = useAuth();

  const days = [
    { day: 'Mon', date: '2' },
    { day: 'Tue', date: '3' },
    { day: 'Wed', date: '4' },
    { day: 'Thu', date: '5', active: true },
    { day: 'Fri', date: '6' },
    { day: 'Sat', date: '7' },
    { day: 'Sun', date: '8' },
  ];

  const tasks = [
    {
      category: 'Computer Science',
      title: 'Algorithms Assignment 4',
      time: 'Oct 6, 2023 • 11:59 PM',
      icon: 'document-text',
      color: '#2563eb',
      bgColor: '#dbeafe',
    },
    {
      category: 'Physics II',
      title: 'Mid-Term Quiz 2',
      time: 'Oct 8, 2023 • 10:00 AM',
      icon: 'help-circle',
      color: '#d97706',
      bgColor: '#fef3c7',
    },
    {
      category: 'UI/UX Design',
      title: 'Final Case Study Draft',
      time: 'Oct 12, 2023 • 05:00 PM',
      icon: 'people',
      color: '#059669',
      bgColor: '#d1fae5',
    }
  ];

  const reminders = [
    { id: 1, title: 'Library Book Return', sub: 'Central Library - Main Wing', time: '02:30 PM', completed: false },
    { id: 2, title: 'Gym Session', sub: 'Campus Sports Complex', time: '07:00 AM', completed: true },
  ];

  const userName = user?.name?.split(" ")[0] || "Alex";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{userName}</Text>
          <Text style={styles.headerSubtitle}>Campus Connect University</Text>
        </View>
        <Image
          source={avatar || DEFAULT_AVATAR}
          style={styles.profilePic}
          contentFit="cover"
        />
      </View>

      {/* Calendar Section */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.monthTitle}>October 2023</Text>
          <View style={styles.calendarNav}>
            <Ionicons name="chevron-back" size={20} color="#94a3b8" />
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {days.map((item, index) => (
            <View key={index} style={[styles.dayCard, item.active && styles.activeDayCard]}>
              <Text style={[styles.dayName, item.active && styles.activeText]}>{item.day}</Text>
              <Text style={[styles.dayDate, item.active && styles.activeText]}>{item.date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
      </View>

      <View style={styles.tasksList}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskCard}>
            <View style={[styles.taskIconContainer, { backgroundColor: task.bgColor }]}>
              <Ionicons name={task.icon} size={24} color={task.color} />
            </View>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskCategory, { color: task.color }]}>{task.category.toUpperCase()}</Text>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={styles.taskMeta}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={styles.taskTime}>{task.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personal Reminders</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#1458b8" />
        </TouchableOpacity>
      </View>

      <View style={styles.remindersList}>
        {reminders.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.reminderCard, item.completed && styles.completedReminder]}>
            <View style={styles.reminderContent}>
              <Text style={[styles.reminderTitle, item.completed && styles.completedText]}>{item.title}</Text>
              <Text style={[styles.reminderSub, item.completed && styles.completedSubText]}>{item.sub}</Text>
            </View>
            <View style={styles.reminderRight}>
              <Text style={[styles.reminderTime, item.completed && styles.completedSubText]}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  contentContainer: { paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1458b8' },
  headerSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  profilePic: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#1458b820' },
  calendarContainer: { backgroundColor: '#fff', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  monthTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  calendarNav: { flexDirection: 'row', gap: 16 },
  daysScroll: { paddingHorizontal: 20, gap: 12 },
  dayCard: { width: 56, height: 80, borderRadius: 14, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  activeDayCard: { backgroundColor: '#1458b8', borderColor: '#1458b8', shadowColor: '#1458b8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  dayName: { fontSize: 11, fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: 6 },
  dayDate: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  activeText: { color: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  viewAllText: { fontSize: 14, fontWeight: '700', color: '#1458b8' },
  tasksList: { paddingHorizontal: 24, gap: 12 },
  taskCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  taskIconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  taskInfo: { flex: 1, marginLeft: 16 },
  taskCategory: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  taskTitle: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  taskTime: { fontSize: 12, color: '#64748b' },
  addButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1458b815', alignItems: 'center', justifyContent: 'center' },
  remindersList: { paddingHorizontal: 24, gap: 10 },
  reminderCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 18, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#1458b8', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  completedReminder: { borderLeftColor: '#cbd5e1' },
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  reminderSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  reminderRight: { alignItems: 'flex-end' },
  reminderTime: { fontSize: 14, fontWeight: '800', color: '#1458b8' },
  completedText: { color: '#94a3b8', textDecorationLine: 'line-through' },
  completedSubText: { color: '#cbd5e1' },
});
