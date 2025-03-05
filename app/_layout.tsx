import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {handleForegroundNotification} from '@/api/notificationService';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken =  async() => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  }

  useEffect( () => {
    requestUserPermission();
    getToken();
    handleForegroundNotification();
  })

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(home)" options={{ title: "Home" }} />
              <Stack.Screen name="(auth)/login" options={{ title: "Iniciar Sesión" }} />
              <Stack.Screen name="(auth)/register" options={{ title: "Registrarse" }} />
              <Stack.Screen name="(auth)/forgot_password" options={{ title: "Recuperar Contraseña" }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
