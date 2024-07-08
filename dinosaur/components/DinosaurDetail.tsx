import Image from "next/image";
import { Dinosaur } from "../types/types";

interface Props {
  dinosaur: Dinosaur;
}

const DinosaurDetail: React.FC<Props> = ({ dinosaur }) => {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    dinosaur.name
  )}`;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-64">
        <Image
          src={dinosaur.image_url}
          alt={dinosaur.name}
          layout="fill"
          objectFit="contain"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-6">
        <h2 className="text-4xl font-bold text-green-700 mb-4">
          {dinosaur.name}
        </h2>
        <p className="text-xl italic text-gray-600 mb-2">
          <span className="font-bold">Meaning:</span> {dinosaur.name_meaning}
        </p>
        <p className="text-base text-gray-600 mb-4">
          <span className="font-bold">Pronunciation:</span>{" "}
          {dinosaur.pronunciation}
        </p>
        {dinosaur.description && (
          <p className="text-base text-gray-600 mb-4">
            <span className="font-bold">Description:</span>{" "}
            {dinosaur.description}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-base mb-1">
              <span className="font-bold">Diet:</span> {dinosaur.diet}
            </p>
            <p className="text-base mb-1">
              <span className="font-bold">Type:</span> {dinosaur.type}
            </p>
            <p className="text-base mb-1">
              <span className="font-bold">Length:</span> {dinosaur.length}
            </p>
          </div>
          <div>
            <p className="text-base mb-1">
              <span className="font-bold">Found in:</span> {dinosaur.found_in}
            </p>
            <p className="text-base mb-1">
              <span className="font-bold">When it lived:</span>{" "}
              {dinosaur.when_it_lived}
            </p>
          </div>
        </div>
        <div className="text-center">
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition duration-300"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default DinosaurDetail;
