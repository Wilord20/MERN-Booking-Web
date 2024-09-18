import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelType } from '../../backend/src/shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; // Obtener la URL base de la API desde las variables de entorno

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

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

  return responseBody;
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

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Algo salió mal");
  }
};

export const addMyHotel = async (HotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: HotelFormData,
  });

  if (!response.ok) {
    throw new Error("Error al agregar el hotel");
  }

  return response.json();
};

// Obtener los hoteles del usuario desde la API de backend (GET /api/my-hotels) y devolverlos
export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener los hoteles");
  }

  return response.json();
};
