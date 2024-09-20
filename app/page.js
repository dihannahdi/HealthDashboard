import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-700">Dashboard Kesehatan</h1>
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="w-full justify-center mb-4">
            <TabsTrigger value="calculator" className="flex-1">Kalkulator</TabsTrigger>
            <TabsTrigger value="nutrition" className="flex-1">Nutrisi</TabsTrigger>
            <TabsTrigger value="education" className="flex-1">Edukasi</TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="calculator">
              <Card className="border-orange-200">
                <CardHeader className="bg-orange-100">
                  <CardTitle className="text-orange-800">Kalkulator Kesehatan</CardTitle>
                  <CardDescription>Hitung IMT, BMR, dan kebutuhan kalori harian Anda</CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight" className="text-orange-700">Berat Badan (kg)</Label>
                        <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="border-orange-200" />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-orange-700">Tinggi Badan (cm)</Label>
                        <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="border-orange-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="text-orange-700">Usia</Label>
                        <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="border-orange-200" />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-orange-700">Jenis Kelamin</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger id="gender" className="border-orange-200">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pria">Pria</SelectItem>
                            <SelectItem value="wanita">Wanita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="activity" className="text-orange-700">Tingkat Aktivitas</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <Select Trigger id="activity" className="border-orange-200">
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
                    </div>
                  </div>
                  <Button onClick={calculateBMI} className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">Hitung</Button>
                </CardContent>
                <CardFooter>
                  <p>IMT: {bmi ? bmi : 'Belum dihitung'}</p>
                  <p>Kategori IMT: {getBMICategory()}</p>
                  <p>BMR: {bmr ? bmr : 'Belum dihitung'}</p>
                  <p>Kebutuhan kalori harian: {dailyCalories ? dailyCalories : 'Belum dihitung'}</p>
                  <p>Kebutuhan air harian: {waterIntake ? waterIntake : 'Belum dihitung'} ml</p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="nutrition">
              <Card className="border-orange-200">
                <CardHeader className="bg-orange-100">
                  <CardTitle className="text-orange-800">Nutrisi Harian</CardTitle>
                  <CardDescription>Kebutuhan nutrisi harian Anda</CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={nutrientData}>
                      <Line type="monotone" dataKey="amount" stroke="#f97316" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                      <Tooltip />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education">
              <Card className="border-orange-200">
                <CardHeader className="bg-orange-100">
                  <CardTitle className="text-orange-800">Edukasi Kesehatan</CardTitle>
                  <CardDescription>Tips dan edukasi kesehatan untuk Anda</CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                  <p>Coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;