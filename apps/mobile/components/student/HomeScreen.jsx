import React, { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Animated, Pressable, Alert } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter, Stack } from "expo-router"
import { Image } from "expo-image"
import { useAuth } from "@/context/AuthContext"

const { width, height } = Dimensions.get("window")
const SIDEBAR_WIDTH = width * 0.8

const DEFAULT_AVATAR = require("../../assets/images/male_avtar/1.jpeg")

export default function StudentHomeScreen() {
  const { user, signOut, avatar } = useAuth()
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current
  const router = useRouter()

  const userName = user?.name?.split(" ")[0] || "Alex"
  const universityName = "Campus Connect University"

  const toggleMenu = (show) => {
    if (show) {
      setIsMenuVisible(true)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false))
    }
  }

  // Handle local require ID or remote URI
  const profileSource = typeof avatar === 'number' ? avatar : { uri: avatar }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Header / Top Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerName}>{userName}</Text>
            <Text style={styles.headerUniversity}>{universityName}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleMenu(true)}>
            <Image
              source={avatar || DEFAULT_AVATAR}
              style={styles.headerProfilePic}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Image
            source={avatar || DEFAULT_AVATAR}
            style={styles.welcomeProfilePic}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome back, {userName}!</Text>
            <Text style={styles.welcomeSubtitle}>Computer Science • Year 3</Text>
          </View>
        </View>

        {/* Quick Action Tiles */}
        <View style={styles.quickActionsGrid}>
          <QuickActionTile icon="star-outline" label="Grades" color="#3b82f6" bgColor="#dbeafe" />
          <QuickActionTile icon="person-add-outline" label="Attendance" color="#16a34a" bgColor="#dcfce7" />
          <QuickActionTile icon="calendar-outline" label="Events" color="#9333ea" bgColor="#f3e8ff" />
        </View>

        {/* Upcoming Classes Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
          <TouchableOpacity>
            <Text style={styles.viewMoreLink}>View Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingClassesList}>
          <ClassCard
            room="Room 402, Eng. Block"
            title="Advanced Algorithms"
            time="10:00 AM - 11:30 AM"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCHC29YIYSj06txvZj7PhMlJ8JLM57j3xbI2leMgFzfgq1MARrAWnrEusz-SCCeIOjD2NCPhiyeW6yDvLY6dDX_n-AEUSAaBe4BpLilXfxyzOidU4eLvA724C82NJre0QEBPomMXwixSkJ6vx83u92PUgxROnPHL7NTjd1NMVNbyR6abGwmoQpyXwU7obtnELjGT9ngUAVppSzzlxEBE0Pt9qZK-E7kQpCVoeKOVZW1BFH5JXl14zJMSCIAag4qdb_jpbEL80p-6uU"
          />
          <ClassCard
            room="Lab 12, Science Wing"
            title="Database Systems Lab"
            time="01:00 PM - 03:00 PM"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ2UwTfVyP7Dm1aXyJC3MIwjPM5jNCzn5OXsvkJ5frbcNIfSye6722IFjPzo8zW__sp5dmm5eHvRz-L7YkpB5okMiD0h55dJvSCJ6nP9rxgVu0r-6qPHRpyCoXU3IA30Y6Evs76gZtG3dzZC9skTqWHDyDJHW-fQUP4G3taS2gT06FHbZTD1611fjy229OUJzsrMqa-tc3_X-Z2bgTAUrsHAPEQXcb97SAp3s3ysypgi_O6uaWFt8ZZcJ2MHS_dPxrCOg8jFKB-vY"
          />
        </View>

        {/* Recent Announcements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          <TouchableOpacity>
            <Text style={styles.viewMoreLink}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.announcementsCard}>
          <AnnouncementItem
            tag="Academic"
            tagColor="#1458b8"
            time="2 hours ago"
            title="End-semester exam schedule released"
            description="The final schedule for December 2023 examinations has been posted on the student portal. Please check your subject codes..."
            isLast={false}
          />
          <AnnouncementItem
            tag="Campus Life"
            tagColor="#ea580c"
            time="Yesterday"
            title="Annual Hackathon Registration Open"
            description="Sign up for the 48-hour 'Code the Future' hackathon. Exciting prizes for the top three winning teams and interns..."
            isLast={true}
          />
        </View>

        {/* Spacing for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sidebar Menu Modal */}
      <Modal transparent visible={isMenuVisible} animationType="none" onRequestClose={() => toggleMenu(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => toggleMenu(false)} />
          <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.sidebarHeader}>
              <TouchableOpacity onPress={() => toggleMenu(false)} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#0f172a" />
              </TouchableOpacity>
              <Text style={styles.sidebarTitle}>Menu</Text>
            </View>

            <View style={styles.sidebarProfileInfo}>
              <Image
                source={avatar || DEFAULT_AVATAR}
                style={styles.sidebarProfilePic}
                contentFit="cover"
                transition={200}
              />
              <Text style={styles.sidebarUserName}>{user?.name || "Guest"}</Text>
              <Text style={styles.sidebarUserEmail}>{user?.email || "guest@example.com"}</Text>
            </View>

            <View style={styles.sidebarDivider} />

            <View style={styles.sidebarContent}>
              <SidebarItem
                icon="person-outline"
                label="Edit Profile"
                onPress={() => {
                  toggleMenu(false)
                  router.push("/(student)/edit-profile")
                }}
              />
              <SidebarItem
                icon="image-outline"
                label="Change Avatar"
                onPress={() => {
                  toggleMenu(false)
                  router.push("/(student)/avatar-picker")
                }}
              />
              <SidebarItem icon="help-circle-outline" label="Help and Support" onPress={() => toggleMenu(false)} />

              <View style={[styles.sidebarDivider, { marginVertical: 10 }]} />

              <SidebarItem
                icon="log-out-outline"
                label="Logout"
                color="#ef4444"
                onPress={() => {
                  toggleMenu(false)
                  Alert.alert(
                    "Confirm Logout",
                    "Are you sure you want to log out?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Logout",
                        style: "destructive",
                        onPress: () => signOut()
                      }
                    ]
                  )
                }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

