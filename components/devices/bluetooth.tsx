import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

export default function BluetoothScreen(){
  const [devices, setDevices] = useState<Device[]>([]);
  const [manager] = useState(new BleManager());

  useEffect(() => {
    const initialize = async () => {
      await requestPermissions();
      scanDevices();
    };

    initialize().catch(console.error);

    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        //PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]);
    }
  };

  const scanDevices = () => {
    setDevices([]); // Reinicia la lista antes de escanear

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }

      if (device && device.id) {
        setDevices(prevDevices => {
          if (!prevDevices.some(d => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      console.log("Escaneo finalizado.");
    }, 10000); // Escanea por 10 segundos
  };

  const connectToDevice = async (device: Device) => {
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      alert(`Conectado a ${device.name || 'Dispositivo'}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Dispositivos Bluetooth Cercanos</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1 }} onPress={() => connectToDevice(item)}>
            <Text>{item.name || 'Dispositivo sin nombre'}</Text>
            <Text>ID: {item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' }
})