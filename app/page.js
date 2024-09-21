'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Simulate fetching user data from a database
    const fetchUserData = async () => {
      // In a real application, this would be an API call
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
      
      // Fetch long-term history
      const historyData = [
        { date: '2023-01-01', weight: 70, bmi: 22.5, dailyCalories: 2000, waterIntake: 2000 },
        { date: '2023-02-01', weight: 69, bmi: 22.2, dailyCalories: 2050, waterIntake: 2100 },
        { date: '2023-03-01', weight: 68, bmi: 21.9, dailyCalories: 2100, waterIntake: 2200 },
        { date: '2023-04-01', weight: 67, bmi: 21.6, dailyCalories: 2150, waterIntake: 2300 },
      ];
      setLongTermHistory(historyData);
      
      // Set initial achievements
      setAchievements([
        { id: 1, name: 'First Log', description: 'Logged your first health data', achieved: true },
        { id: 2, name: 'Water Champion', description: 'Met water intake goal for 7 days', achieved: false },
        { id: 3, name: 'BMI Improver', description: 'Improved BMI by 1 point', achieved: false },
        { id: 4, name: 'Consistent Logger', description: 'Logged data for 30 consecutive days', achieved: false },
      ]);
      
      // Set initial reminders
      setReminders([
        { id: 1, type: 'hydration', message: 'Time to drink water!', time: '10:00', active: true },
        { id: 2, type: 'calories', message: 'Log your lunch', time: '13:00', active: true },
        { id: 3, type: 'exercise', message: 'Time for a quick workout!', time: '17:00', active: false },
      ]);
    };

    fetchUserData();
  }, []);

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
      dailyCalories: dailyCalories,
      waterIntake: waterIntake
    };
    setHistory(prevHistory => [...prevHistory, newEntry]);
    setLongTermHistory(prevLongTermHistory => [...prevLongTermHistory, newEntry]);
    
    // Check for achievements
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
    
    // Check if user has logged data for 7 consecutive days
    if (longTermHistory.length >= 6 && !achievements.find(a => a.name === 'Week Streak')) {
      newAchievements.push({
        id: newAchievements.length + 1,
        name: 'Week Streak',
        description: 'Logged health data for 7 consecutive days',
        achieved: true
      });
    }
    
    // Check if BMI has improved by 1 point
    const firstEntry = longTermHistory[0];
    const latestEntry = entry;
    if (firstEntry && latestEntry.bmi - firstEntry.bmi <= -1) {
      const bmiImprover = newAchievements.find(a => a.name === 'BMI Improver');
      if (bmiImprover && !bmiImprover.achieved) {
        bmiImprover.achieved = true;
      }
    }
    
    // Add more achievement checks here
    
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
    
    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      setChatMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse }]);
    }, 1000);
  };

  const getAIResponse = (message) => {
    // This is a placeholder for AI-powered recommendations
    // In a real application, this would involve calling an AI service
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

  const CalculatorContent = () => (
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
          <motion.div variants={itemVariants}>
            <Button onClick={calculateAll} className={`mt-4 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-700 hover:bg-orange-800'} text-white font-bold py-2 px-4 rounded`}>Hitung</Button>
          </motion.div>
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
  );

  const NutritionContent = () => (
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
  );

  const ProgressVisualization = () => (
    <Card className={theme === 'dark' ? 'border-gray-700' : 'border-orange-200'}>
      <CardHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}>
        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Progress Visualization</CardTitle>
        <CardDescription>Track your health progress over time</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <Tabs>
          <TabsList>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="bmi">BMI</TabsTrigger>
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="water">Water Intake</TabsTrigger>
          </TabsList>
          <TabsContent value="weight">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={longTermHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="bmi">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={longTermHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bmi" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="calories">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={longTermHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dailyCalories" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="water">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={longTermHistory}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="waterIntake" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const AchievementsSection = () => (
    <Card className={theme === 'dark' ? 'border-gray-700' : 'border-orange-200'}>
      <CardHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}>
        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Achievements</CardTitle>
        <CardDescription>Your health milestones and accomplishments</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <Card key={achievement.id} className={achievement.achieved ? 'bg-green-100' : 'bg-gray-100'}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2" />
                  {achievement.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const RemindersSection = () => (
    <Card className={theme === 'dark' ? 'border-gray-700' : 'border-orange-200'}>
      <CardHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}>
        <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Reminders</CardTitle>
        <CardDescription>Set and manage your health reminders</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-2">
          {reminders.map(reminder => (
            <div key={reminder.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div>
                <p className="font-semibold">{reminder.message}</p>
                <p className="text-sm text-gray-600">{reminder.time}</p>
              </div>
              <Switch
                checked={reminder.active}
                onCheckedChange={() => toggleReminder(reminder.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AIChat = () => (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-2 flex justify-between items-center">
        <h3 className="font-semibold">AI Health Assistant</h3>
        <button onClick={() => setShowChatbox(false)} className="text-white">&times;</button>
      </div>
      <div className="h-64 overflow-y-auto p-2">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const message = e.target.message.value;
        if (message.trim()) {
          sendChatMessage(message);
          e.target.message.value = '';
        }
      }} className="p-2 border-t">
        <Input type="text" name="message" placeholder="Ask for health advice..." />
      </form>
    </div>
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
            <div className="flex items-center">
              <Button onClick={toggleTheme} className="mr-2">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              {user && (
                <div className="flex items-center">
                  <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt="User avatar" className="w-8 h-8 rounded-full mr-2" />
                  <span>{user.name}</span>
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <TabsContent value="calculator"><CalculatorContent /></TabsContent>
              <TabsContent value="nutrition"><NutritionContent /></TabsContent>
              <TabsContent value="progress"><ProgressVisualization /></TabsContent>
              <TabsContent value="achievements"><AchievementsSection /></TabsContent>
              <TabsContent value="reminders"><RemindersSection /></TabsContent>
            </AnimatePresence>
          </Tabs>

          <Card className={`mt-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-white' : 'text-orange-800'}>Rekomendasi Kesehatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{getHealthRecommendations()}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <AnimatePresence>
        {showChatbox && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4"
          >
            <AIChat />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="fixed bottom-4 left-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button onClick={() => setShowChatbox(true)} className="rounded-full p-2">
          <User className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;