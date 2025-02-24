import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {getUserProfile, updateUserProfile, uploadProfilePhoto} from "@/data/datasources/userDataSources";
import { User } from "@/data/models/users";
import { useAuth } from "@/context/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setCargando(true);
      console.log("user: "+user);
      console.log(userData);
      const currentUser = await getUserProfile(user?.uid||"");
      setUserData(currentUser);
      setUpdatedUser({
        name: currentUser?.name || "",
        phone: currentUser?.phone || "",
        address: currentUser?.address || "",
      });
      setCargando(false);
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      if (!updatedUser.name) {
        Alert.alert("Error", "Por favor completa todos los campos.");
        return;
      }
  
      setCargando(true);
      const success = await updateUserProfile(user?.uid|| "", updatedUser);
        Alert.alert("Éxito", "Perfil actualizado correctamente.");
        setUserData({ ...userData, ...updatedUser });
    } catch (error) {
      Alert.alert("Error", "Servicio no disponible intente mas tarde");
    }finally{
      setCargando(false);
    }
    
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();

      setCargando(true);
      const publicUrl = await uploadProfilePhoto(user?.uid|| "", blob);
      setCargando(false);

      if (publicUrl) {
        setUserData({ ...userData, photo: publicUrl });
      } else {
        Alert.alert("Error", "No se pudo subir la imagen.");
      }
    }
  };

   if (cargando) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#1E1E1E" }}>
      <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Perfil de Usuario
      </Text>

      {(!userData?.name) && (
        <Text style={{ color: "yellow", marginBottom: 10 }}>
          Tu perfil está incompleto. Por favor, actualiza tu información.
        </Text>
      )}

      <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: "center", marginBottom: 20 }}>
        { userData?.photo != "" ? (
          <Image source={{ uri: userData?.photo }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Image source={{ uri: "https://picsum.photos/id/57/200" }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Nombre Completo"
        value={updatedUser.name}
        onChangeText={(text) => setUpdatedUser({ ...updatedUser, name: text })}
        style={{ backgroundColor: "#2E2E2E", color: "#FFF", padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={updatedUser.phone}
        onChangeText={(text) => setUpdatedUser({ ...updatedUser, phone: text })}
        style={{ backgroundColor: "#2E2E2E", color: "#FFF", padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Dirección"
        value={updatedUser.address}
        onChangeText={(text) => setUpdatedUser({ ...updatedUser, address: text })}
        style={{ backgroundColor: "#2E2E2E", color: "#FFF", padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <TouchableOpacity
        onPress={handleUpdateProfile}
        style={{ backgroundColor: "#FF6B00", padding: 12, borderRadius: 10, alignItems: "center" }}
      >
        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}
