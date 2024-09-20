'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-700">Health Dashboard</h1>
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="w-full justify-center mb-4">
            <TabsTrigger value="calculator" className="flex-1">Kalkulator</TabsTrigger>
            <TabsTrigger value="nutrition" className="flex-1">Nutrisi</TabsTrigger>
            <TabsTrigger value="education" className="flex-1">Edukasi</TabsTrigger>
          </TabsList>
          
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
                      <SelectTrigger id="activity" className="border-orange-200">
                        <SelectValue placeholder="Pilih tingkat aktivitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.2">Hampir tidak pernah berolahraga</SelectItem>
                        <SelectItem value="1.3">Jarang berolahraga</SelectItem>
                        <SelectItem value="1.4">Sering berolahraga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button onClick={() => { calculateBMI(); calculateBMR(); calculateWaterIntake(); }} className="bg-orange-500 hover:bg-orange-600">Hitung</Button>
              </CardFooter>
            </Card>
            
            {bmi && bmr && dailyCalories && (
              <Card className="mt-4 border-orange-200">
                <CardHeader className="bg-orange-100">
                  <CardTitle className="text-orange-800">Hasil</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">IMT: {bmi} ({getBMICategory()})</p>
                  <p className="text-orange-700">BMR: {bmr} kkal</p>
                  <p className="text-orange-700">Kebutuhan Kalori Harian: {dailyCalories} kkal</p>
                  <p className="text-orange-700">Asupan Air Harian: {waterIntake} ml</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="nutrition">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-100">
                <CardTitle className="text-orange-800">Panduan Nutrisi Harian</CardTitle>
                <CardDescription>Berdasarkan kebutuhan kalori harian Anda</CardDescription>
              </CardHeader>
              <CardContent>
                {dailyCalories ? (
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={nutrientData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="amount" stroke="#f97316" />
                      </LineChart>
                    </ResponsiveContainer>
                    <ul className="list-disc pl-5 mt-4 text-orange-700">
                      {nutrientData.map((nutrient, index) => (
                        <li key={index}>
                          {nutrient.name}: {nutrient.amount} {nutrient.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-orange-700">Silakan hitung kebutuhan kalori harian Anda terlebih dahulu.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education">
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-100">
                <CardTitle className="text-orange-800">Gagal Ginjal pada Anak</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold text-orange-700 mt-4">Pengertian</h3>
                <p className="text-orange-600">Gagal ginjal adalah kondisi di mana ginjal tidak mampu lagi menjalankan fungsinya untuk menyaring limbah dan kelebihan cairan dari darah. Pada anak-anak, kondisi ini bisa bersifat akut (tiba-tiba) atau kronis (jangka panjang).</p>
                
                <h3 className="text-lg font-semibold text-orange-700 mt-4">Gejala</h3>
                <ul className="list-disc pl-5 text-orange-600">
                  <li>Tekanan darah tinggi</li>
                  <li>Kehilangan berat badan atau pertumbuhan yang melambat</li>
                  <li>Oedema (pembengkakan) terutama pada mata, kaki, atau pergelangan kaki</li>
                  <li>Kelelahan atau lesu</li>
                  <li>Mual dan muntah</li>
                  <li>Sering buang air kecil atau kurang buang air kecil</li>
                  <li>Urin berdarah atau berbusa</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-orange-700 mt-4">Pencegahan</h3>
                <ul className="list-disc pl-5 text-orange-600">
                  <li>Pengelolaan penyakit dasar: Seperti diabetes atau hipertensi</li>
                  <li>Hindari penggunaan obat-obatan tanpa pengawasan dokter</li>
                  <li>Konsumsi air yang cukup</li>
                  <li>Pengawasan rutin terhadap kesehatan ginjal, terutama jika memiliki riwayat keluarga dengan penyakit ginjal</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-orange-700 mt-4">Komplikasi</h3>
                <ul className="list-disc pl-5 text-orange-600">
                  <li>Kerusakan jantung atau pembuluh darah</li>
                  <li>Anemia</li>
                  <li>Kerusakan tulang atau gangguan mineral</li>
                  <li>Gangguan elektrolit, seperti hiperkalemia</li>
                  <li>Kematian mendadak</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="mt-8 text-orange-700 text-center">
        &copy; 2024 Atania Ilma. Hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
};

export default Dashboard;
