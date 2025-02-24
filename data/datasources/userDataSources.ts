import { User } from "@/data/models/users";
import { auth, db, storage } from "@/api/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePassword } from "firebase/auth";

/**
 * Actualiza la información del usuario en Firestore
 * @param userId - ID del usuario en Firestore
 * @param userData - Datos a actualizar
 */
export const updateUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { ...userData, updatedAt: new Date().toISOString() });
    console.log("Usuario actualizado correctamente.");
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

/**
 * Sube la foto de perfil del usuario a Firebase Storage y obtiene la URL pública
 * @param userId - ID del usuario
 * @param file - Archivo de imagen (Blob o File)
 * @returns URL de la imagen subida
 */
export const uploadProfilePhoto = async (userId: string, file: Blob | File): Promise<string> => {
  try {
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Guardar la URL en Firestore
    await updateUserProfile(userId, { photo: downloadURL });

    console.log("Foto de perfil subida correctamente.");
    return downloadURL;
  } catch (error) {
    console.error("Error al subir foto de perfil:", error);
    throw error;
  }
};

/**
 * Obtiene la información del usuario desde Firestore
 * @param userId - ID del usuario
 * @returns Datos del usuario o null si no existe
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    } else {
      console.warn("Usuario no encontrado.");
      return null;
    }
  } catch (error) {
    console.log("Error al obtener usuario:", error);
    throw error;
  }
};

/**
 * Actualiza la contraseña del usuario autenticado
 * @param newPassword - Nueva contraseña del usuario
 */
export const updateUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No hay un usuario autenticado.");
    }
    await updatePassword(user, newPassword);
    console.log("Contraseña actualizada correctamente.");
  } catch (error) {
    console.log("Error al actualizar contraseña:", error);
    throw error;
  }
};