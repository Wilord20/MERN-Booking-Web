import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls"); // Obtener las URL de las imágenes existentes

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>, // Click del botón
    imageUrl: string
  ) => {
    event.preventDefault(); // Prevenir que el formulario se envíe
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl) // Filtrar las URL de las imágenes con la seleccionada
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Imágenes</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div className="relative group">
                <img src={url} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*" // Aceptar cualquier tipo de imagen
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (existingImageUrls?.length || 0);

              if (totalLength === 0) {
                return "Al menos una imagen es requerida";
              }

              if (totalLength > 6) {
                return "El nómero total de imágenes no puede excederse a 6";
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;