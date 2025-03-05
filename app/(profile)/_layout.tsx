import { Stack } from 'expo-router';

export default function DeviceLayout() {
    return (
        <Stack>
            <Stack.Screen name='index' options={{title: 'Perfil de usuario'}} />
        </Stack>
    )
}