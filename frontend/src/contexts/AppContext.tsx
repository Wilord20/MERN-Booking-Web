import React, { useContext } from "react";

type ToastMessage = {
  message: string;
  type: "success" | "error";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
};

const AppContext = React.createContext<AppContext | undefined>(undefined); // Cuando la app cargue por primera vez, el contexto va a ser undefined

export const AppContextProvider = ({
  // Componente que va a envolver toda la app
  children,
}: {
  children: React.ReactNode; // React.ReactNode es un tipo que acepta cualquier cosa que pueda ser renderizada por React
}) => {
  return (
    <AppContext.Provider value={{ showToast: (toastMessage) => {
        console.log(toastMessage);
    } }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
};