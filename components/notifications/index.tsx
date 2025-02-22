import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Notification } from "@/data/types/notificationTypes";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", type: "motion", message: "Movimiento detectado en la sala", timestamp: "Hace 2 min" },
    { id: "2", type: "fire", message: "🔥 ¡Alerta! Posible incendio en la cocina", timestamp: "Hace 10 min" },
    { id: "3", type: "smoke", message: "⚠️ Humo detectado en el garaje", timestamp: "Hace 20 min" },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "motion":
        return <Ionicons name="walk" size={24} color="#FF6B00" />;
      case "fire":
        return <Ionicons name="flame" size={24} color="red" />;
      case "smoke":
        return <Ionicons name="cloud" size={24} color="gray" />;
      default:
        return <Ionicons name="alert-circle" size={24} color="white" />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No hay notificaciones recientes</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notification}>
              {getIcon(item.type)}
              <View style={styles.textContainer}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6B00",
    marginBottom: 15,
  },
  noNotifications: {
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  message: {
    color: "#FFF",
    fontSize: 16,
  },
  timestamp: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
});
