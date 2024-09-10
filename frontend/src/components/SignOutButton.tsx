import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken"); // Invalidar la query de validateToken para no tener que recarga la pagina
      showToast({ message: "Sesión cerrada exitosamente", type: "success" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 "
    >
      Cerrar sesión
    </button>
  );
};

export default SignOutButton;
