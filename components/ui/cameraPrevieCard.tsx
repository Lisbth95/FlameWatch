import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CameraPreviewCard() {
  return (
    <View style={styles.card}>
      {/* Imagen simulando la previsualización */}
      <Image
        source={require("@/assets/images/schoool.jpg")} // Cambia por tu imagen
        style={styles.image}
        resizeMode="cover"
      />

      {/* Controles sobre la imagen */}
      <TouchableOpacity style={styles.buttonMute}>
        <Ionicons name="mic-off" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonExpand}>
        <Ionicons name="expand" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonRecord}>
        <Ionicons name="radio-button-on" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 10,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 180,
  },
  buttonMute: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  buttonExpand: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
  buttonRecord: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
});
