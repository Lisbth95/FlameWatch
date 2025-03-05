import ProfileScreen from '@/components/profile';
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function UserScreen() {
  const { user, loading } = useAuth();

  if (loading) return null; // O muestra un loader

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return (
    <ProfileScreen/>
  );
}