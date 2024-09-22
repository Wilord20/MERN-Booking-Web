import { useSearchContext } from "../contexts/SearchContext"

const Search = () => {
    const search = useSearchContext();
    console.log(search);

    return <p>Search Page</p>;
};

export default Search;