function SidebarItem({ icon, label, onPress, color = "#475569" }) {
  return (
    <TouchableOpacity style={styles.sidebarItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.sidebarItemLabel, { color: color }]}>{label}</Text>
    </TouchableOpacity>
  )
}

function QuickActionTile({ icon, label, color, bgColor }) {
  return (
    <TouchableOpacity style={styles.quickActionCard}>
      <View style={[styles.quickActionIconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

function ClassCard({ room, title, time, image }) {
  return (
    <View style={styles.classCard}>
      <View style={styles.classCardInfo}>
        <View style={styles.classRoomContainer}>
          <Ionicons name="location-outline" size={14} color="#94a3b8" />
          <Text style={styles.classRoomText}>{room}</Text>
        </View>
        <Text style={styles.classTitle}>{title}</Text>
        <View style={styles.classTimeContainer}>
          <Ionicons name="time-outline" size={16} color="#1458b8" />
          <Text style={styles.classTimeText}>{time}</Text>
        </View>
      </View>
      <Image source={{ uri: image }} style={styles.classImage} />
    </View>
  )
}

function AnnouncementItem({ tag, tagColor, time, title, description, isLast }) {
  return (
    <View style={[styles.announcementItem, isLast && styles.noBorder]}>
      <View style={styles.announcementTopRow}>
        <View style={[styles.tagBadge, { backgroundColor: tagColor + "15" }]}>
          <Text style={[styles.tagText, { color: tagColor }]}>{tag}</Text>
        </View>
        <Text style={styles.timeAgoText}>{time}</Text>
      </View>
      <Text style={styles.announcementTitle}>{title}</Text>
      <Text style={styles.announcementDescription} numberOfLines={2}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerName: { fontSize: 24, fontWeight: "bold", color: "#0f172a" },
  headerUniversity: { fontSize: 11, fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: 1 },
  headerProfilePic: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: "#1458b8" },

  welcomeSection: { flexDirection: "row", alignItems: "center", padding: 20, gap: 16 },
  welcomeProfilePic: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: "#1458b8" },
  welcomeTextContainer: { flex: 1 },
  welcomeTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  welcomeSubtitle: { fontSize: 13, color: "#64748b", fontWeight: "500" },

  quickActionsGrid: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, gap: 12 },
  quickActionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  quickActionLabel: { fontSize: 12, fontWeight: "700", color: "#0f172a" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  viewMoreLink: { fontSize: 12, fontWeight: "bold", color: "#1458b8" },

  upcomingClassesList: { paddingHorizontal: 20, gap: 12 },
  classCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  classCardInfo: { flex: 1, gap: 4 },
  classRoomContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  classRoomText: { fontSize: 11, color: "#64748b", fontWeight: "600", textTransform: "uppercase" },
  classTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a", marginVertical: 4 },
  classTimeContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  classTimeText: { fontSize: 13, color: "#1458b8", fontWeight: "700" },
  classImage: { width: 90, height: 90, borderRadius: 12 },

  announcementsCard: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", overflow: "hidden" },
  announcementItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  noBorder: { borderBottomWidth: 0 },
  announcementTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  tagBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase" },
  timeAgoText: { fontSize: 10, color: "#94a3b8" },
  announcementTitle: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  announcementDescription: { fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 18 },

  // Sidebar Styles
  modalOverlay: { flex: 1 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  sidebarContainer: {
    position: "absolute", right: 0, top: 0, bottom: 0, width: SIDEBAR_WIDTH,
    backgroundColor: "#fff", paddingVertical: 40, paddingHorizontal: 20,
    elevation: 25, shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10, zIndex: 9999,
  },
  sidebarHeader: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  closeButton: { marginRight: 12 },
  sidebarTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  sidebarProfileInfo: { alignItems: "center", marginBottom: 20 },
  sidebarProfilePic: { width: 110, height: 110, borderRadius: 55, marginBottom: 16, borderWidth: 3, borderColor: "#1458b8" },
  sidebarUserName: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  sidebarUserEmail: { fontSize: 13, color: "#64748b", marginTop: 2 },
  sidebarDivider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 20 },
  sidebarContent: { gap: 8 },
  sidebarItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  sidebarItemLabel: { fontSize: 16, fontWeight: "600" },
})
