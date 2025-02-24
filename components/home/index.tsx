import React, { useState, useEffect } from "react";
import { View,Text,ScrollView,TouchableOpacity,Image,StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CameraPreviewCard from "@/components/ui/cameraPrevieCard";
import { User } from '@/data/models/users';
import {getUserProfile} from '@/data/datasources/userDataSources';
import { useAuth } from "@/context/AuthContext";

const cameras = [
  {id: 1, image: require("@/assets/images/room1.jpeg") }, // Simulación de cámaras
  {id: 2, image: require("@/assets/images/room2.jpeg") },
];

export default function HomeScreen() {
   const { user} = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si no tenemos los datos, podríamos hacer una consulta a Firestore
    const fetchUserData = async () => {
      setLoading(true);
      console.log(userData);
      console.log("uuid: "+user?.uid);
      if (user && user.uid) {
        const profile = await getUserProfile(user.uid);
        setUserData(profile);
      }
      setLoading(false);
    };
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: userData?.photo || "https://picsum.photos/id/57/200" }}
          style={styles.profileImage}
        />
        
        <View>
          <Text style={styles.greeting}>Bienvenido</Text>
          <Text style={styles.userName}>{userData?.name?.trim() || userData?.email}</Text>
          
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      {/* Lista de Dispositivos */}
      <Text style={styles.sectionTitle}>Mis Dispositivos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.deviceCard}>
          <MaterialCommunityIcons name="cctv" size={32} color="#4CAF50" />
          <Text style={styles.deviceName}>Cámaras</Text>
          <Text style={styles.deviceLocation}>Sala</Text>
          <Text style={styles.activo}>Activo</Text>
        </View>
        
        <View style={styles.deviceCard}>
          <MaterialCommunityIcons name="fire" size={32} color="#4CAF50" />
          <Text style={styles.deviceName}>Sensores</Text>
          <Text style={styles.deviceLocation}>Cocina</Text>
          <Text style={styles.activo}>Activo</Text>
        </View>
      </ScrollView> 
      
      {/* Agregar Dispositivo */}
      <TouchableOpacity style={styles.addDeviceButton}>
        <Ionicons name="add-circle-outline" size={32} color="#FFF" />
        <Text style={styles.addDeviceText}>Añadir Dispositivo</Text>
      </TouchableOpacity>
      
      {cameras.map((image, index) => (
        <CameraPreviewCard key={image.id}/>
      ))}

      {/* Notificaciones Recientes */}
      <Text style={styles.sectionTitle}>Notificaciones Recientes</Text>
      <TouchableOpacity style={styles.notification}>
        <MaterialCommunityIcons name="alert" size={24} color="#FF3B30" />
        <Text style={styles.notificationText}>Alerta de humo detectada en Cocina</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.notification}>
        <MaterialCommunityIcons name="alert" size={24} color="#FF3B30" />
        <Text style={styles.notificationText}>Alerta de humo detectada en Cocina</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.notification}>
        <MaterialCommunityIcons name="alert" size={24} color="#FF3B30" />
        <Text style={styles.notificationText}>Alerta de humo detectada en Cocina</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.notification}>
        <MaterialCommunityIcons name="alert" size={24} color="#FF3B30" />
        <Text style={styles.notificationText}>Alerta de humo detectada en Cocina</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", padding: 25, marginTop:15 },
  container_image: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
    marginTop: 15,
    marginBottom: 15
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  profileImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: "#FF6B00" },
  greeting: { color: "#FFF", fontSize: 16 },
  userName: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  sectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  deviceCard: { backgroundColor: "#2E2E2E", padding: 15, borderRadius: 10, width: 120, alignItems: "center", marginRight: 10 },
  deviceName: { color: "#FFF", fontSize: 14, fontWeight: "bold", marginTop: 5 },
  deviceLocation: { color: "#CCC", fontSize: 12 },
  activo: {
    color: "green",
    fontWeight: "bold",
    marginTop: 10,
  },
  inactivo: {
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
  },
  addDeviceButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FF6B00", padding: 12, borderRadius: 10, marginTop: 10 },
  addDeviceText: { color: "#FFF", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  chartContainer: { backgroundColor: "#2E2E2E", borderRadius: 10, padding: 10, alignItems: "center" },
  chart: { borderRadius: 10 },
  notification: { flexDirection: "row", alignItems: "center", backgroundColor: "#2E2E2E", padding: 10, borderRadius: 8, marginTop: 10 },
  notificationText: { color: "#FFF", marginLeft: 10, fontSize: 14 },
  image: { width: "100%", height: "100%", borderRadius: 20, },
  buttonMute: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
  buttonExpand: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
  buttonRecord: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
});
