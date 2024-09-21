'use client';

import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
import { Moon, Sun, Trophy, Bell, User } from 'lucide-react';

const Dashboard = () => {
  // User data and settings
  const [user, setUser] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('pria');
  const [activityLevel, setActivityLevel] = useState('1.2');
  
  // Health metrics
  const [bmi, setBMI] = useState(null);
  const [bmr, setBMR] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState('calculator');
  const [theme, setTheme] = useState('light');
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Custom goals
  const [customGoals, setCustomGoals] = useState({ protein: 15, carbs: 55, fats: 30 });
  
  // History and progress tracking
  const [history, setHistory] = useState([]);
  const [longTermHistory, setLongTermHistory] = useState([]);
  
  // Gamification
  const [achievements, setAchievements] = useState([]);
  
  // Reminders
  const [reminders, setReminders] = useState([]);
  
  // AI Chat
  const [showChatbox, setShowChatbox] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        weight: 70,
        height: 170,
        age: 30,
        gender: 'pria',
        activityLevel: '1.2'
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
        { date: '2023-03-01', weight: 68, bmi: 21.9, dailyCalories: 2100, waterIntake: 2200 },
        { date: '2023-04-01', weight: 67, bmi: 21.6, dailyCalories: 2150, waterIntake: 2300 },
      ];
      setLongTermHistory(historyData);
      
      setAchievements([
        { id: 1, name: 'First Log', description: 'Logged your first health data', achieved: true },
        { id: 2, name: 'Water Champion', description: 'Met water intake goal for 7 days', achieved: false },
        { id: 3, name: 'BMI Improver', description: 'Improved BMI by 1 point', achieved: false },
        { id: 4, name: 'Consistent Logger', description: 'Logged data for 30 consecutive days', achieved: false },
      ]);
      
      setReminders([
        { id: 1, type: 'hydration', message: 'Time to drink water!', time: '10:00', active: true },
        { id: 2, type: 'calories', message: 'Log your lunch', time: '13:00', active: true },
        { id: 3, type: 'exercise', message: 'Time for a quick workout!', time: '17:00', active: false },
      ]);
    };

    fetchUserData();
  }, []);

  const debouncedCalculateAll = useCallback(debounce(() => {
    calculateAll();
  }, 500), [weight, height, age, gender, activityLevel, customGoals]);

  useEffect(() => {
    debouncedCalculateAll();
    return debouncedCalculateAll.cancel; // Cleanup the debounce on unmount
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
      dailyCalories: dailyCalories,
      waterIntake: waterIntake
    };
    setHistory(prevHistory => [...prevHistory, newEntry]);
    setLongTermHistory(prevLongTermHistory => [...prevLongTermHistory, newEntry]);
    checkAchievements(newEntry);
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

  const checkAchievements = (entry) => {
    let newAchievements = [...achievements];
    
    if (longTermHistory.length >= 6 && !achievements.find(a => a.name === 'Week Streak')) {
      newAchievements.push({
        id: newAchievements.length + 1,
        name: 'Week Streak',
        description: 'Logged health data for 7 consecutive days',
        achieved: true
      });
    }
    
    const firstEntry = longTermHistory[0];
    const latestEntry = entry;
    if (firstEntry && latestEntry.bmi - firstEntry.bmi <= -1) {
      const bmiImprover = newAchievements.find(a => a.name === 'BMI Improver');
      if (bmiImprover && !bmiImprover.achieved) {
        bmiImprover.achieved = true;
      }
    }
    
    setAchievements(newAchievements);
  };

  const toggleReminder = (id) => {
    setReminders(prevReminders =>
      prevReminders.map(reminder =>
        reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
      )
    );
  };

  const sendChatMessage = (message) => {
    setChatMessages(prevMessages => [...prevMessages, { sender: 'user', text: message }]);
    setIsLoadingAI(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      setChatMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse }]);
      setIsLoadingAI(false);
    }, 1000);
  };

  const getAIResponse = (message) => {
    if (message.toLowerCase().includes('diet')) {
      return `Based on your BMI (${bmi}) and activity level, I recommend a balanced diet with a focus on lean proteins and vegetables. Aim for a calorie intake of ${dailyCalories} per day.`;
    } else if (message.toLowerCase().includes('workout')) {
      return `Given your current fitness level, I suggest starting with 30 minutes of moderate cardio 3 times a week, along with 2 strength training sessions. Remember to warm up and cool down properly!`;
    } else {
      return "I'm here to help with personalized diet and workout recommendations. Feel free to ask about either topic!";
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
    <div className={`dashboard ${theme}`}>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold">Dashboard Kesehatan</h1>
        <Button onClick={toggleTheme}>{theme === 'light' ? <Moon /> : <Sun />}</Button>
      </header>

      {isOnboarding ? (
        <OnboardingContent />
      ) : (
        <Tabs defaultValue="calculator" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="calculator">Kalkulator</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
            <TabsTrigger value="chat">Chat AI</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Kalkulator Kesehatan</CardTitle>
                <CardDescription>Masukkan data Anda untuk menghitung BMI, BMR, dan kebutuhan kalori.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault(); // Mencegah refresh
                  calculateAll();
                }}>
                  <div>
                    <Label htmlFor="weight">Berat Badan (kg)</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="height">Tinggi Badan (cm)</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="age">Usia (tahun)</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                  </div>
                  <div>
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
                  <div>
                    <Label htmlFor="activityLevel">Tingkat Aktivitas</Label>
                    <Select onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tingkat Aktivitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.2">Sedentari (tidak aktif)</SelectItem>
                        <SelectItem value="1.375">Ringan (latihan 1-3 hari/minggu)</SelectItem>
                        <SelectItem value="1.55">Sedang (latihan 3-5 hari/minggu)</SelectItem>
                        <SelectItem value="1.725">Tinggi (latihan 6-7 hari/minggu)</SelectItem>
                        <SelectItem value="1.9">Sangat Tinggi (latihan dua kali sehari)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Hitung</Button>
                </form>
                {errorMessage && <Alert><AlertTitle>Error</AlertTitle><AlertDescription>{errorMessage}</AlertDescription></Alert>}
                {bmi && <p>BMI Anda: {bmi} - {getBMICategory()}</p>}
                {bmr && <p>BMR Anda: {bmr} kalori/hari</p>}
                {dailyCalories && <p>Kebutuhan Kalori Harian: {dailyCalories} kalori</p>}
                {waterIntake && <p>Kebutuhan Air: {waterIntake} ml</p>}
                {getHealthRecommendations() && <p>Rekomendasi: {getHealthRecommendations()}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Kesehatan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {history.map((entry, index) => (
                    <li key={index}>
                      Tanggal: {entry.date}, Berat: {entry.weight} kg, BMI: {entry.bmi}, Kalori: {entry.dailyCalories}, Air: {entry.waterIntake} ml
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat dengan AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chatbox">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
                      {msg.text}
                    </div>
                  ))}
                  {isLoadingAI && <div className="ai-loading">AI sedang memproses...</div>}
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault(); // Mencegah refresh
                  const message = e.target.message.value;
                  if (message.trim()) {
                    sendChatMessage(message);
                    e.target.message.value = ''; // Kosongkan input setelah mengirim
                  }
                }}>
                  <Input type="text" name="message" placeholder="Tanya tentang diet atau olahraga..." />
                  <Button type="submit">Kirim</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Dashboard;