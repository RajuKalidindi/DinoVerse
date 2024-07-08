import { Diet, DinosaurType } from "../types/types";

interface Props {
  diets: Diet[];
  types: DinosaurType[];
  onDietChange: (diet: string) => void;
  onTypeChange: (type: string) => void;
}

const FilterMenu: React.FC<Props> = ({
  diets,
  types,
  onDietChange,
  onTypeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
      <select
        onChange={(e) => onDietChange(e.target.value)}
        className="jungle-button bg-opacity-80 text-white"
      >
        <option value="">All Diets</option>
        {diets.map((diet) => (
          <option key={diet.name} value={diet.name}>
            {diet.name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => onTypeChange(e.target.value)}
        className="jungle-button bg-opacity-80 text-white"
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterMenu;
