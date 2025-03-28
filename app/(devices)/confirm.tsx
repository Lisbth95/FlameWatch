import DetailDevicesScreen from '@/components/devices/detail';
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function ConfirmScreen() {
  const { user, loading } = useAuth();

  if (loading) return null; // O muestra un loader

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <DetailDevicesScreen/>
  );
}