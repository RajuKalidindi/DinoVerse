import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Dinosaur } from "../types/types";
import DinosaurDetail from "./DinosaurDetail";

const MoreDetails: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Dinosaur | Dinosaur[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { name } = router.query;

  useEffect(() => {
    if (name) {
      const searchName = name as string;
      setSearchTerm(searchName);
      fetchDinosaurs(searchName);
    }
  }, [name]);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        fetchAllDinosaurNames(searchTerm);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setAutocompleteResults([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchDinosaurs(searchTerm);
  };

  const fetchAllDinosaurNames = async (term: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dinosaurs/names?query=${term}`
      );
      const data = await response.json();
      setAutocompleteResults(
        data.filter((name: string) => name !== searchTerm)
      );
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to fetch dinosaur names", error);
    }
  };

  const fetchDinosaurs = async (term: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dinosaurs/by-name?name=${term}`
      );
      const data = await response.json();
      if (data.message === "Dinosaur not found") {
        setError("Dinosaur not found. Please check for any typos.");
        setSearchResults([]);
      } else {
        setSearchResults(data);
        setError(null);
      }
      setShowSuggestions(false);
      setAutocompleteResults([]);
    } catch (error) {
      setError("Failed to fetch dinosaurs. Please try again.");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setAutocompleteResults([]);
    fetchDinosaurs(suggestion);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = capitalizeFirstLetter(e.target.value);
    setSearchTerm(inputValue);
    setShowSuggestions(true);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex">
        <div className="relative flex-grow mr-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search dinosaurs..."
            className="jungle-input bg-opacity-80 text-white w-full"
          />
          {showSuggestions && autocompleteResults.length > 0 && searchTerm && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md max-h-60 overflow-y-auto">
              {autocompleteResults.slice(0, 6).map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="jungle-button">
          Search
        </button>
      </form>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex justify-center">
          {Array.isArray(searchResults) ? (
            searchResults.map((dinosaur) => (
              <DinosaurDetail key={dinosaur.name} dinosaur={dinosaur} />
            ))
          ) : (
            <DinosaurDetail key={searchResults.name} dinosaur={searchResults} />
          )}
        </div>
      )}
    </div>
  );
};

export default MoreDetails;
