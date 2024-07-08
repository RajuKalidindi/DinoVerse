import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompareComponent from "../components/CompareComponent";

export default function Compare() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="font-jurassic text-4xl text-center mb-8 text-white">
          Compare Dinosaurs
        </h1>
        <CompareComponent />
      </main>
      <Footer />
    </div>
  );
}
