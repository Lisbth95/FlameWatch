import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import UserDatasource from "@/data/datasources/userDataSources";
import { User } from "@/data/types/UserTypes";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const currentUser = await UserDatasource.getCurrentUser();
      setUser(currentUser);
      setUpdatedUser({
        full_name: currentUser?.full_name || "",
        phone: currentUser?.phone || "",
        profile_picture: currentUser?.profile_picture || "",
      });
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    if (!updatedUser.full_name || !updatedUser.phone) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    const success = await UserDatasource.updateUser(updatedUser);
    setLoading(false);

    if (success) {
      Alert.alert("Éxito", "Perfil actualizado correctamente.");
      setUser({ ...user, ...updatedUser });
    } else {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const fileName = `profile_${user?.id}.jpg`;
      setLoading(true);
      const publicUrl = await UserDatasource.uploadProfilePicture(fileName, uri);
      setLoading(false);

      if (publicUrl) {
        setUpdatedUser({ ...updatedUser, profile_picture: publicUrl });
        await UserDatasource.updateUser({ profile_picture: publicUrl });
        setUser({ ...user, profile_picture: publicUrl });
      } else {
        Alert.alert("Error", "No se pudo subir la imagen.");
      }
    }
  };

  if (loading) {
    return <Text style={{ color: "#FFF"}}>Cargando...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#1E1E1E" }}>
      <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Perfil de Usuario
      </Text>

      {(!user?.full_name || !user?.phone) && (
        <Text style={{ color: "yellow", marginBottom: 10 }}>
          Tu perfil está incompleto. Por favor, actualiza tu información.
        </Text>
      )}

      <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: "center", marginBottom: 20 }}>
        {updatedUser.profile_picture ? (
          <Image source={{ uri: updatedUser.profile_picture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Ionicons name="person-circle-outline" size={100} color="#FF6B00" />
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Nombre Completo"
        value={updatedUser.full_name}
        onChangeText={(text) => setUpdatedUser({ ...updatedUser, full_name: text })}
        style={{ backgroundColor: "#2E2E2E", color: "#FFF", padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={updatedUser.phone}
        onChangeText={(text) => setUpdatedUser({ ...updatedUser, phone: text })}
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
