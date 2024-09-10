import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {

    useEffect(() => { // Cerrar el mensaje después de 5 segundos
        const timer = setTimeout(() => {
            onClose(); 
        }, 4000);

        return () => {
            clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
        }; 
    }, [onClose]); // Ejecutar el efecto cuando la función onClose cambie

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      } text-white max-w-md`}
    >
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;