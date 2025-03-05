import { auth, db } from "@/api/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    User,
    sendPasswordResetEmail 
} from "firebase/auth";
import { Device} from '@/data/models/device';

/**
 * Obtiene la información del usuario desde Firestore
 * @param userId - ID del usuario
 * @returns Datos del usuario o null si no existe
 */
export const getDeviceDetail = async (userId: string): Promise<Device | null> => {
  try {
    const userRef = doc(db, "devices", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as Device;
    } else {
      console.warn("Devices no encontrado.");
      return null;
    }
  } catch (error) {
    console.log("Error al obtener Device:", error);
    throw error;
  }
};