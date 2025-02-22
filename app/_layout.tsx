import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from '@/components/auth/loginScreen';
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    // Escuchar cambios de sesión en Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      //setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) router.replace("/(auth)/login");
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {session ? (
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
    </ThemeProvider>
  );
}
