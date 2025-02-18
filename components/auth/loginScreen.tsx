import {View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

export default function LoginScreen(){
    const router = useRouter();

    const handleLogin= ()=>{
        router.push("/(home)");
    }

    return(
        <View style={styles.container}>
            <Text>Pantalla de login</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text>Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#e63946",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 30,
    },
});