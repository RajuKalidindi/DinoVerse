import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompareComponent from "../components/CompareComponent";

export default function Compare() {
  return (
    <div className="min-h-screen flex flex-col bg-dinosaur-pattern bg-cover bg-center inset-0 z-0">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="jurassic-font text-9xl text-center mb-8 ">
          Compare Dinosaurs
        </h1>
        <CompareComponent />
      </main>
      <Footer />
    </div>
  );
}
