type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
  };
  
  const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    return (
      <div>
        <h4 className="text-md font-semibold mb-2"> Precio Máximo</h4>
        <select
          className="p-2 border rounded-md w-full"
          value={selectedPrice}
          onChange={(event) =>
            onChange(
              event.target.value ? parseInt(event.target.value) : undefined
            )
          }
        >
          <option value="">Seleccionar precio máximo</option>
          {[150, 1000, 2000, 3000, 5000].map((price) => (
            <option value={price}>{price}</option>
          ))}
        </select>
      </div>
    );
  };
  
  export default PriceFilter;