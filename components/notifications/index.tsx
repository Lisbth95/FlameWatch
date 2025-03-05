import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { FAB, Card, Icon, TextInput } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Notification } from "@/data/models/notifications";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function NotificationsScreen() {
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", type: "motion", message: "Movimiento detectado en la sala", timestamp: "2025-03-01 08:30:00" },
    { id: "2", type: "fire", message: "🔥 ¡Alerta! Posible incendio en la cocina", timestamp: "2025-03-02 12:45:00" },
    { id: "3", type: "smoke", message: "⚠️ Humo detectado en el garaje", timestamp: "2025-03-02 18:10:00" },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications);

  const getIcon = (type: string) => {
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

  const filterByDate = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const filtered = notifications.filter((notification) =>
      notification.timestamp.startsWith(formattedDate)
    );
    setFilteredNotifications(filtered);
  };
  
  if (loading) return null; // O muestra un loader
  
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>

      {/* Selector de fecha */}
      <View style={styles.find}>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>Fecha: {selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        {/* Botón para filtrar */}
        <FAB
          style={styles.buscar}
          icon="calendar-search"
          onPress={filterByDate}
          color="#fff"
        />
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {filteredNotifications.length === 0 ? (
        <Text style={styles.noNotifications}>No hay notificaciones recientes</Text>
      ) : (
        <FlatList
          data={filteredNotifications}
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  dateButton: { padding: 10, backgroundColor: "#ddd", borderRadius: 5, marginBottom: 10 },
  dateText: { fontSize: 16, width:250 },
  filterButton: { padding: 10, backgroundColor: "#007BFF", borderRadius: 5, alignItems: "center" },
  filterText: { color: "#fff", fontSize: 16 },
  noNotifications: { textAlign: "center", marginTop: 20, fontSize: 16 },
  notification: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  textContainer: { marginLeft: 10, flex: 1 },
  message: { fontSize: 16, fontWeight: "bold" },
  timestamp: { fontSize: 14, color: "gray" },
  find: {flexDirection: 'row', alignContent: 'center', alignItems: 'center', marginBottom: 20},
  buscar: {marginLeft:20, backgroundColor:'#2E2E2E', }
});