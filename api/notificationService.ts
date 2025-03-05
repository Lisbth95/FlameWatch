import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// Manejar notificaciones en segundo plano
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Notificación recibida en segundo plano:', remoteMessage);
});

// Manejar notificaciones en primer plano
const handleForegroundNotification = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('Notificación recibida en primer plano:', remoteMessage);
    Alert.alert(remoteMessage?.notification?.title || "", remoteMessage?.notification?.body);
  });
};

// Exportamos la función para usarla en App.js
export { handleForegroundNotification };
