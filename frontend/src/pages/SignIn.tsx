import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate(); // Hook de React Router para navegar entre páginas
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Inicio de sesión exitoso", type: "success" });
        await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Correo electrónico
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "El campo es necesario" })}
        ></input>
        {errors.email && ( // Si hay un error en el campo
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Contraseña
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "El campo es necesario",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 carácteres",
            },
          })}
        ></input>
        {errors.password && ( // Si hay un error en el campo
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          ¿No tienes una cuenta? <Link className="underline" to="/register">Crea tu cuenta aquí</Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Iniciar sesión
        </button>
      </span>
    </form>
  );
};

export default SignIn;
