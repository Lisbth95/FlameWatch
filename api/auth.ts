import { auth, db } from "@/api/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    User 
} from "firebase/auth";
import { Alert } from "react-native";


// Registrar usuario con correo y contraseña
export const registerUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crear documento en Firestore con información inicial
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "",
        phone: "",
        address: "",
        photo: "",
        createdAt: new Date(),
      });

      return userCredential.user;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
};
  
// Iniciar sesión con correo y contraseña
export const loginUser = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Verificar si existe información en Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Si el documento existe, retornamos los datos
        return { success: true, uid: user.uid, userData: userSnap.data() };
      } else {
        // Si no existe, el usuario no tiene información registrada en Firestore
        return { success: true, uid: user.uid, userData: null };
      }

    } catch (error) {
        Alert.alert("FlameWatch","Usuario y/o contraseña invalida");
        //console.error("Error en el inicio de sesión:", error);
      throw error;
    }
};
  
// Cerrar sesión
export const logoutUser = async () => {
    try {
      console.log("cerrando sesión");
      const result = await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
};
  
// Escuchar cambios en el estado de autenticación
export const authStateListener = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};