import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {supabase} from '@/lib/supabase';

export default function SettingsScreen(){
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", onPress: async() => await supabase.auth.signOut() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      {/* Perfil */}
      <TouchableOpacity style={styles.option} onPress={() => router.push("/(profile)")}>
        <Ionicons name="person-outline" size={24} color="#FF6B00" />
        <Text style={styles.optionText}>Editar perfil</Text>
      </TouchableOpacity>

      {/* Notificaciones */}
      <View style={styles.option}>
        <Ionicons name="notifications-outline" size={24} color="#FF6B00" />
        <Text style={styles.optionText}>Notificaciones</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* Modo Oscuro */}
      <View style={styles.option}>
        <Ionicons name="moon-outline" size={24} color="#FF6B00" />
        <Text style={styles.optionText}>Modo Oscuro</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* Seguridad */}
      <TouchableOpacity style={styles.option} onPress={() => router.navigate("/(auth)/change_password")}>
        <Ionicons name="lock-closed-outline" size={24} color="#FF6B00" />
        <Text style={styles.optionText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
