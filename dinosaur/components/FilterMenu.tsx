import React, { useState } from "react";
import { Diet, DinosaurType } from "../types/types";

interface Props {
  diets: Diet[];
  types: DinosaurType[];
  onDietChange: (diet: string) => void;
  onTypeChange: (type: string) => void;
  onSortChange: (sort: string) => void;
}

const FilterMenu: React.FC<Props> = ({
  diets,
  types,
  onDietChange,
  onTypeChange,
  onSortChange,
}) => {
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleDietChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const diet = e.target.value;
    setSelectedDiet(diet);
    if (diet === "") {
      onDietChange("All");
    } else {
      onDietChange(diet);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedType(type);
    if (type === "") {
      onTypeChange("All");
    } else {
      onTypeChange(type);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
      <div className="flex items-center">
        <select
          value={selectedDiet}
          onChange={handleDietChange}
          className="jungle-button bg-opacity-80 text-white"
        >
          <option value="">Select Diet</option>
          {diets.map((diet) => (
            <option key={diet.diet} value={diet.diet}>
              {diet.diet}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="jungle-button bg-opacity-80 text-white"
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type.type} value={type.type}>
              {type.type}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="jungle-button bg-opacity-80 text-white"
        >
          <option value="">Sort by</option>
          <option value="asc">Name A-Z</option>
          <option value="desc">Name Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default FilterMenu;
