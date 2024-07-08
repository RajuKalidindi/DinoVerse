import React, { useState } from "react";
import { Dinosaur } from "../types/types";
import DinosaurCard from "./DinosaurCard";

const CompareComponent: React.FC = () => {
  const [dinosaur1, setDinosaur1] = useState<Dinosaur | null>(null);
  const [dinosaur2, setDinosaur2] = useState<Dinosaur | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDinosaur = async (
    name: string,
    setter: (dino: Dinosaur) => void,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/api/dinosaurs/search?name=${name}`
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

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Enter first dinosaur name"
          className="jungle-button bg-opacity-80 text-white"
          onBlur={(e) =>
            fetchDinosaur(e.target.value, setDinosaur1, setLoading1)
          }
        />
        {loading1 && <p>Loading...</p>}
        <input
          type="text"
          placeholder="Enter second dinosaur name"
          className="jungle-button bg-opacity-80 text-white"
          onBlur={(e) =>
            fetchDinosaur(e.target.value, setDinosaur2, setLoading2)
          }
        />
        {loading2 && <p>Loading...</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dinosaur1 && <DinosaurCard dinosaur={dinosaur1} />}
        {dinosaur2 && <DinosaurCard dinosaur={dinosaur2} />}
      </div>
    </div>
  );
};

export default CompareComponent;
