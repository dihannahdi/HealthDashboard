'use client';

import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('pria');
  const [activityLevel, setActivityLevel] = useState('1.2');

  const [bmi, setBMI] = useState(null);
  const [bmr, setBMR] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);

  const [activeTab, setActiveTab] = useState('calculator');
  const [theme, setTheme] = useState('light');
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [history, setHistory] = useState([]);
  const [longTermHistory, setLongTermHistory] = useState([]);

  useEffect(() => {
    const fetchUserData = () => {
      const userData = {
        id: 1,
        name: 'John Doe',
        weight: 70,
        height: 170,
        age: 30,
        gender: 'pria',
        activityLevel: '1.2',
      };
      setUser(userData);
      setWeight(userData.weight.toString());
      setHeight(userData.height.toString());
      setAge(userData.age.toString());
      setGender(userData.gender);
      setActivityLevel(userData.activityLevel);

      const historyData = [
        { date: '2023-01-01', weight: 70, bmi: 22.5, dailyCalories: 2000, waterIntake: 2000 },
        { date: '2023-02-01', weight: 69, bmi: 22.2, dailyCalories: 2050, waterIntake: 2100 },
      ];
      setLongTermHistory(historyData);
    };

    fetchUserData();
  }, []);

  const debouncedCalculateAll = useCallback(debounce(() => {
    calculateAll();
  }, 500), [weight, height, age, gender, activityLevel]);

  useEffect(() => {
    debouncedCalculateAll();
    return debouncedCalculateAll.cancel;
  }, [weight, height, age, gender, activityLevel]);

  const calculateAll = () => {
    if (validateInputs()) {
      calculateBMI();
      calculateBMR();
      calculateWaterIntake();
      updateHistory();
    }
  };

  const validateInputs = () => {
    if (!weight || !height || !age) {
      setErrorMessage('Isi semua kolom yang diperlukan.');
      return false;
    }
    if (weight <= 0 || height <= 0 || age <= 0) {
      setErrorMessage('Masukkan angka positif yang valid.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const calculateBMI = () => {
    const bmiValue = weight / ((height / 100) * (height / 100));
    setBMI(bmiValue.toFixed(1));
  };

  const calculateBMR = () => {
    let bmrValue;
    if (gender === 'pria') {
      bmrValue = 66.5 + (13.7 * weight) + (5 * height) - (6.8 * age);
    } else {
      bmrValue = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
    }
    setBMR(Math.round(bmrValue));
    setDailyCalories(Math.round(bmrValue * parseFloat(activityLevel)));
  };

  const calculateWaterIntake = () => {
    setWaterIntake(Math.round(weight * 0.033 * 1000));
  };

  const updateHistory = () => {
    const newEntry = {
      date: new Date().toLocaleDateString(),
      weight: parseFloat(weight),
      bmi: parseFloat(bmi),
      dailyCalories: dailyCalories,
      waterIntake: waterIntake,
    };
    setHistory((prevHistory) => [...prevHistory, newEntry]);
    setLongTermHistory((prevLongTermHistory) => [...prevLongTermHistory, newEntry]);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const OnboardingContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4">Selamat datang di Dashboard Kesehatan!</h2>
      <p className="mb-4">Mulai dengan mengisi data kesehatan Anda.</p>
      <Button onClick={() => setIsOnboarding(false)}>Mulai</Button>
    </motion.div>
  );

  return (
    <div className={`dashboard ${theme}`}>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold">Dashboard Kesehatan</h1>
        <Button onClick={toggleTheme}>
          {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
      </header>

      {isOnboarding ? (
        <OnboardingContent />
      ) : (
        <Tabs defaultValue="calculator" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="calculator">Kalkulator</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Kalkulator Kesehatan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); calculateAll(); }}>
                  <div className="mb-4">
                    <Label htmlFor="weight">Berat Badan (kg)</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="height">Tinggi Badan (cm)</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="age">Usia (tahun)</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <Select onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pria">Pria</SelectItem>
                        <SelectItem value="wanita">Wanita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="activityLevel">Tingkat Aktivitas</Label>
                    <Select onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tingkat Aktivitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.2">Sedentary (minim olahraga)</SelectItem>
                        <SelectItem value="1.375">Ringan (olahraga ringan)</SelectItem>
                        <SelectItem value="1.55">Sedang (olahraga moderat)</SelectItem>
                  <SelectItem value="1.725">Aktif (olahraga berat)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="mt-4">Hitung</Button>
            </form>
            {errorMessage && (
              <Alert className="mt-4" variant="error">
                {errorMessage}
              </Alert>
            )}
            {bmi && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Hasil:</h3>
                <p>BMI: {bmi}</p>
                <p>BMR: {bmr} kalori/hari</p>
                <p>Kebutuhan Kalori Harian: {dailyCalories} kalori</p>
                <p>Rekomendasi Asupan Air: {waterIntake} mL/hari</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Kesehatan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={longTermHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                <Line type="monotone" dataKey="bmi" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    )}
  </div>
  );
};

export default Dashboard;
