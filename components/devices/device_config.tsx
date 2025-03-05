import {View, Text, StyleSheet} from 'react-native';

export default function DeviceConfigScreen()
{
    return(
        <View style={styles.container}>
            <Text>Pantalla para configurar dispositivo</Text>
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