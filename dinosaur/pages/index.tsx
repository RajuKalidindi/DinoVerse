import { useState, useEffect, useRef } from "react";
import { Dinosaur } from "../types/types";
import Footer from "../components/Footer";
import Link from "next/link";
import DinosaurDetail from "../components/DinosaurDetail";
import Image from "next/image";

const Index = () => {
  const [dinosaurOfTheDay, setDinosaurOfTheDay] = useState<Dinosaur | null>(
    null
  );
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDinosaurOfTheDay = () => {
      fetch("http://localhost:8080/api/dinosaurs/random")
        .then((res) => res.json())
        .then((data) => {
          setDinosaurOfTheDay(data);
          localStorage.setItem("dinosaurOfTheDay", JSON.stringify(data));
          localStorage.setItem("lastFetchDate", new Date().toISOString());
        })
        .catch((error) => {
          console.error("Failed to fetch dinosaur of the day:", error);
        });
    };

    const now = new Date();
    const lastFetchDateString = localStorage.getItem("lastFetchDate");
    const lastFetchDate = lastFetchDateString
      ? new Date(lastFetchDateString)
      : null;
    const storedDinosaurOfTheDay = JSON.parse(
      localStorage.getItem("dinosaurOfTheDay") || "null"
    );

    if (
      storedDinosaurOfTheDay &&
      lastFetchDate &&
      now.getTime() - new Date(lastFetchDate).getTime() < 24 * 60 * 60 * 1000
    ) {
      setDinosaurOfTheDay(storedDinosaurOfTheDay);
    } else {
      fetchDinosaurOfTheDay();
    }

    const nextMidnight = new Date(now);
    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      fetchDinosaurOfTheDay();
      intervalIdRef.current = setInterval(
        fetchDinosaurOfTheDay,
        24 * 60 * 60 * 1000
      );
    }, msUntilMidnight);

    return () => {
      clearTimeout(timeoutId);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dinosaur-pattern bg-cover bg-center inset-0 z-0">
      <main className="flex-grow relative">
        <div className="relative z-10 container mx-auto px-4 py-12">
          <h1 className="jurassic-font text-8xl md:text-9xl text-center mb-12 drop-shadow-lg">
            DinoVerse
          </h1>
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 mb-12">
            <h2 className="jurassic-font text-6xl text-center mb-4 text-green-800">
              Dinosaur of the Day
            </h2>
            {dinosaurOfTheDay && <DinosaurDetail dinosaur={dinosaurOfTheDay} />}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              {
                href: "/gallery",
                label: "Gallery",
                color: "bg-blue-500 hover:bg-blue-600",
              },
              {
                href: "/more-details",
                label: "Details",
                color: "bg-green-500 hover:bg-green-600",
              },
              {
                href: "/quiz",
                label: "Quiz",
                color: "bg-red-500 hover:bg-red-600",
              },
              {
                href: "/compare",
                label: "Compare",
                color: "bg-yellow-500 hover:bg-yellow-600",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.color} text-white font-bold py-2 px-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-center flex flex-row items-center  relative`}
              >
                <div className="w-16 h-13  relative">
                  {" "}
                  <Image
                    src={"/images/logo.png"}
                    alt={"dinosaurs logo"}
                    layout="responsive"
                    width={64}
                    height={64}
                    objectFit="cover"
                  />
                </div>
                <span className="jurassic-font text-5xl">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
