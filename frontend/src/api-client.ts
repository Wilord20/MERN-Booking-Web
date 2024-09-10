import { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Obtener la URL base de la API desde las variables de entorno

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    // Hacer una petición POST a la API
    method: "POST",
    credentials: "include", // Enviar las cookies de la sesión
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

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token inválido");
    }

    return response.json();
};