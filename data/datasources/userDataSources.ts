import { supabase } from "@/lib/supabase";
import { User } from "@/data/types/UserTypes";

class UserDatasource {
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    return error ? null : data;
  }

  static async updateUser(updatedFields: Partial<User>): Promise<boolean> {
    // Obtener el usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) return false;

    // Verificar si el usuario ya existe en la tabla "users"
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single(); // Trae solo un registro

    if (selectError && selectError.code !== "PGRST116") {
        console.error("Error al consultar usuario:", selectError.message);
        return false;
    }

    if (!existingUser) {
        // Si el usuario no existe, insertarlo con datos mínimos
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            auth_id: user.id,
            email: user.email,
            full_name: updatedFields.full_name ?? "", // Si no hay nombre, guardar vacío
            phone: updatedFields.phone ?? null,
            profile_picture: updatedFields.profile_picture ?? null,
            created_at: new Date(),
            updated_at: new Date(),
          });

        if (insertError) {
            console.error("Error al insertar usuario:", insertError.message);
            return false;
        }

        return true; // Usuario insertado correctamente
    }

    // Si el usuario ya existe, realizar la actualización
    const { error: updateError } = await supabase
      .from("users")
      .update({ ...updatedFields, updated_at: new Date() })
      .eq("auth_id", user.id);

    if (updateError) {
        console.error("Error al actualizar usuario:", updateError.message);
        return false;
    }

    return true; // Usuario actualizado correctamente
  }

  static async uploadProfilePicture(fileName: string, uri: string): Promise<string | null> {
    try {
        // Convertir la URI a un blob
        console.log("URI de la imagen:", uri);
        const response = await fetch(uri);
        const blob = await response.blob();

        // Subir la imagen al storage de Supabase
        const { data, error } = await supabase.storage
          .from("profile_pictures")
          .upload(fileName, blob, { upsert: true });

        if (error || !data) {
            console.error("Error al subir imagen:", error?.message);
            return null;
        }

        console.log(data);
        // Obtener la URL pública de la imagen
        const publicUrl = supabase.storage.from("profile_pictures").getPublicUrl(data.path).data.publicUrl;

        if (!publicUrl) return null;

        // Obtener el usuario autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!user || authError) {
            console.error("Error al obtener usuario autenticado:", authError?.message);
            return null;
        }

        // Actualizar la URL de la imagen en la tabla users
        const { error: updateError } = await supabase
          .from("users")
          .update({ profile_picture: publicUrl, updated_at: new Date() })
          .eq("auth_id", user.id);

        if (updateError) {
            console.error("Error al actualizar profile_picture:", updateError.message);
            return null;
        }

        return publicUrl; // Retornar la URL pública si todo fue exitoso
    } catch (err) {
        console.error("Error inesperado al subir imagen:", err);
        return null;
    }
  }


  
}

export default UserDatasource;
