import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    if(!stripe || !elements) {
      return;
    }
    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
          card: elements.getElement(CardElement) as StripeCardElement, // Obtener los elementos del formulario, específicamente el elemento CardElement
      },
    });

    if(result.paymentIntent?.status === "succeeded") {
      
    }
  };

  return (
    <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
      <span className="text-3xl font-bold">Confirma tus datos</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Nombre(s)
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Apellido(s)
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Resumen de la reservación</h2>
        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Costo total: MXN {paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Incluye impuestos y cargos por servicio</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Detalles de pago</h3>
        <CardElement id="payment-element" className="border rounded-md p-2 text-sm"/>
      </div>
    </form>
  );
};

export default BookingForm;
