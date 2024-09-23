import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  /*
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  */

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),

    page: page.toString(),
    /*
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
    */
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
    <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
      <div className="space-y-5">
        <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
          Filtrar por:
        </h3>
      </div>
    </div>
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">
          {hotelData?.pagination.total} Hoteles encontrados
          {search.destination ? ` in ${search.destination}` : ""}
        </span>
       
      </div>
    </div>
  </div>
  );
};

export default Search;
