import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "success" | "error";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

const AppContext = React.createContext<AppContext | undefined>(undefined); // Cuando la app cargue por primera vez, el contexto va a ser undefined

export const AppContextProvider = ({
  // Componente que va a envolver toda la app
  children,
}: {
  children: React.ReactNode; // React.ReactNode es un tipo que acepta cualquier cosa que pueda ser renderizada por React
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined); // Inicializar el estado del mensaje

  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  }); // Validar el token

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage); // Mostrar el mensaje
        },
        isLoggedIn: !isError, // Si hay un error, el usuario no está logueado
      }}
    >
      {toast && ( // Si hay un mensaje, mostrar el componente Toast
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
