import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth  } from "@/context/AuthContext";

export default function HomeLayout() {
  const { user, loading } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#121212" }, // Color de fondo
        tabBarActiveTintColor: "#FF6B00", // Color del icono activo
        tabBarInactiveTintColor: "#888", // Color del icono inactivo
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configuración",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
