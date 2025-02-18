import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logotipo.png')} // Ruta de tu imagen
        style={styles.logo}
        resizeMode="contain" // Ajusta la imagen para que mantenga su aspecto
      />
      <Text style={styles.title}>Iniciar sesión</Text>

      {/* Campo para el nombre de usuario */}
      <TextInput
        style={styles.input}
        placeholder="Usuario"
      />

      {/* Campo para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
      />

      {/* Botón de inicio de sesión */}
      <Button title="Iniciar sesión" onPress={() => { }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: "white"
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
    backgroundColor: "white"
  },
  logo: {
    width: '100%', // La imagen ocupará todo el ancho disponible
    height:200, // Ajusta la altura según tus necesidades
    marginBottom: 20,
  },
});
