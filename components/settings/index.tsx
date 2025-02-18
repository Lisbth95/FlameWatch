import {View, Text, StyleSheet} from 'react-native';

export default function SettingsScreen(){
    return(
        <View style={styles.container}>
            <Text>Pantalla para modificar los settings de la aplicacion</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
    }
});