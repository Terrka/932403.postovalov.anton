const userName = prompt("Введите ваше имя:", "Гость");
if (userName) {
    alert(`Приветствуем вас, ${userName}! Давайте проанализируем калорийность вашего рациона.`);
}

const calories =[500,300,200,300,1800]; 

function FindMax(arr) {
    if (arr.length === 0) return 0;
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function FilterCalories(arr, threshold) {
    const filtered = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > threshold) {
            filtered.push(arr[i]);
        }
    }
    return filtered;
}

function CalculateSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

let lowCalorieCount = 0;
let lowCalorieSum = 0;

for (let i = 0; i < calories.length; i++) {
    if (calories[i] <= 300) {
        lowCalorieCount++;
        lowCalorieSum += calories[i];
    }
}

const totalSum = CalculateSum(calories);
const highCalorieDishes = FilterCalories(calories, 600); 
const highCalorieSum = CalculateSum(highCalorieDishes);

const lowCalorieShare = calories.length > 0 ? ((lowCalorieCount / calories.length) * 100).toFixed(1) : 0;

alert(`Суммарная калорийность – ${totalSum} ккал, из них ${highCalorieSum} ккал – в высококалорийных блюдах.`);

console.log(`Количество низкокалорийных блюд (≤ 300 ккал): ${lowCalorieCount} шт.`);
console.log(`Доля низкокалорийных блюд: ${lowCalorieShare}% от общего рациона.`);
console.log(`Максимальная калорийность среди блюд: ${FindMax(calories)} ккал.`);

if (totalSum > 3000) {
    console.log("Такой рацион лучше распределить на 2 дня");
}