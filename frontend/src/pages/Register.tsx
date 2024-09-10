import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client"; // Importar todas las funciones de la API
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  // Define los campos del formulario
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const Register = () => {
  const navigate = useNavigate(); // Hook de React Router para navegar entre páginas
  const {showToast} = useAppContext(); // Extraer la función para mostrar los mensajes de la app

  const {
    register,
    watch, // Función para observar los cambios en un campo
    handleSubmit, // Función para manejar el envío del formulario
    formState: { errors }, // Extraer los errores del hook de useForm
  } = useForm<RegisterFormData>(); // Inicializar el hook de useForm con el tipo de datos de la forma

  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      showToast({message: "Usuario registrado exitosamente", type: "success"}); // Mostrar un mensaje de éxito
      navigate("/"); // Redirigir al usuario a la página principal
    },
    onError: (error: Error) => {
      showToast({message: error.message, type: "error"}); // Mostrar un mensaje de error
    },
  });

  const onSubmit = handleSubmit((data) => { // Función que se ejecutará al enviar el formulario
    mutation.mutate(data); // Llamar a la función de la API para registrar al usuario
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Crea una cuenta</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Nombre(s)
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "El campo es necesario" })}
          ></input>
          {errors.firstName && ( // Si hay un error en el campo
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Apellidos
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "El campo es necesario" })}
          ></input>
          {errors.lastName && ( // Si hay un error en el campo
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
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
      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirmar Contraseña
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                // Si el campo está vacío
                return "El campo es necesario";
              } else if (watch("password") !== val) {
                // Si las contraseñas no coinciden
                return "Las contraseñas no coinciden";
              }
            },
          })}
        ></input>
        {errors.confirmPassword && ( // Si hay un error en el campo
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Registrarse
        </button>
      </span>
    </form>
  );
};

export default Register;
