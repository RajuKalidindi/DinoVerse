import { useRouter } from "next/router";
import Image from "next/image";
import { Dinosaur } from "../types/types";

interface Props {
  dinosaur: Dinosaur;
}

const DinosaurCard: React.FC<Props> = ({ dinosaur }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/more-details?name=${dinosaur.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="jungle-card p-4 flex flex-col items-center bg-white rounded-lg shadow-black-lg hover:shadow-black-xl transition-shadow duration-300 ease-in-out cursor-pointer"
    >
      <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden">
        <Image
          src={dinosaur.image_url}
          alt={dinosaur.name}
          layout="fill"
          objectFit="fill"
          className="rounded-t-md transform hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
      <div className="p-4 w-full text-center">
        <h2 className="font-jurassic text-2xl text-green-700 mb-2">
          {dinosaur.name}
        </h2>
        <p className="text-sm mb-1">
          <span className="font-bold">Diet:</span> {dinosaur.diet}
        </p>
        <p className="text-sm">
          <span className="font-bold">Type:</span> {dinosaur.type}
        </p>
      </div>
    </div>
  );
};

export default DinosaurCard;
