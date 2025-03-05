import React, {useState, useEffect} from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Card, Icon } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import CameraPreviewCard from '@/components/ui/cameraPrevieCard';
import MapView, { Marker } from "react-native-maps";
import { useAuth } from "@/context/AuthContext";
import { User } from '@/data/models/users';
import {Device} from '@/data/models/device';
import {getUserProfile} from '@/data/datasources/userDataSources';

const getFormattedDate = () => {
  const today = new Date();
  return today.toLocaleDateString("es-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const modes = [
  { id: "temperatura", icon: "sun-thermometer-outline", label: "Temperatura" },
  { id: "humedad", icon: "water-circle", label: "Humedad" },
  { id: "gas", icon: "fire-circle", label: "Gas" }
];

export default function DetailDevicesScreen() {
  const usuario = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [selectedMode, setSelectedMode] = useState("temperatura"); // Estado inicial
  const [devices, setDevice] = useState<Device>();

  useEffect(() => {
    const fetchUserData = async () => {
      //console.log(userData);
      //console.log("uuid: "+usuario.user?.uid);
      if (!userData) {
        const profile = await getUserProfile(usuario.user?.uid || "");
        //console.log(profile);
        setUserData(profile);
        setDevice({
          id: "12345",
          name: "Sensor IoT - Estación 1",
          temperature: "24",
          humidity: "60",
          gasLevel: "Bajo",
          latitude: 18.619126,
          longitude: -98.4531396,
          imageUrl: "", // Imagen simulada
        });
      } 

    };
    fetchUserData();
  }, []);

    return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Buen día</Text>
            <Text style={styles.username}>{userData?.name}</Text>
          </View>
          <View style={styles.weatherContainer}>
            <Image style={styles.logoClima} source={{ uri: `https://cdn.weatherapi.com/weather/64x64/day/113.png` }} />
            <Text style={styles.weatherText}>14°C & Sunny</Text>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Ubicación</Text>
        
        {/* Mapa con la ubicación */}
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
                latitude: devices?.latitude || 18.619126,
                longitude: devices?.longitude || -98.4531396,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
          >
            <Marker
                coordinate={{ latitude: devices?.latitude || 0, longitude: devices?.longitude || 0 }}
                title={devices?.name}
                description="Ubicación del dispositivo IoT"
            />
          </MapView>
        </View>

        <Text style={styles.sectionTitle}>Datos</Text>
        
        <View style={styles.datos}>
        {selectedMode == "temperatura" && (
          <Card style={styles.dataCard}>
            <View style={{alignItems: "center", justifyContent: "space-between" }}>
              <Icon source='sun-thermometer-outline' color="#fff" size={80} />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginTop: 5 }}>Temperatura</Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginTop: 5 }}>{devices?.temperature}° C</Text>
            </View>
          </Card>         
        )}

        {selectedMode == "humedad" && (
          <Card style={styles.dataCard}>
            <View style={{alignItems: "center", justifyContent: "space-between" }}>
              <Icon source='water-circle' color="#fff" size={80} />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginTop: 5 }}>Humedad</Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginTop: 5 }}>{devices?.humidity} %</Text>
            </View>
          </Card>
        )}
        
        {selectedMode == "gas" && (
          <Card style={styles.dataCard}>
            <View style={{alignItems: "center", justifyContent: "space-between" }}>
              <Icon source='fire-circle' color="#fff" size={80} />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginTop: 5 }}>Nivel de Gas</Text>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginTop: 5 }}>{devices?.gasLevel}</Text>
            </View>
          </Card>
        )}
        </View>

        <View style={styles.botonesDatos}>
          {modes.map((item) => {
            const isSelected = item.id === selectedMode;
            return(
              <TouchableOpacity key={item.id} style={styles.button} onPress={() => setSelectedMode(item.id)}>
                {isSelected ? (
                  <LinearGradient colors={["#FF7EB3", "#FF758C"]} style={styles.selectedCircle}>
                    <Icon source={item.icon} size={28} color="#fff" />
                  </LinearGradient>
                ) : (
                  <View style={styles.circle}>
                    <Icon source={item.icon} size={28} color="#555" />
                  </View>
                )}
                <Text style={[styles.label, isSelected && styles.selectedLabel]}>{item.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={{marginBottom: 40}}>
          <CameraPreviewCard />
        </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1,padding: 16,backgroundColor: "#f8f9fa",},
      image: { width: "100%",height: 200, borderRadius: 10,marginBottom: 16,},
      title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
      },
      info: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5,
      },
      map: {
        flex: 1,
        borderRadius: 10,
        width: "100%",
        height: 200, // Asegúrate de que tenga altura suficiente
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
      },
      greeting: {
        fontSize: 16,
        color: "#888",
      },
      username: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#000",
      },
      weatherContainer: {
        alignItems: "flex-end",
      },
      weatherText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
      },
      dateText: {
        fontSize: 14,
        color: "#666",
      },
      logoClima: {width: 55, height: 55},
      sectionTitle: { color: "black", fontSize: 18, fontWeight: "bold", marginBottom: 10, marginTop: 10, marginLeft:20},
      dataCard: {backgroundColor: "#2E2E2E", borderRadius: 20, padding: 15, width: '90%', height:180, marginTop: 15, marginBottom:20, alignItems: 'center'},
      fab: {margin: 8, right: 0, bottom: 0, backgroundColor:'#fff' },
      circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
      },
      selectedCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
      },
      button: {
        alignItems: "center",
        marginHorizontal: 10,
      },
      label: {
        marginTop: 5,
        fontSize: 14,
        color: "#555",
      },
      selectedLabel: {
        fontWeight: "bold",
        color: "#FF758C",
      },
      datos: {justifyContent: 'center', alignItems: 'center', },
      botonesDatos: {flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginBottom:20},
  });
  