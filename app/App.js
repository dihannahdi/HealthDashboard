'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Utility functions
const calculateBMI = (weight, height) => {
  return weight / (height * height);
};

const getBMICategory = (bmi) => {
  if (bmi < 17.0) return 'Severe underweight';
  if (bmi < 18.5) return 'Mild underweight';
  if (bmi <= 25.0) return 'Normal';
  if (bmi <= 27.0) return 'Mild overweight';
  return 'Severe overweight';
};

const calculateWaterIntake = (weight) => {
  return weight * 0.033; // Simplified calculation
};

const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 66.5 + (13.7 * weight) + (5 * height * 100) - (6.8 * age);
  } else {
    return 655 + (9.6 * weight) + (1.8 * height * 100) - (4.7 * age);
  }
};

// Header Component
const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md"
    >
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Daily Health Guide</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#bmi" className="text-blue-600 hover:text-blue-800">BMI</a></li>
            <li><a href="#water" className="text-blue-600 hover:text-blue-800">Water Intake</a></li>
            <li><a href="#nutrients" className="text-blue-600 hover:text-blue-800">Nutrients</a></li>
            <li><a href="#kidney" className="text-blue-600 hover:text-blue-800">Kidney Health</a></li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Daily Health Guide. All rights reserved.</p>
      </div>
    </footer>
  );
};

// BMI Calculator Component
const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);

  const handleCalculate = () => {
    const calculatedBMI = calculateBMI(parseFloat(weight), parseFloat(height));
    setBMI(calculatedBMI);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">BMI Calculator</h2>
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Height (m)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <Button onClick={handleCalculate}>Calculate BMI</Button>
        {bmi !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <p className="text-lg font-semibold">Your BMI: {bmi.toFixed(2)}</p>
            <p className="text-md">Category: {getBMICategory(bmi)}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Water Intake Calculator Component
const WaterIntakeCalculator = () => {
  const [weight, setWeight] = useState('');
  const [waterIntake, setWaterIntake] = useState(null);

  const handleCalculate = () => {
    const calculatedIntake = calculateWaterIntake(parseFloat(weight));
    setWaterIntake(calculatedIntake);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Water Intake Calculator</h2>
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Button onClick={handleCalculate}>Calculate Water Intake</Button>
        {waterIntake !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold mt-4"
          >
            Recommended daily water intake: {waterIntake.toFixed(2)} liters
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

// Nutrient Calculator Component
const NutrientCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [bmr, setBMR] = useState(null);

  const handleCalculate = () => {
    const calculatedBMR = calculateBMR(parseFloat(weight), parseFloat(height), parseInt(age), gender);
    setBMR(calculatedBMR);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Nutrient Calculator</h2>
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Height (m)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <Button onClick={handleCalculate}>Calculate BMR</Button>
        {bmr !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <p className="text-lg font-semibold">Your BMR: {bmr.toFixed(2)} calories/day</p>
            <p className="text-md">This is your basal metabolic rate. Your total daily calorie needs will depend on your activity level.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Kidney Health Quiz Component
const KidneyHealthQuiz = () => {
  const [score, setScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      question: "How much water do you drink daily?",
      answers: ["Less than 1 liter", "1-2 liters", "2-3 liters", "More than 3 liters"],
      correctAnswer: 2
    },
    {
      question: "How often do you exercise?",
      answers: ["Never", "1-2 times a week", "3-4 times a week", "5 or more times a week"],
      correctAnswer: 2
    },
    {
      question: "Do you smoke?",
      answers: ["Yes", "No"],
      correctAnswer: 1
    }
  ];

  const handleAnswer = (answerIndex) => {
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore((prevScore) => (prevScore || 0) + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz finished
      setCurrentQuestion(-1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Kidney Health Quiz</h2>
      {currentQuestion >= 0 && currentQuestion < questions.length ? (
        <div>
          <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
          <div className="space-y-2">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Button key={index} onClick={() => handleAnswer(index)} className="w-full">
                {answer}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-xl font-semibold mb-2">Quiz Completed!</p>
          <p className="text-lg">Your score: {score} out of {questions.length}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8"
        >
          Welcome to Your Daily Health Guide!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-center mb-12"
        >
          Explore essential tools to calculate your BMI, daily water and nutrient intake, and learn about kidney health.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BMICalculator />
          <WaterIntakeCalculator />
          <NutrientCalculator />
          <KidneyHealthQuiz />
        </div>
      </main>
      <Footer />
    </div>
  );
}
