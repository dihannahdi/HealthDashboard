'use client'; // Untuk mendukung rendering di sisi client

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from 'framer-motion'; // Library animasi

const Dashboard = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('pria');
  const [activityLevel, setActivityLevel] = useState('1.2');
  const [bmi, setBMI] = useState(null);
  const [bmr, setBMR] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);

  const calculateBMI = () => {
    if (weight && height) {
      const bmiValue = weight / ((height / 100) * (height / 100));
      setBMI(bmiValue.toFixed(1));
    }
  };

  const calculateBMR = () => {
    if (weight && height && age) {
      let bmrValue;
      if (gender === 'pria') {
        bmrValue = 66.5 + (13.7 * weight) + (5 * height) - (6.8 * age);
      } else {
        bmrValue = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
      }
      setBMR(Math.round(bmrValue));
      setDailyCalories(Math.round(bmrValue * parseFloat(activityLevel)));
    }
  };

  const calculateWaterIntake = () => {
    if (weight) {
      setWaterIntake(Math.round(weight * 0.033 * 1000));
    }
  };

  useEffect(() => {
    calculateBMI();
    calculateBMR();
    calculateWaterIntake();
  }, [weight, height, age, gender, activityLevel]);

  const getBMICategory = () => {
    if (bmi === null) return '';
    if (bmi < 17.0) return 'Kurus (Berat badan kurang parah)';
    if (bmi < 18.5) return 'Kurus (Berat badan kurang ringan)';
    if (bmi < 25.1) return 'Normal';
    if (bmi < 27.1) return 'Gemuk (Kelebihan berat badan ringan)';
    return 'Gemuk (Kelebihan berat badan parah)';
  };

  const nutrientData = [
    { name: 'Protein', amount: Math.round(dailyCalories * 0.15 / 4), unit: 'g' },
    { name: 'Lemak', amount: Math.round(dailyCalories * 0.3 / 9), unit: 'g' },
    { name: 'Karbohidrat', amount: Math.round(dailyCalories * 0.55 / 4), unit: 'g' },
    { name: 'Natrium', amount: 1500, unit: 'mg' },
    { name: 'Mineral', amount: 'Bervariasi', unit: '' },
  ];

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6">
        <motion.h1
          className="text-3xl font-bold mb-6 text-center text-blue-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Health Dashboard
        </motion.h1>
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="w-full justify-center mb-4">
            <TabsTrigger value="calculator" className="flex-1">Kalkulator</TabsTrigger>
            <TabsTrigger value="nutrition" className="flex-1">Nutrisi</TabsTrigger>
            <TabsTrigger value="education" className="flex-1">Edukasi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-100">
                <CardTitle className="text-blue-800">Kalkulator Kesehatan</CardTitle>
                <CardDescription>Hitung IMT, BMR, dan kebutuhan kalori harian Anda</CardDescription>
              </CardHeader>
              <CardContent className="mt-4">
                <motion.div className="grid gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Form Inputs */}
                  ...
                </motion.div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button onClick={() => { calculateBMI(); calculateBMR(); calculateWaterIntake(); }} className="bg-blue-500 hover:bg-blue-600">Hitung</Button>
              </CardFooter>
            </Card>
            
            {bmi && bmr && dailyCalories && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="mt-4 border-blue-200">
                  <CardHeader className="bg-blue-100">
                    <CardTitle className="text-blue-800">Hasil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">IMT: {bmi} ({getBMICategory()})</p>
                    <p className="text-blue-700">BMR: {bmr} kkal</p>
                    <p className="text-blue-700">Kebutuhan Kalori Harian: {dailyCalories} kkal</p>
                    <p className="text-blue-700">Asupan Air Harian: {waterIntake} ml</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="nutrition">
            {/* Konten Nutrisi */}
          </TabsContent>
          
          <TabsContent value="education">
            {/* Konten Edukasi */}
          </TabsContent>
        </Tabs>
      </div>
      <footer className="mt-8 text-blue-700 text-center">
        &copy; 2024 Atania Ilma. Hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
};

export default Dashboard;
