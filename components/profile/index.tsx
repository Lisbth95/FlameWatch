import {View, Text, StyleSheet} from 'react-native';

export default function ProfileScreen(){
    return(
        <View style={styles.container}>
            <Text>Pantalla para mostrar los datos del usuario</Text>
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