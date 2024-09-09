import { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Obtener la URL base de la API desde las variables de entorno

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    // Hacer una petición POST a la API
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json(); // Parsear el cuerpo de la respuesta como JSON

  if (!response.ok) {
    // Si la respuesta no fue exitosa
    throw new Error(responseBody.message);
  }
};
