import React, { useState, useEffect } from 'react';
import { View, FlatList, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { Avatar,Text, Card, IconButton, Button, FAB, ActivityIndicator, TextInput, Icon} from 'react-native-paper';
import * as Location from "expo-location";
import StepIndicator from "react-native-step-indicator";
import WifiManager from "react-native-wifi-reborn";
import { WifiEntry} from '@/data/models/wifi';
import { useAuth } from "@/context/AuthContext";
import {saveDeviceToFirebase} from '@/data/datasources/deviceDataSources';
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import BluetoothSerial, { BluetoothDevice } from "react-native-bluetooth-classic"; 
import { useRouter } from "expo-router";

export default function BluetoothScreen(){
  const [devices, setDevices] = useState<BluetoothDevice[]>([]); 
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const usuario = useAuth();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
  const [selectedSSID, setSelectedSSID] = useState("");
  const [password, setPassword] = useState("");

  const labels = ["Conectar", "Configurar", "Ubicación", "Confirmar"];
  const [currentStep, setCurrentStep] = useState(0);
  const [deviceName, setDeviceName] = useState("FlameWath-00");
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const router = useRouter();
  

  const nextStep = () => {setCurrentStep((prev) => Math.min(prev + 1, labels.length - 1)); console.log(currentStep);}
  const prevStep = () => {setCurrentStep((prev) => Math.max(prev - 1, 0)); console.log(currentStep);}
  const SERVICE_UUID = "180F"; // UUID del servicio
  const WIFI_STATUS_UUID = "2A1B"; // UUID de la característica de estado WiFi

  // Mostrar u ocultar modal
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    checkBluetoothStatus();

    const initialize = async () => {
      await requestPermissions();
      scanDevices();
      scanWifi();
    };
    
    initialize().catch(console.log);
    // obtenemos las coordenadas
    getLocation();

  }, []);

  // Verificar si el Bluetooth está activado
  const checkBluetoothStatus = async () => {
    const state = await BluetoothStateManager.getState();
    if (state === "PoweredOn") {
      setBluetoothEnabled(true);
    } else {
      setBluetoothEnabled(false);
    }
  };

  // Intentar activar el Bluetooth
  const enableBluetooth = async () => {
    BluetoothStateManager.requestToEnable()
      .then(() => {
        setBluetoothEnabled(true);
        alert("Ahora puedes agregar un dispositivo.");
        scanDevices();
      })
      .catch(() => {
        alert(
          "Por favor, activa el Bluetooth en la configuración."
        );
      });
  };

  // Solicitamos permisos de bluetooth al usuario
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        //PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]);
    }
  };

  /** Obtenemos la Geolocalización del dispositivo */
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (error) {
      console.log('Error obteniendo la ubicación:', error);
      return null;
    }
  };

  // Escaneamos los dispositivos Bluetooth disponibles
  const scanDevices = async() => {
    try {
      setLoading(true);
      const availableDevices = await BluetoothSerial.startDiscovery();
      setDevices(availableDevices);
    } catch (error) {
      console.log("Error al escanear dispositivos:", error);
    } finally{
      setLoading(false);
    }

    //console.log(devices);
  };

  // Función para escanear redes WiFi
  const scanWifi = async () => {
    try {
      setLoading(true);
      const wifiArray = await WifiManager.loadWifiList();
      setWifiList(wifiArray);
    } catch (error) {
      alert("No se pudo obtener la lista de redes WiFi.");
    }finally{
      setLoading(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      // Intentar emparejar el dispositivo (opcional en algunos dispositivos)
      const paired = await BluetoothSerial.pairDevice(device.id);
      if (paired) {
        console.log(`Dispositivo emparejado: ${device.name}`);
        const connected = await BluetoothSerial.connectToDevice(device.id);
        if (connected) {
          setConnectedDevice(device);
          nextStep();
          alert( `Conectado a ${device.name}`);
        }
      } else {
        alert("No se pudo emparejar el dispositivo.");
      }
    } catch (error) {
      console.log("Error al emparejar/conectar:", error);
      alert("No se pudo conectar al dispositivo.");
    }
  };

  // Enviar credenciales WiFi por Bluetooth Clásico
  const sendWifiCredentials = async (ssid: string, password: string, userID: string, deviceName: string) => {
    try {
      if (!connectedDevice) {
        alert("No hay un dispositivo conectado.");
        return;
      }
      const wifiData = JSON.stringify({ ssid, password, userID, deviceName });
      // Usamos `device.write()` en lugar de `BluetoothSerial.write()`
      await connectedDevice.write(wifiData);
      console.log("Credenciales enviadas al ESP32");
      alert("Credenciales enviadas al ESP32.");
    } catch (error) {
      console.log("Error al enviar credenciales:", error);
      alert("Error al enviar credenciales al ESP32.");
    }
  };

  // Leer estado de conexión desde el ESP32
  const checkWifiConnectionStatus = async (): Promise<boolean> => {
    try {
      if (!connectedDevice) {
        alert("No hay un dispositivo conectado.");
        return false;
      }
      return new Promise((resolve, reject) => {
        connectedDevice.read().then((response) => { // ✅ Usamos `read()` correctamente
          console.log("Estado WiFi recibido:", response);
          if (response && response.trim() !== "" && response.includes("success")) { // ✅ Verificamos que la respuesta no sea vacía
            alert("El dispositivo se conectó exitosamente a WiFi.");
            resolve(true);

          } else {
            alert("El dispositivo no pudo conectarse a WiFi.");
            resolve(false);
          }
        }).catch((error) => {
          console.log("Error al leer estado WiFi:", error);
          reject(false);
        });
      });
    } catch (error) {
      console.log("Error al monitorear el estado WiFi:", error);
      return false;
    }
  };

  // Configurar dispositivo ESP32
  const configureDevice = async () => {
    console.log("Guardando configuracion");
    if (!connectedDevice) {
      console.log("Error: No hay un dispositivo conectado.");
      alert("Error: No hay un dispositivo conectado.");
      return;
    }
  
    console.log("Enviando y guardando configuración...");
    
    try {
      await sendWifiCredentials(selectedSSID, password, usuario.user?.uid || "", deviceName);

      console.log("Esperando respuesta del dispositivo...");
      setTimeout(async () =>{
        const success = await checkWifiConnectionStatus();
        if (success) {
          await saveDeviceToFirebase(usuario.user?.uid || "", connectedDevice.id, deviceName, location);
          alert("Dispositivo guardado correctamente.");
          router.push({
            pathname: "/(home)"
          });
        } else {
          alert("Error: El Dispositivo no pudo conectarse a la red WiFi.");
        }
      }, 10000)

    } catch (error) {
      console.log("Error en la configuración del dispositivo:", error);
      alert("Ocurrió un error al configurar el dispositivo.");
    }
  };

  const selectWifi = (ssid: string) => {
    console.log(ssid);
    setSelectedSSID(ssid);
    showModal();
  }

  return (
    <View style={styles.container}>
      <StepIndicator customStyles={customStyles} currentPosition={currentStep} labels={labels} stepCount={4} />
      {/* Conexión con bluetooth */}
      {currentStep === 0 && (
        <>
          <View style={{display:'flex', flexDirection: "row"}}>

            <Text style={styles.title}>Dispositivos</Text>
            <IconButton
              icon="autorenew"
              iconColor="#aaaaaa"
              size={30}
              onPress={scanDevices}
              />
          </View>
          {!bluetoothEnabled && (
            <Button icon="bluetooth" mode="elevated" onPress={enableBluetooth} buttonColor="#aaaaaa" textColor="#fff">
              Encender Bluetooth
            </Button>
          )}
          {loading &&<ActivityIndicator animating={true} size={300} style={styles.activityInd} color="#FF6B00" />}
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity  onPress={() => connectToDevice(item)}>
                <Card.Title
                  style={styles.dispositivos}
                  title={item.name || "Dispositivo sin nombre"}
                  subtitle={item.id}
                  left={(props) => <Avatar.Icon color='#fff' style={styles.icono} {...props} icon="devices" />}
                  right={(props) => <IconButton iconColor='#FF6B00' {...props} icon="bluetooth-connect"/>}
                  />
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <FAB
              label="Siguiente"
              style={styles.fab}
              onPress={nextStep} 
            />
          </View>
        </>
      )}
      {/* Conexión con WiFi */}
      {currentStep === 1 && (
        <>
            <Text style={styles.title}>Selecciona una red WiFi</Text>
            <FlatList
              contentContainerStyle={{ paddingBottom: 30 }} 
              data={wifiList}
              keyExtractor={(item) => item.BSSID}
              renderItem={({ item }) => (
                <TouchableOpacity  onPress={() => selectWifi(item.SSID)}>
                  <Card.Title
                    style={styles.dispositivos}
                    title={item.SSID|| 'Red Oculta'}
                    subtitle={item.BSSID}
                    left={(props) => <Avatar.Icon color='#fff' style={styles.icono} {...props} icon="wifi-lock" />}
                    />
                </TouchableOpacity>
              )}
            />
            <View style={styles.buttonContainer}>
              <FAB
                label="Atrás"
                style={styles.fab}
                onPress={prevStep} 
              />
              <FAB
                label="Siguiente"
                style={styles.fab}
                onPress={nextStep} 
              />
            </View>
            {/* Modal para indicar la contraseña de la red wifi */}
            <Modal animationType="slide" visible={visible} onDismiss={hideModal}>
              <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Contraseña de {selectedSSID}:</Text>
              <TextInput
                placeholder="Ingrese la contraseña"
                mode='outlined'
                label="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={styles.buttonModal}>  
                <Button mode="contained" onPress={hideModal} style={styles.button} buttonColor='#aaaaaa'>
                  Cancelar
                </Button>
                <Button mode="contained" onPress={()=> {hideModal(); nextStep()}} style={styles.button} buttonColor='#aaaaaa'>
                  Guardar
                </Button>
              </View>
            </View>
            </Modal>
        </>
      )}

      {/* Renombrar dispositivo y ubicación */}
      {currentStep === 2 && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Selecciona la ubicación del dispositivo</Text>
          <View>
            <TextInput
              style={styles.input}
              mode='outlined'
              label="Dispositivo"
              placeholder={deviceName}
              onChangeText={setDeviceName}
              value={deviceName}
            />
          </View>

          <Text style={styles.title}>Ubicación: </Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 37.7749,
              longitude: location?.longitude || -122.4194,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => {setLocation(e.nativeEvent.coordinate); console.log(e.nativeEvent.coordinate)}}
          >
            {location && <Marker coordinate={location} />}
          </MapView>

          <View style={styles.buttonContainer}>
            <FAB
              label="Atrás"
              style={styles.fab}
              onPress={prevStep} 
            />
            <FAB
              label="Siguiente"
              style={styles.fab}
              onPress={nextStep} 
            />
          </View>
        </View>
      )}

      {currentStep === 3 && (
        <View style={styles.container}>
          <Text style={styles.title}>Confirmar detalles</Text>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.label}>Nombre:</Text>
              <View style={styles.detailRow}>
                <Icon source="devices" color="#aaaaaa" size={30}/>
                <Text variant="titleMedium" style={styles.value}>{deviceName}</Text>
              </View>
              <Text variant="titleLarge" style={styles.label}>WiFi:</Text>
              <View style={styles.detailRow}>
                <Icon source="wifi" color="#aaaaaa" size={30}/>
                <Text variant="titleMedium" style={styles.value}>{selectedSSID}</Text>
              </View>
              <Text variant="titleLarge" style={styles.label}>Ubicación:</Text>
              <View style={styles.detailRow}>
                <Icon source="google-maps" color="#aaaaaa" size={40}/>
                <Text variant="titleMedium" style={styles.value}>
                  {location ? `${location.latitude}, ${location.longitude}` : "No seleccionada"}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 37.7749,
              longitude: location?.longitude || -122.4194,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {location && <Marker coordinate={location} />}
          </MapView>
          <View style={styles.buttonContainer}>
            <FAB
              label="Atrás"
              style={styles.fab}
              onPress={prevStep} 
            />
            <FAB
              label="Guardar"
              style={styles.fab}
              onPress={() => configureDevice()} 
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {fontSize: 20, fontWeight: 'bold', marginTop: 20, color: "#aaaaaa", marginBottom: 20},
  icono: { backgroundColor: '#aaaaaa'},
  dispositivos: {borderWidth: 1, borderRadius: 5, borderColor: "#aaaaaa"},
  map: {flex: 1,borderRadius: 10,width: "100%", height: 120},
  fab: { width: "35%"},
  buttonContainer: {flexDirection: "row",justifyContent: "space-between",alignItems: "center",position: "absolute",bottom: 20,left: 20,right: 20},
  buttonModal: {flexDirection: "row", justifyContent: "space-evenly"},
  activityInd: { marginTop: 50},
  modal:{flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20},
  modalContent: { width: "80%", backgroundColor: "white", padding: 20},
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center"},
  input: {marginBottom: 15},
  button: { marginTop: 20, marginRight:30, padding: 5},
  textColor: { color: "#FF6B00"},
  containerDetail: {flex: 1,backgroundColor: "#F5F5F5", padding: 20, alignItems: "center"},
  card: { width: "100%", backgroundColor: "white", padding: 5, borderRadius: 10, elevation: 3},
  detailRow: { flexDirection: "row", marginBottom: 5 },
  value: { fontWeight: "400", color: "#000", marginLeft: 10 },
  label: { fontWeight: "500", color: "#555" },
})

const customStyles = {
  stepIndicatorSize: 45,
  currentStepIndicatorSize: 50,
  separatorStrokeWidth: 4,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: "#FF6B00", //contorno del circulo paso actual
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: "#FF6B00", //contorno del circulo paso completado
  stepStrokeUnFinishedColor: "#aaaaaa", //contorno del circulo paso pendiente
  separatorFinishedColor: "#aaaaaa", // linea que separa circulos de pasos completados
  separatorUnFinishedColor: "#aaaaaa", // linea que separa circulos de pasos pendientes
  stepIndicatorFinishedColor: "#121212", // color del fondo del circulo de un paso completado
  stepIndicatorUnFinishedColor: "#ffffff", //Color de fondo de pasos pendientes
  stepIndicatorCurrentColor: "#FF6B00", // Color de fondo del paso actual
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 14,
  stepIndicatorLabelCurrentColor: "#fff", // color del texto de paso actual
  stepIndicatorLabelFinishedColor: "#fff", // Color del texto del paso completado
  stepIndicatorLabelUnFinishedColor: "#aaaaaa", // color del texto del paso pendiente
  currentStepLabelColor: "#aaaaaa",
};