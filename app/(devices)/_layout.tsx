import { Stack } from 'expo-router';

export default function DeviceLayout() {
    return (
        <Stack>
            <Stack.Screen name='bluetooth' options={{title: 'Conectar vía Bluetooth'}} />
            <Stack.Screen name='detail' options={{title: 'Detalle del dispositivo'}} />
            <Stack.Screen name='wifi' options={{title: 'Conectar con WiFi'}} />
        </Stack>
    )
}