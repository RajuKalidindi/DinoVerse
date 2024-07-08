import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

interface QuizQuestion {
  image: string;
  correctName: string;
  options: string[];
}

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizComponent: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const router = useRouter();

  const handleClick = (name: string) => {
    router.push(`/more-details?name=${name}`);
  };

  const fetchNewQuestion = async () => {
    const response = await fetch(
      "http://localhost:8080/api/dinosaurs/random/image"
    );
    const imageData = await response.json();
    const namesResponse = await fetch(
      "http://localhost:8080/api/dinosaurs/random/names?exclude=" +
        imageData.name
    );
    const namesData = await namesResponse.json();

    const options = shuffleArray([...namesData, imageData.name]);

    setQuestion({
      image: imageData.image_url,
      correctName: imageData.name,
      options: options,
    });
    setSelectedAnswers([]);
    setAttempts(0);
    setShowCorrect(false);
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const handleAnswer = (answer: string) => {
    if (attempts >= 2 || selectedAnswers.includes(answer)) return;

    const newSelectedAnswers = [...selectedAnswers, answer];
    setSelectedAnswers(newSelectedAnswers);
    setAttempts(attempts + 1);

    if (answer === question?.correctName) {
      setShowCorrect(true);
    } else if (attempts + 1 >= 2) {
      setShowCorrect(true);
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto quiz-card rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <h2 className="jurassic-font text-center text-6xl font-bold mb-4">
          Guess the Dinosaur
        </h2>
        <div className="relative w-full h-64 mb-4">
          <Image
            src={question.image}
            alt="Mystery Dinosaur"
            layout="fill"
            objectFit="fill"
            className="rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={showCorrect || selectedAnswers.includes(option)}
              className={`p-2 rounded-md text-white jurassic-font text-4xl ${
                showCorrect && option === question.correctName
                  ? "bg-green-500"
                  : selectedAnswers.includes(option)
                  ? "bg-red-500"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {option}
              {showCorrect && option === question.correctName && " ✓"}
              {selectedAnswers.includes(option) &&
                option !== question.correctName &&
                " ✗"}
            </button>
          ))}
        </div>
        {showCorrect && (
          <div className="flex items-center justify-center mt-4">
            {" "}
            <p className="jurassic-font text-4xl">
              {selectedAnswers.includes(question.correctName)
                ? "Correct! Well done."
                : `The correct answer is ${question.correctName}.`}
            </p>
            <button
              onClick={() => handleClick(question.correctName)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-full text-sm"
              aria-label="Learn more"
            >
              i
            </button>
          </div>
        )}
        <button
          onClick={fetchNewQuestion}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          <span className="jurassic-font text-4xl">Next Question</span>
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;
