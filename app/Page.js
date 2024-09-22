'use client';

import React, { useState } from 'react';
import { AlertCircle, Droplet, Apple, Heart } from 'lucide-react';

const MedicalChatbot = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [bmi, setBmi] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const calculateBMI = () => {
    setError('');
    if (weight === '' || height === '') {
      setError('Please enter both weight and height.');
      return;
    }
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      setError('Please enter valid positive numbers for weight and height.');
      return;
    }
    const bmiValue = weightNum / ((heightNum / 100) ** 2);
    setBmi(bmiValue.toFixed(1));
  };

  const getBMICategory = (bmi) => {
    if (bmi === null) return '';
    if (bmi < 17.0) return 'Severe underweight';
    if (bmi < 18.5) return 'Mild underweight';
    if (bmi <= 25.0) return 'Normal';
    if (bmi <= 27.0) return 'Mild overweight';
    return 'Severe overweight';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome to Your Daily Health Guide!</h2>
            <p>Explore essential tools to calculate your BMI, daily water and nutrient intake, and learn about kidney health.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['BMI', 'Water', 'Nutrients', 'Kidney'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item.toLowerCase())}
                  className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
                  aria-label={`Go to ${item} section`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        );
      case 'bmi':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">BMI Calculator</h2>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border rounded"
                aria-label="Weight in kilograms"
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border rounded"
                aria-label="Height in centimeters"
              />
              <button
                onClick={calculateBMI}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                aria-label="Calculate BMI"
              >
                Calculate BMI
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {bmi && (
              <div className="bg-gray-100 p-4 rounded" role="status" aria-live="polite">
                <p>Your BMI: {bmi}</p>
                <p>Category: {getBMICategory(parseFloat(bmi))}</p>
              </div>
            )}
          </div>
        );
      case 'water':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Daily Water Consumption</h2>
            <p>Recommended daily water intake varies by age, weight, and activity level.</p>
            <Droplet className="w-16 h-16 text-blue-500 mx-auto" aria-hidden="true" />
            <p className="text-center">Stay hydrated for optimal kidney health and overall well-being!</p>
          </div>
        );
      case 'nutrients':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Daily Nutrient Intake</h2>
            <Apple className="w-16 h-16 text-green-500 mx-auto" aria-hidden="true" />
            <p>Balanced nutrition is key to a healthy life. Calculate your personalized nutrient needs based on your BMR and activity level.</p>
          </div>
        );
      case 'kidney':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Kidney Health Education</h2>
            <Heart className="w-16 h-16 text-red-500 mx-auto" aria-hidden="true" />
            <p>Learn about kidney failure, its symptoms, prevention, and complications. Protect your kidneys for a healthier life!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <nav className="mb-8" aria-label="Main navigation">
        <ul className="flex space-x-4 overflow-x-auto">
          {['Home', 'BMI', 'Water', 'Nutrients', 'Kidney'].map((item) => (
            <li key={item}>
              <button
                onClick={() => setActiveSection(item.toLowerCase())}
                className={`px-4 py-2 rounded-full ${
                  activeSection === item.toLowerCase()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
                aria-current={activeSection === item.toLowerCase() ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="bg-white shadow-lg rounded-lg p-6">
        {renderSection()}
      </main>
      <footer className="mt-8 text-center text-gray-500">
        <p>© 2024 Your Daily Health Guide. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MedicalChatbot;