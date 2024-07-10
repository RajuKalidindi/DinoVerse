import { useState, useEffect } from "react";
import { Dinosaur, Diet, DinosaurType } from "../types/types";
import Navbar from "../components/Navbar";
import DinosaurCard from "../components/DinosaurCard";
import FilterMenu from "../components/FilterMenu";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";

const Gallery = () => {
  const [dinosaurs, setDinosaurs] = useState<Dinosaur[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [types, setTypes] = useState<DinosaurType[]>([]);
  const [filteredDinosaurs, setFilteredDinosaurs] = useState<Dinosaur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<string>("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080/api/dinosaurs";

  const calculateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width < 768) return 2;
    if (width < 1024) return 6;
    return 10;
  };

  useEffect(() => {
    setIsLoading(true);
    // Fetch dinosaurs
    fetch(`${apiUrl}`)
      .then((res) => res.json())
      .then((data) => {
        setDinosaurs(data);
        setFilteredDinosaurs(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch dinosaurs:", error);
        setIsLoading(false);
      });

    // Fetch diets
    fetch(`${apiUrl}/diets`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDiets(data);
      })
      .catch((error) => {
        console.error("Failed to fetch diets:", error);
      });

    // Fetch types
    fetch(`${apiUrl}/types`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTypes(data);
      })
      .catch((error) => {
        console.error("Failed to fetch types:", error);
      });
  }, []);

  useEffect(() => {
    setItemsPerPage(calculateItemsPerPage());
    const handleResize = () => {
      setItemsPerPage(calculateItemsPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredDinosaurs.length / itemsPerPage));
    setCurrentPage(1);
  }, [itemsPerPage, filteredDinosaurs]);

  const handleDietChange = (diet: string) => {
    let filtered = dinosaurs;
    if (diet !== "All") {
      filtered = dinosaurs.filter((dino) => dino.diet === diet);
    }
    setFilteredDinosaurs(filtered);
    applySort(filtered, sortOrder);
  };

  const handleTypeChange = (type: string) => {
    let filtered = dinosaurs;
    if (type !== "All") {
      filtered = dinosaurs.filter((dino) => dino.type === type);
    }
    setFilteredDinosaurs(filtered);
    applySort(filtered, sortOrder);
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    applySort(filteredDinosaurs, sort);
  };

  const applySort = (dinos: Dinosaur[], sort: string) => {
    let sortedDinosaurs = [...dinos];
    if (sort === "asc") {
      sortedDinosaurs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "desc") {
      sortedDinosaurs.sort((a, b) => b.name.localeCompare(a.name));
    }
    setFilteredDinosaurs(sortedDinosaurs);
    setTotalPages(Math.ceil(sortedDinosaurs.length / itemsPerPage));
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const displayedDinosaurs = filteredDinosaurs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-dinosaur-pattern bg-cover bg-center inset-0 z-0">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="jurassic-font text-9xl text-center mb-8">
          Dinosaur Gallery
        </h1>
        <FilterMenu
          diets={diets}
          types={types}
          onDietChange={handleDietChange}
          onTypeChange={handleTypeChange}
          onSortChange={handleSortChange}
        />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div
              className="border-t-transparent border-solid animate-spin rounded-full border-blue-500 border-4 h-8 w-8"
              role="status"
            />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayedDinosaurs.map((dinosaur) => (
                <DinosaurCard key={dinosaur.name} dinosaur={dinosaur} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
