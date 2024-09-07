import { useForm } from "react-hook-form";

type RegisterFormData = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
};


const Register = () => {

    const { register } = useForm<RegisterFormData>();

    return (
        <form className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold">
                Crea una cuenta
            </h2>
        </form>
    );
};

export default Register;