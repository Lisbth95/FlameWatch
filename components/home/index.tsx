import {View, Text, StyleSheet} from 'react-native';

export default function HomeScreen(){
    return(
        <View style={styles.container}>
            <Text>Pantalla Home</Text>
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