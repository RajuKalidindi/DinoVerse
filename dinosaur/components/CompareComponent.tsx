import React, { useState, useEffect } from "react";
import { Dinosaur } from "../types/types";
import DinosaurDetail from "./DinosaurDetail";

const CompareComponent: React.FC = () => {
  const [dinosaur1, setDinosaur1] = useState<Dinosaur | null>(null);
  const [dinosaur2, setDinosaur2] = useState<Dinosaur | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autocompleteResults1, setAutocompleteResults1] = useState<string[]>(
    []
  );
  const [autocompleteResults2, setAutocompleteResults2] = useState<string[]>(
    []
  );
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [selectedInput, setSelectedInput] = useState<number | null>(null);
  const [similarDinosaurs, setSimilarDinosaurs] = useState<Dinosaur[]>([]);

  useEffect(() => {
    if (dinosaur1) {
      fetchSimilarDinosaurs(dinosaur1);
    }
  }, [dinosaur1]);

  const fetchSimilarDinosaurs = async (dino: Dinosaur) => {
    const { diet, type, found_in, name } = dino;

    // Define all combinations of attributes to query
    const attributeCombinations = [
      { diet, type, found_in },
      { diet, type },
      { diet, found_in },
      { type, found_in },
      { diet },
      { type },
      { found_in },
    ];

    try {
      let allResults: Dinosaur[] = [];

      for (const attributes of attributeCombinations) {
        if (allResults.length >= 4) break;

        const queryString = Object.entries(attributes)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join("&");

        const response = await fetch(
          `http://localhost:8080/api/dinosaurs/search?${queryString}`
        );
        if (!response.ok) throw new Error("Failed to fetch dinosaurs");

        const data: Dinosaur[] = await response.json();

        const newResults = data.filter(
          (d) => d.name !== name && !allResults.some((r) => r.name === d.name)
        );

        allResults = [...allResults, ...newResults];
      }

      if (allResults.length < 4) {
        const response = await fetch(
          `http://localhost:8080/api/dinosaurs/random/names?exclude=${name}`
        );
        const randomNames = await response.json();

        for (const randomName of randomNames) {
          if (allResults.length >= 4) break;
          const dinoResponse = await fetch(
            `http://localhost:8080/api/dinosaurs/by-name?name=${randomName}`
          );
          const randomDino = await dinoResponse.json();
          if (!allResults.some((d) => d.name === randomDino.name)) {
            allResults.push(randomDino);
          }
        }
      }

      setSimilarDinosaurs(allResults.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch similar dinosaurs:", error);
    }
  };

  const fetchDinosaur = async (
    name: string,
    setter: (dino: Dinosaur | null) => void,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/api/dinosaurs/by-name?name=${name}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dinosaur data");
      }
      const data = await response.json();
      setter(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = async (inputNumber: number) => {
    const selectedDinosaur = inputNumber === 1 ? setDinosaur1 : setDinosaur2;
    const inputName = inputNumber === 1 ? dinosaur1 : dinosaur2;

    if (!inputName) {
      setError(`Please enter a dinosaur name for Dinosaur ${inputNumber}`);
      return;
    }

    setLoading1(inputNumber === 1);
    setLoading2(inputNumber === 2);
    setError(null);

    fetchDinosaur(
      inputName.name,
      selectedDinosaur,
      inputNumber === 1 ? setLoading1 : setLoading2
    );
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    inputNumber: number
  ) => {
    const inputValue = e.target.value.trim();
    setSelectedInput(inputNumber);

    if (inputNumber === 1) {
      setAutocompleteResults1([]);
      setShowSuggestions1(false);
    } else if (inputNumber === 2) {
      setAutocompleteResults2([]);
      setShowSuggestions2(false);
    }

    if (inputValue === "") {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/dinosaurs/names?query=${inputValue}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch autocomplete suggestions");
      }
      const data = await response.json();
      if (inputNumber === 1) {
        setAutocompleteResults1(
          data.filter((name: string) => name !== inputValue)
        );
        setShowSuggestions1(true);
      } else if (inputNumber === 2) {
        setAutocompleteResults2(
          data.filter((name: string) => name !== inputValue)
        );
        setShowSuggestions2(true);
      }
    } catch (error) {
      console.error("Failed to fetch autocomplete suggestions:", error);
    }
  };

  const handleSuggestionClick = (suggestion: string, inputNumber: number) => {
    const selectedDinosaur = inputNumber === 1 ? setDinosaur1 : setDinosaur2;
    setSelectedInput(null);
    if (inputNumber === 1) {
      setAutocompleteResults1([]);
      setShowSuggestions1(false);
    } else if (inputNumber === 2) {
      setAutocompleteResults2([]);
      setShowSuggestions2(false);
    }
    const inputElement = document.getElementById(
      `dinosaurName${inputNumber}`
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = suggestion;
    }

    fetchDinosaur(
      suggestion,
      selectedDinosaur,
      inputNumber === 1 ? setLoading1 : setLoading2
    );
  };

  const handleTileClick = (name: string, inputNumber: number) => {
    const selectedDinosaur = inputNumber === 1 ? setDinosaur1 : setDinosaur2;
    setSelectedInput(null);
    const inputElement = document.getElementById(
      `dinosaurName${inputNumber}`
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = name;
    }

    fetchDinosaur(
      name,
      selectedDinosaur,
      inputNumber === 1 ? setLoading1 : setLoading2
    );
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="relative flex-grow">
              <input
                type="text"
                id="dinosaurName1"
                placeholder="Enter first dinosaur name"
                className="jungle-input bg-opacity-80 text-white w-full"
                onChange={(e) => handleInputChange(e, 1)}
                onFocus={() => setSelectedInput(1)}
              />
              {showSuggestions1 && autocompleteResults1.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md max-h-60 overflow-y-auto">
                  {autocompleteResults1.slice(0, 6).map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion, 1)}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              className="jungle-button"
              onClick={() => handleSearchClick(1)}
            >
              Search
            </button>
            {loading1 && <p>Loading...</p>}
          </div>
          <div className="hidden lg:block h-12"></div>
          {dinosaur1 && (
            <div className="space-y-4">
              <DinosaurDetail dinosaur={dinosaur1} />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="relative flex-grow">
              <input
                type="text"
                id="dinosaurName2"
                placeholder="Enter second dinosaur name"
                className="jungle-input bg-opacity-80 text-white w-full"
                onChange={(e) => handleInputChange(e, 2)}
                onFocus={() => setSelectedInput(2)}
              />
              {showSuggestions2 && autocompleteResults2.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md max-h-60 overflow-y-auto">
                  {autocompleteResults2.slice(0, 6).map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion, 2)}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              className="jungle-button"
              onClick={() => handleSearchClick(2)}
            >
              Search
            </button>
            {loading2 && <p>Loading...</p>}
          </div>

          {similarDinosaurs.length > 0 && (
            <div className="flex items-center flex-wrap mt-4 space-x-2">
              <span className="jurassic-font text-4xl">
                Similar dinosaurs -
              </span>
              {similarDinosaurs
                .filter((dinosaur) => dinosaur.name !== dinosaur1?.name)
                .slice(0, 4)
                .map((dinosaur, index) => (
                  <div
                    key={index}
                    className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 p-2 rounded m-1"
                    onClick={() => handleTileClick(dinosaur.name, 2)}
                  >
                    <span className="text-white">{dinosaur.name}</span>
                  </div>
                ))}
            </div>
          )}

          {dinosaur2 && (
            <div className="space-y-4">
              <DinosaurDetail dinosaur={dinosaur2} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareComponent;
