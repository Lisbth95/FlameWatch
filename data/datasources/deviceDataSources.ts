import { auth, db } from "@/api/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Device} from '@/data/models/device';

/**
 * Obtiene la información de un dispositivo desde Firestore.
 * @param deviceId - ID del dispositivo
 * @returns Datos del dispositivo o null si no existe
 */
export const getDeviceDetail = async (deviceId: string): Promise<Device | null> => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    const deviceSnap = await getDoc(deviceRef);

    if (deviceSnap.exists()) {
      return deviceSnap.data() as Device;
    } else {
      console.warn("Dispositivo no encontrado.");
      return null;
    }
  } catch (error) {
    console.log("Error al obtener dispositivo:", error);
    throw error;
  }
};

/**
 * Guarda un nuevo dispositivo en Firestore.
 * @param userId - ID del usuario dueño del dispositivo
 * @param deviceId - ID del dispositivo
 * @param name - Nombre del dispositivo
 * @param location - Ubicación { latitude, longitude }
 */
export const saveDeviceToFirebase = async (
  userId: string,
  deviceId: string,
  name: string,
  location: { latitude: number; longitude: number } | null 
) => {
  try {
    const deviceRef = doc(db, "devices", deviceId);

    await setDoc(deviceRef, {
      user: userId,
      name,
      location,
      category: "NSJhQRgBNRerJZ3jz2qd", // Puedes cambiar esto según la categoría del dispositivo
      status: "activo",
      createdAt: new Date(),
    });

    console.log("Dispositivo guardado en Firebase");
  } catch (error) {
    console.error("Error al guardar en Firebase:", error);
  }
};