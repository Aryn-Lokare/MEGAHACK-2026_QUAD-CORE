import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 3;

const MALE_AVATARS = [
  require('@/assets/images/male_avtar/1.jpeg'),
  require('@/assets/images/male_avtar/2.jpeg'),
  require('@/assets/images/male_avtar/3.jpeg'),
  require('@/assets/images/male_avtar/4.jpeg'),
  require('@/assets/images/male_avtar/5.jpeg'),
  require('@/assets/images/male_avtar/6.jpeg'),
  require('@/assets/images/male_avtar/7.jpeg'),
  require('@/assets/images/male_avtar/8.jpeg'),
  require('@/assets/images/male_avtar/9.jpeg'),
];

const FEMALE_AVATARS = [
  require('@/assets/images/female_avtar/1.jpeg'),
  require('@/assets/images/female_avtar/2.jpeg'),
  require('@/assets/images/female_avtar/3.jpeg'),
  require('@/assets/images/female_avtar/4.jpeg'),
  require('@/assets/images/female_avtar/5.jpeg'),
  require('@/assets/images/female_avtar/6.jpeg'),
  require('@/assets/images/female_avtar/7.jpeg'),
  require('@/assets/images/female_avtar/8.jpeg'),
];

export default function AvatarPickerScreen() {
  const [activeTab, setActiveTab] = useState('male'); // 'male' or 'female'
  const { avatar, setAvatar } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const router = useRouter();

  const currentAvatars = activeTab === 'male' ? MALE_AVATARS : FEMALE_AVATARS;

  const handleConfirm = async () => {
    if (selectedAvatar) {
      // If it's a local require ID, it will be a number. 
      // AuthContext expects a string for AsyncStorage, but Image handles both.
      // We'll store it as is (require returns a numeric ID in React Native)
      await setAvatar(selectedAvatar);
      router.back();
    }
  };

  const renderAvatarItem = ({ item }) => {
    const isSelected = selectedAvatar === item;
    return (
      <TouchableOpacity 
        style={[styles.avatarItem, isSelected && styles.selectedItem]} 
        onPress={() => setSelectedAvatar(item)}
      >
        <Image source={item} style={styles.avatarImage} contentFit="cover" />
        {isSelected && (
          <View style={styles.checkOverlay}>
            <Ionicons name="checkmark-circle" size={24} color="#1458b8" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Choose Avatar',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#f8fafc' },
        headerTitleStyle: { fontWeight: 'bold', color: '#0f172a' },
      }} />

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'male' && styles.activeTab]} 
          onPress={() => setActiveTab('male')}
        >
          <Ionicons name="male" size={20} color={activeTab === 'male' ? '#1458b8' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'male' && styles.activeTabText]}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'female' && styles.activeTab]} 
          onPress={() => setActiveTab('female')}
        >
          <Ionicons name="female" size={20} color={activeTab === 'female' ? '#1458b8' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'female' && styles.activeTabText]}>Female</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentAvatars}
        renderItem={renderAvatarItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  tabs: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    margin: 20, 
    padding: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    borderRadius: 8,
    gap: 8,
  },
  activeTab: { backgroundColor: '#eff6ff' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#1458b8' },
  
  listContent: { padding: 15 },
  avatarItem: { 
    width: COLUMN_WIDTH, 
    height: COLUMN_WIDTH, 
    margin: 5, 
    borderRadius: 16, 
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedItem: { borderColor: '#1458b8' },
  avatarImage: { width: '100%', height: '100%' },
  checkOverlay: { 
    position: 'absolute', 
    top: 5, 
    right: 5, 
    backgroundColor: '#fff', 
    borderRadius: 12 
  },
  
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  confirmButton: { 
    backgroundColor: '#1458b8', 
    borderRadius: 14, 
    paddingVertical: 16, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1458b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
