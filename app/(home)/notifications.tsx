import NotificationsScreen from '@/components/notifications';
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function NotiScreen() {
  const { user, loading } = useAuth();

  if (loading) return null; // O muestra un loader

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <NotificationsScreen/>
  );
}
