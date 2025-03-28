import { Stack } from 'expo-router';

export default function DeviceLayout() {
    return (
        <Stack>
            <Stack.Screen name='bluetooth' options={{title: 'Conectar Dispositivo'}} />
            <Stack.Screen name='[id]' options={{title: 'Detalle del Dispositivo'}} />
        </Stack>
    )
}