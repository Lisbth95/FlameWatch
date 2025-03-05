import React, { useState, useEffect } from "react";
import { View,Text,ScrollView,TouchableOpacity,Image,StyleSheet, ActivityIndicator} from "react-native";
import { FAB, Card, Icon } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { User } from '@/data/models/users';
import {climaData} from '@/data/models/clima';
import { Notification } from "@/data/models/notifications";
import {getUserProfile} from '@/data/datasources/userDataSources';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

const devices = [
  { id: "1", icon: "video-wireless", name: "Camara", location: "Academico 1" },
  { id: "2", icon: "thermometer-bluetooth", name: "Temperatura", location: "Laboratorio" },
  { id: "3", icon: "alarm-light", name: "Alarma", location: "Academico 1" },
  { id: "4", icon: "lightbulb-on", name: "Luces", location: "Ademico 1" },
];

const API_KEY = 'b4ba81f982cc4396a0a143034250203r';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

export default function HomeScreen() {
  const usuario = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [clima, setClima] = useState<climaData | null>(null);
  const [deviceStates, setDeviceStates] = useState(
    devices.reduce((acc, device) => ({ ...acc, [device.id]: false }), {})
  );
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", type: "motion", message: "Movimiento detectado en la sala", timestamp: "Hace 2 min" },
    { id: "2", type: "fire", message: "🔥 ¡Alerta! Posible incendio en la cocina", timestamp: "Hace 10 min" },
    { id: "3", type: "smoke", message: "⚠️ Humo detectado en el garaje", timestamp: "Hace 20 min" },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      //console.log(userData);
      //console.log("uuid: "+usuario.user?.uid);
      if (!userData) {
        const profile = await getUserProfile(usuario.user?.uid || "");
        //console.log(profile);
        setUserData(profile);
      }
      setLoading(false);
    };

    const obtenerClima = async () => {
      const location = await getLocation();
      if (location) {
        const weatherData = await getClima(location.latitude, location.longitude);
        setClima(weatherData);
      }
    };

    obtenerClima();
    
    fetchUserData();
  }, []);
  
  /** Obtenemos la Geolocalización del dispositivo */
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso denegado');
        return null;
      }
  
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      return location.coords;
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      return null;
    }
  };

  //Obteniendo el clima de hoy
  const getClima = async (latitude:number, longitude:number): Promise<climaData | null> => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=b4ba81f982cc4396a0a143034250203&q=${latitude},${longitude}&lang=es&aqi=no`
      );
      if (!response.ok) { 
        // Si el servidor responde con un código de error (404, 500, etc.)
        throw new Error(`Error en la petición: ${response.status}`);
      }
      const data = await response.json();  
      // Verifica que data tenga la estructura esperada
      if (!data || !data.location || !data.current) {
        throw new Error("La respuesta no tiene la estructura esperada");
      }
  
      return data;
    } catch (error) {
      console.error("Error obteniendo el clima:", error);
      return null;
    }
  };

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

        {/* Card para mostrar el clima */}
        <Card style={{ backgroundColor: "#17223b", borderRadius: 20, padding: 15, width: 'auto' }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {/* Icono del clima */}
            <Image style={styles.logoClima} source={{ uri: `https:${clima?.current.condition.icon}` }} />

            {/* Información del clima */}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{clima?.location.region}</Text>
              <Text style={{ color: "white", fontSize: 14 }}>{clima?.current.condition.text}</Text>
            </View>

            {/* Temperatura */}
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{clima?.current.temp_c}° C</Text>
          </View>
        </Card>

        {/* Lista de Dispositivos */}
        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FAB
            icon="video-wireless"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
          />
          <FAB
            icon="thermometer-bluetooth"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
          />
          <FAB
            icon="alarm-light"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
          />
          <FAB
            icon="devices"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
          />
          <FAB
            icon="lightbulb-on"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
          />
          <FAB
            icon="doorbell-video"
            style={styles.fab}
            onPress={() => console.log('Pressed')}
          />
        </ScrollView> 
        
        {/* Lista de Dispositivos */}
        <Text style={styles.sectionTitle}>Mis dispositivos</Text>
        <View style={styles.devicesContainer}>
          {devices.map((device) => (
            <TouchableOpacity key={device.id} style={{ width: "48%" }}  onPress={()=> router.push('/(devices)/detail')}>
              <Card style={styles.myDeviceCard}>
                <View style={styles.deviceHeader}>
                  <Icon source={device.icon} color="#000" size={24} />
                </View>
                <Text style={styles.deviceTitle}>{device.name}</Text>
                <Text style={styles.myDeviceLocation}>{device.location}</Text>
              </Card>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.card} onPress={()=> router.push('/(devices)/bluetooth')}>
            <Ionicons name="add" size={32} color="#555" />
            <Text style={styles.text}>Agregar dispositivo</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", padding: 25},
  logoClima: {width: 55, height: 55},
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20, marginTop: 20 },
  fab: {margin: 8, right: 0, bottom: 0, backgroundColor:'#fff' },
  profileImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: "#FF6B00" },
  greeting: { color: "#FFF", fontSize: 16 },
  userName: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  sectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginBottom: 20, marginTop: 20 },
  deviceCard: { backgroundColor: "#2E2E2E", padding: 15, borderRadius: 10, width: 120, alignItems: "center", marginRight: 10 },
  climaCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10, width: 'auto', alignItems: "center", marginRight: 10 },
  deviceName: { color: "#FFF", fontSize: 14, fontWeight: "bold", marginTop: 5 },
  deviceLocation: { color: "#CCC", fontSize: 12 },
  activo: {color: "green",fontWeight: "bold",marginTop: 10},
  inactivo: {color: "red",fontWeight: "bold",marginTop: 10},
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
  devicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 20,
  },
  myDeviceCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    alignItems: "center",
  },
  deviceHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D2D2D",
  },
  myDeviceLocation: {
    fontSize: 14,
    color: "#888888",
  },
  card: {
    width: '48%', // Tamaño cuadrado
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
});
