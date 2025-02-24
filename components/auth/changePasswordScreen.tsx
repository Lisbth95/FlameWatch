import React, { useState } from "react";
import { View,Text,TextInput,TouchableOpacity,StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {updateUserPassword} from '@/data/datasources/userDataSources';
import { Try } from "expo-router/build/views/Try";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async() => {
    try{
      if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      await updateUserPassword(newPassword);
    }catch (error){
      alert("Servicio no disponible, intente más tarde.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Contraseña</Text>

      <Text style={styles.label}>Contraseña Actual</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={!showPassword}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Ingresa tu contraseña actual"
        placeholderTextColor="#AAA"
      />

      <Text style={styles.label}>Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={!showPassword}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Ingresa tu nueva contraseña"
        placeholderTextColor="#AAA"
      />

      <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirma tu nueva contraseña"
        placeholderTextColor="#AAA"
      />

      <TouchableOpacity
        style={styles.showPasswordButton}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="#FFF"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  showPasswordButton: {
    position: "absolute",
    right: 30,
    top: 210,
    padding: 5,
  },
  button: {
    backgroundColor: "#FF6B00",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
