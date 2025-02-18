import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function InicioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlameWatch</Text>
      {/* Texto de bienvenida */}
      <Text style={styles.description}>
        Bienvenido a la aplicación. Esta es una aplicación que
        te ayudará a gestionar datos.
      </Text>

      {/* Imagen del mapa */}
      <Image
        source={require('../../assets/images/mapa.jpg')} // Ruta de tu imagen
        style={styles.logo}
        resizeMode="contain" // Ajusta la imagen para que mantenga su aspecto
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2D2D2D', // Fondo oscuro para contrastar con el texto blanco
    padding:25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'white', // Título en blanco
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white', // Descripción en blanco
  },
  logo: {
    width: '100%', // La imagen ocupará todo el ancho disponible
    height: 200, // Ajusta la altura según tus necesidades
    marginBottom: 20,
  },
});
