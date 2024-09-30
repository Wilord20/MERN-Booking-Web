import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

const BookingDetailsSummary = ({
    checkIn,
    checkOut,
    adultCount,
    childCount,
    numberOfNights,
    hotel,
  }: Props) => {
    return (
      <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
        <h2 className="text-xl font-bold">Detalles reservación</h2>
        <div className="border-b py-2">
          Ubicación:
          <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
        </div>
        <div className="flex justify-between">
          <div>
            Check-in:
            <div className="font-bold"> {checkIn.toLocaleDateString("es-MX", {weekday: "long", year: "numeric", month: "short", day: "numeric"})}</div>
          </div>
          <div>
            Check-out:
            <div className="font-bold"> {checkOut.toLocaleDateString("es-MX", {weekday: "long", year: "numeric", month: "short", day: "numeric"})}</div>
          </div>
        </div>
        <div className="border-t border-b py-2">
          Total de noches:
          <div className="font-bold">{numberOfNights} noches</div>
        </div>
  
        <div>
          Huéspedes{" "}
          <div className="font-bold">
            {adultCount} adulto(s) & {childCount} niño(s)
          </div>
        </div>
      </div>
    );
  };
  

export default BookingDetailsSummary;
