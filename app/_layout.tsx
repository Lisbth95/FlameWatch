import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from "react";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth  } from "@/context/AuthContext";

export default function RootLayout() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="(home)" options={{ title: "Home" }} />
            </>
          ) : (
            <>
              <Stack.Screen name="(auth)/login" options={{ title: "Iniciar Sesión" }} />
              <Stack.Screen name="(auth)/register" options={{ title: "Registrarse" }} />
              <Stack.Screen name="(auth)/forgot_password" options={{ title: "Recuperar Contraseña" }} />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
