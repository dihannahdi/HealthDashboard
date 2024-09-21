'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('calculator');
  const [customGoals, setCustomGoals] = useState({ protein: 15, carbs: 55, fats: 30 });
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    calculateAll();
  }, [weight, height, age, gender, activityLevel, customGoals]);

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
      setErrorMessage('Please fill in all required fields.');
      return false;
    }
    if (weight <= 0 || height <= 0 || age <= 0) {
      setErrorMessage('Please enter valid positive numbers for weight, height, and age.');
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
      dailyCalories: dailyCalories
    };
    setHistory(prevHistory => [...prevHistory, newEntry]);
  };

  const getBMICategory = () => {
    if (bmi === null) return '';
    if (bmi < 17.0) return 'Kurus (Berat badan kurang parah)';
    if (bmi < 18.5) return 'Kurus (Berat badan kurang ringan)';
    if (bmi < 25.1) return 'Normal';
    if (bmi < 27.1) return 'Gemuk (Kelebihan berat badan ringan)';
    return 'Gemuk (Kelebihan berat badan parah)';
  };

  const getHealthRecommendations = () => {
    const bmiCategory = getBMICategory();
    if (bmiCategory.includes('Kurus')) {
      return "Fokus pada peningkatan asupan kalori dan protein. Konsultasikan dengan ahli gizi untuk rencana makan yang sehat.";
    } else if (bmiCategory.includes('Gemuk')) {
      return "Pertimbangkan untuk meningkatkan aktivitas fisik dan mengurangi asupan kalori. Konsultasikan dengan dokter untuk rencana penurunan berat badan yang aman.";
    } else {
      return "Pertahankan gaya hidup sehat Anda dengan diet seimbang dan olahraga teratur.";
    }
  };

  const nutrientData = [
    { name: 'Protein', amount: Math.round(dailyCalories * customGoals.protein / 100 / 4), unit: 'g' },
    { name: 'Lemak', amount: Math.round(dailyCalories * customGoals.fats / 100 / 9), unit: 'g' },
    { name: 'Karbohidrat', amount: Math.round(dailyCalories * customGoals.carbs / 100 / 4), unit: 'g' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const OnboardingContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4">Selamat datang di Dashboard Kesehatan!</h2>
      <p className="mb-4">Dashboard ini membantu Anda menghitung dan melacak berbagai metrik kesehatan penting:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>Kalkulator BMI, BMR, dan Kebutuhan Kalori</li>
        <li>Pelacakan Nutrisi</li>
        <li>Rekomendasi Kesehatan Personalisasi</li>
        <li>Pelacakan Kemajuan</li>
      </ul>
      <p className="mb-4">Mulailah dengan memasukkan data Anda di tab Kalkulator.</p>
      <Button onClick={() => setIsOnboarding(false)}>Mulai</Button>
    </motion.div>
  );

  return (
    <motion.div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-orange-50'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {isOnboarding ? (
        <OnboardingContent />
      ) : (
        <motion.div 
          className={`w-full max-w-4xl rounded-lg shadow-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-orange-700'}`}>Dashboard Kesehatan</h1>
            <Button onClick={toggleTheme} variant="outline">
              {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-center mb-4">
              <TabsTrigger value="calculator" className="flex-1">Kalkulator</TabsTrigger>
              <TabsTrigger value="nutrition" className="flex-1">Nutrisi</TabsTrigger>
              <TabsTrigger value="progress" className="flex-1">Kemajuan</TabsTrigger>
              <TabsTrigger value="recommendations" className="flex-1">Rekomendasi</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="calculator">
                  <Card className={theme === 'dark' ? 'border-gray-700' : 'border-orange-200'}>
                    <CardHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}>
                      <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Kalkulator Kesehatan</CardTitle>
                      <CardDescription>Hitung IMT, BMR, dan kebutuhan kalori harian Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <motion.div className="grid gap-4" variants={containerVariants}>
                        <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                          <div>
                            <Label htmlFor="weight" className={theme === 'dark' ? 'text-white' : 'text-orange-700'}>Berat Badan (kg)</Label>
                            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={theme === 'dark' ? 'border-gray-600' : 'border-orange-200'} />
                          </div>
                          <div>
                            <Label htmlFor="height" className={theme === 'dark' ? 'text-white' : 'text-orange-700'}>Tinggi Badan (cm)</Label>
                            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={theme === 'dark' ? 'border-gray-600' : 'border-orange-200'} />
                          </div>
                        </motion.div>
                        <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
                          <div>
                            <Label htmlFor="age" className={theme === 'dark' ? 'text-white' : 'text-orange-700'}>Usia</Label>
                            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className={theme === 'dark' ? 'border-gray-600' : 'border-orange-200'} />
                          </div>
                          <div>
                            <Label htmlFor="gender" className={theme === 'dark' ? 'text-white' : 'text-orange-700'}>Jenis Kelamin</Label>
                            <Select value={gender} onValueChange={setGender}>
                              <SelectTrigger id="gender" className={theme === 'dark' ? 'border-gray-600' : 'border-orange-200'}>
                                <SelectValue placeholder="Pilih jenis kelamin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pria">Pria</SelectItem>
                                <SelectItem value="wanita">Wanita</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Label htmlFor="activity" className={theme === 'dark' ? 'text-white' : 'text-orange-700'}>Tingkat Aktivitas</Label>
                          <Select value={activityLevel} onValueChange={setActivityLevel}>
                            <SelectTrigger id="activity" className={theme === 'dark' ? 'border-gray-600' : 'border-orange-200'}>
                              <SelectValue placeholder="Pilih tingkat aktivitas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.2">Sedentari (kurang dari 1.5 jam/hari)</SelectItem>
                              <SelectItem value="1.375">Ringan (1.5-3 jam/hari)</SelectItem>
                              <SelectItem value="1.55">Moderat (3-5 jam/hari)</SelectItem>
                              <SelectItem value="1.725">Berat (5-7 jam/hari)</SelectItem>
                              <SelectItem value="1.9">Ekstra berat (lebih dari 7 jam/hari)</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Button onClick={calculateAll} className={`mt-4 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-700 hover:bg-orange-800'} text-white font-bold py-2 px-4 rounded`}>Hitung</Button>
                      </motion.div>
                      {errorMessage && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    <CardFooter>
                    <motion.div className="grid gap-2" variants={containerVariants}>
                        <motion.p variants={itemVariants}>IMT: {bmi ? bmi : 'Belum dihitung'}</motion.p>
                        <motion.p variants={itemVariants}>Kategori IMT: {getBMICategory()}</motion.p>
                        <motion.p variants={itemVariants}>BMR: {bmr ? bmr : 'Belum dihitung'}</motion.p>
                        <motion.p variants={itemVariants}>Kebutuhan kalori harian: {dailyCalories ? dailyCalories : 'Belum dihitung'}</motion.p>
                        <motion.p variants={itemVariants}>Kebutuhan air harian: {waterIntake ? waterIntake : 'Belum dihitung'} ml</motion.p>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="nutrition">
                  <Card className={theme === 'dark' ? 'border-gray-700' : 'border-orange-200'}>
                    <CardHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}>
                      <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Nutrisi Harian</CardTitle>
                      <CardDescription>Kebutuhan nutrisi harian dan distribusi makronutrien Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                          <div className="w-full md:w-1/2 mb-4 md:mb-0">
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={nutrientData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="amount"
                                >
                                  {nutrientData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="w-full md:w-1/2">
                            <h3 className="text-lg font-semibold mb-2">Custom Nutrient Goals</h3>
                            <div className="space-y-4">
                              {Object.entries(customGoals).map(([nutrient, value]) => (
                                <div key={nutrient}>
                                  <Label htmlFor={nutrient} className="capitalize">{nutrient} (%)</Label>
                                  <Slider
                                    id={nutrient}
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[value]}
                                    onValueChange={(newValue) => setCustomGoals(prev => ({ ...prev, [nutrient]: newValue[0] }))}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Nutrient Breakdown</h3>
                          <ul>
                            {nutrientData.map((nutrient) => (
                              <li key={nutrient.name} className="mb-2">
                                {nutrient.name}: {nutrient.amount} {nutrient.unit} ({customGoals[nutrient.name.toLowerCase()]}% of daily calories)
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="progress">
                  <Card className={theme === 'dark' ? 'border-gray-700' : 'border-orange-200'}>
                    <CardHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}>
                      <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Kemajuan</CardTitle>
                      <CardDescription>Lacak kemajuan kesehatan Anda dari waktu ke waktu</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={history}>
                            <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                            <Line type="monotone" dataKey="bmi" stroke="#82ca9d" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <Tooltip />
                            <Legend />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">History Log</h3>
                          <ul className="space-y-2">
                            {history.slice(-5).reverse().map((entry, index) => (
                              <li key={index} className="border-b pb-2">
                                <strong>{entry.date}:</strong> Weight: {entry.weight}kg, BMI: {entry.bmi}, Calories: {entry.dailyCalories}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <Card className={theme === 'dark' ? 'border-gray-700' : 'border-orange-200'}>
                    <CardHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}>
                      <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Rekomendasi Kesehatan</CardTitle>
                      <CardDescription>Saran personalisasi berdasarkan data Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-lg font-semibold mb-2">Rekomendasi Umum</h3>
                        <p className="mb-4">{getHealthRecommendations()}</p>
                        <h3 className="text-lg font-semibold mb-2">Saran Nutrisi</h3>
                        <ul className="list-disc pl-5 mb-4">
                          <li>Pastikan untuk mengonsumsi {nutrientData[0].amount}g protein setiap hari untuk mendukung massa otot dan pemulihan.</li>
                          <li>Batasi asupan lemak hingga {nutrientData[1].amount}g per hari, fokus pada lemak sehat seperti yang ditemukan dalam ikan, kacang-kacangan, dan minyak zaitun.</li>
                          <li>Konsumsi sekitar {nutrientData[2].amount}g karbohidrat sehari, utamakan sumber karbohidrat kompleks seperti biji-bijian, sayuran, dan kacang-kacangan.</li>
                        </ul>
                        <h3 className="text-lg font-semibold mb-2">Saran Aktivitas</h3>
                        <p>Berdasarkan tingkat aktivitas Anda, pertimbangkan untuk:</p>
                        <ul className="list-disc pl-5 mb-4">
                          <li>Melakukan aktivitas kardio sedang selama 150 menit per minggu.</li>
                          <li>Memasukkan latihan kekuatan 2-3 kali seminggu untuk membangun dan mempertahankan massa otot.</li>
                          <li>Meningkatkan aktivitas harian Anda, seperti berjalan kaki atau naik tangga, untuk membakar kalori tambahan.</li>
                        </ul>
                      </motion.div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;