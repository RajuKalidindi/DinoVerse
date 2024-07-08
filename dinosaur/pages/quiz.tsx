import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuizComponent from "../components/QuizComponent";

const Quiz = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dinosaur-pattern bg-cover bg-center inset-0 z-0">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="jurassic-font text-9xl text-center mb-8 ">
          Dinosaur Quiz
        </h1>
        <QuizComponent />
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;
