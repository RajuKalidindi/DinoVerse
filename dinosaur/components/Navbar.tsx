import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const Navbar: React.FC = () => {
  const router = useRouter();
  return (
    <nav className="bg-jungle-brown bg-opacity-90 text-white px-2 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* <h1 className="jurassic-font text-6xl mb-4 sm:mb-0">DinoVerse</h1> */}
        <div className="flex flex-row items-center">
          {" "}
          {/* Parent div with flex */}
          <div className="w-16  relative">
            {" "}
            {/* Image container */}
            <Image
              src={"/images/logo.png"}
              alt={"dinosaurs logo"}
              layout="responsive"
              width={64}
              height={64}
              objectFit="cover"
            />
          </div>
          <h1 className="jurassic-font text-6xl mb-4 sm:mb-0">DinoVerse</h1>
        </div>
        {router.pathname !== "/" && (
          <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
            <li>
              <Link
                href="/"
                className="jurassic-font text-4xl hover:text-jungle-green transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className="jurassic-font text-4xl hover:text-jungle-green transition-colors"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/more-details"
                className="jurassic-font text-4xl hover:text-jungle-green transition-colors"
              >
                Details
              </Link>
            </li>
            <li>
              <Link
                href="/quiz"
                className="jurassic-font text-4xl hover:text-jungle-green transition-colors"
              >
                Quiz
              </Link>
            </li>
            <li>
              <Link
                href="/compare"
                className="jurassic-font text-4xl hover:text-jungle-green transition-colors"
              >
                Compare
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
