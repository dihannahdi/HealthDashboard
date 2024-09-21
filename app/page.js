<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily Health Guide</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f8ff;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background-color: #00bfff;
            color: white;
            padding: 20px;
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            margin: 0;
        }
        .section {
            margin: 20px 0;
            padding: 20px;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            transition: transform 0.3s ease;
        }
        .section:hover {
            transform: scale(1.02);
        }
        .calculator-inputs {
            margin-top: 15px;
            display: flex;
            flex-direction: column;
        }
        .calculator-inputs input {
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        .btn {
            background-color: #00bfff;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #009acd;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background-color: #e0f7fa;
            border-radius: 5px;
        }
    </style>
</head>
<body>

    <header>
        <h1>Your Daily Health Guide</h1>
    </header>

    <div class="container">
        <!-- Welcome Section -->
        <section class="section">
            <h2>Welcome to Your Daily Health Guide!</h2>
            <p>Explore essential tools to calculate your BMI, daily water and nutrient intake, and learn about kidney health.</p>
        </section>

        <!-- BMI Calculator Section -->
        <section class="section" id="bmi">
            <h2>IMT (Body Mass Index) Calculator</h2>
            <p>Enter your weight and height to calculate your BMI and understand your category:</p>
            <div class="calculator-inputs">
                <label for="weight">Weight (kg):</label>
                <input type="number" id="weight" placeholder="Enter your weight in kg">
                <label for="height">Height (cm):</label>
                <input type="number" id="height" placeholder="Enter your height in cm">
                <button class="btn" onclick="calculateBMI()">Calculate BMI</button>
            </div>
            <div class="result" id="bmiResult"></div>
        </section>

        <!-- Water Intake Section -->
        <section class="section" id="water">
            <h2>Daily Water Consumption Standards</h2>
            <p>Find out how much water you need based on your weight and daily activity:</p>
            <div class="calculator-inputs">
                <label for="weightWater">Weight (kg):</label>
                <input type="number" id="weightWater" placeholder="Enter your weight in kg">
                <button class="btn" onclick="calculateWaterIntake()">Calculate Water Intake</button>
            </div>
            <div class="result" id="waterResult"></div>
        </section>

        <!-- Daily Nutrient Calculator Section -->
        <section class="section" id="nutrients">
            <h2>Daily Nutrient Intake</h2>
            <p>Enter your details to receive personalized nutrient recommendations:</p>
            <div class="calculator-inputs">
                <label for="age">Age:</label>
                <input type="number" id="age" placeholder="Enter your age">
                <label for="gender">Gender:</label>
                <select id="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <label for="activity">Physical Activity Level:</label>
                <select id="activity">
                    <option value="1.2">Almost never exercises</option>
                    <option value="1.3">Rarely exercises</option>
                    <option value="1.4">Frequently exercises</option>
                </select>
                <label for="weightNutrient">Weight (kg):</label>
                <input type="number" id="weightNutrient" placeholder="Enter your weight in kg">
                <label for="heightNutrient">Height (cm):</label>
                <input type="number" id="heightNutrient" placeholder="Enter your height in cm">
                <button class="btn" onclick="calculateNutrients()">Calculate Nutrients</button>
            </div>
            <div class="result" id="nutrientResult"></div>
        </section>

        <!-- Kidney Health Quiz Section -->
        <section class="section" id="kidney">
            <h2>Kidney Health Education</h2>
            <p>Learn about kidney health and take our kidney health quiz to test your knowledge.</p>
            <button class="btn" onclick="startKidneyQuiz()">Start Kidney Health Quiz</button>
        </section>
    </div>

    <script>
        function calculateBMI() {
            const weight = parseFloat(document.getElementById("weight").value);
            const height = parseFloat(document.getElementById("height").value) / 100;

            if (isNaN(weight) || isNaN(height) || height === 0) {
                document.getElementById("bmiResult").textContent = "Please enter valid weight and height.";
                return;
            }

            const bmi = weight / (height * height);
            let category;

            if (bmi < 17) category = "Severe underweight";
            else if (bmi >= 17 && bmi <= 18.4) category = "Mild underweight";
            else if (bmi >= 18.5 && bmi <= 25) category = "Normal";
            else if (bmi >= 25.1 && bmi <= 27) category = "Mild overweight";
            else category = "Severe overweight";

            document.getElementById("bmiResult").textContent = `Your BMI is ${bmi.toFixed(2)}, which means you are in the ${category} category.`;
        }

        function calculateWaterIntake() {
            const weight = parseFloat(document.getElementById("weightWater").value);
            if (isNaN(weight) || weight <= 0) {
                document.getElementById("waterResult").textContent = "Please enter a valid weight.";
                return;
            }

            const waterIntake = (weight * 30) / 1000; // Recommendation: 30 ml per kg of body weight
            document.getElementById("waterResult").textContent = `You should drink approximately ${waterIntake.toFixed(2)} liters of water per day.`;
        }

        function calculateNutrients() {
            const age = parseFloat(document.getElementById("age").value);
            const gender = document.getElementById("gender").value;
            const activity = parseFloat(document.getElementById("activity").value);
            const weight = parseFloat(document.getElementById("weightNutrient").value);
            const height = parseFloat(document.getElementById("heightNutrient").value);

            if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
                document.getElementById("nutrientResult").textContent = "Please enter valid inputs.";
                return;
            }

            const bmr = gender === "male"
                ? 66.5 + (13.7 * weight) + (5 * height) - (6.8 * age)
                : 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);

            const dailyCalories = bmr * activity;

            document.getElementById("nutrientResult").textContent = `Your BMR is ${bmr.toFixed(2)}. You should consume approximately ${dailyCalories.toFixed(2)} calories per day.`;
        }

        function startKidneyQuiz() {
            alert("Kidney Health Quiz Coming Soon!");
        }
    </script>
</body>
</html>
