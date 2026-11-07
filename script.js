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

const STORAGE_KEY = "recipeBlogState";

let state = {
    recipes: [], 
    theme: "light",
    recipesHidden: false
};

function GetElementSafe(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.error(`Ошибка: элемент с id="${id}" не найден на странице.`);
    }
    return el;
}

function QueryOneSafe(selector) {
    const el = document.querySelector(selector);
    if (!el) {
        console.error(`Ошибка: элемент "${selector}" не найден.`);
    }
    return el;
}

const addBtn = GetElementSafe("add-recipe");
const removeLastBtn = GetElementSafe("remove-last");
const toggleRecipesBtn = GetElementSafe("toggle-recipes");
const themeBtn = GetElementSafe("theme-toggle");
const recipesBlock = GetElementSafe("recipes-block");
const recipesList = GetElementSafe("recipes-list");
const statusEl = QueryOneSafe("#my-recipes .recipes-status");

function ShowStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle("error", isError);
}

function SaveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Не удалось сохранить состояние:", e);
    }
}

function LoadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.recipes)) {
            state.recipes = parsed.recipes.filter(
                r => r && typeof r.title === "string" && Array.isArray(r.ingredients)
            );
        }
        if (parsed.theme === "dark" || parsed.theme === "light") {
            state.theme = parsed.theme;
        }
        state.recipesHidden = parsed.recipesHidden === true;
    } catch (e) {
        console.error("Не удалось прочитать сохранённое состояние:", e);
    }
}

function CreateRecipeCard(recipe, index) {
    const card = document.createElement("article");
    card.classList.add("recipe-card");
    card.setAttribute("data-index", index);

    const title = document.createElement("h3");
    title.textContent = recipe.title;

    const ul = document.createElement("ul");
    recipe.ingredients.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Удалить";
    deleteBtn.setAttribute("aria-label", `Удалить рецепт «${recipe.title}»`);
    deleteBtn.addEventListener("click", () => DeleteRecipe(index));

    card.append(title, ul, deleteBtn);
    return card;
}

function RenderRecipes() {
    if (!recipesList) return;
    recipesList.innerHTML = "";
    state.recipes.forEach((recipe, i) => {
        recipesList.appendChild(CreateRecipeCard(recipe, i));
    });

    const cards = document.querySelectorAll("#recipes-list .recipe-card");
    if (cards.length === 0) {
        ShowStatus("Пока нет рецептов. Нажмите «Добавить рецепт».");
    } else {
        ShowStatus(`Рецептов: ${cards.length}`);
    }
}

function AddRecipe() {
    if (!recipesList) {
        alert("Невозможно добавить рецепт: контейнер списка не найден.");
        return;
    }

    const titleInput = prompt("Введите название рецепта:");
    if (titleInput === null) return;
    const title = titleInput.trim();
    if (!title) {
        ShowStatus("Название не может быть пустым.", true);
        return;
    }

    const ingInput = prompt("Введите ингредиенты через запятую (например: лапша, яйца, чеснок):");
    if (ingInput === null) return;
    const ingredients = ingInput
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    if (ingredients.length === 0) {
        ShowStatus("Укажите хотя бы один ингредиент.", true);
        return;
    }

    state.recipes.push({ title, ingredients });
    SaveState();
    RenderRecipes();

    const newCard = QueryOneSafe("#recipes-list .recipe-card:last-child");
    if (newCard) {
        newCard.classList.add("highlight");
        setTimeout(() => newCard.classList.remove("highlight"), 1500);
    }
}

function DeleteRecipe(index) {
    if (index < 0 || index >= state.recipes.length) {
        ShowStatus("Не удалось удалить: рецепт не найден.", true);
        return;
    }
    state.recipes.splice(index, 1);
    SaveState();
    RenderRecipes();
}

function RemoveLastRecipe() {
    if (!recipesList) return;
    const lastCard = QueryOneSafe("#recipes-list .recipe-card:last-child");
    if (!lastCard || state.recipes.length === 0) {
        ShowStatus("Удалять нечего: список рецептов пуст.", true);
        return;
    }
    state.recipes.pop();
    lastCard.remove();
    SaveState();
    RenderRecipes();
}

function ApplyTheme() {
    document.body.classList.toggle("dark-theme", state.theme === "dark");
    if (themeBtn) {
        themeBtn.textContent = state.theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема";
        themeBtn.setAttribute("aria-pressed", String(state.theme === "dark"));
    }
}

function ToggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    ApplyTheme();
    SaveState();
}

function ApplyRecipesVisibility() {
    if (recipesBlock) {
        recipesBlock.classList.toggle("hidden", state.recipesHidden);
    }
    if (toggleRecipesBtn) {
        toggleRecipesBtn.textContent = state.recipesHidden ? "Показать рецепты" : "Скрыть рецепты";
        toggleRecipesBtn.setAttribute("aria-expanded", String(!state.recipesHidden));
    }
}

function ToggleRecipesBlock() {
    state.recipesHidden = !state.recipesHidden;
    ApplyRecipesVisibility();
    SaveState();
}

if (addBtn) addBtn.addEventListener("click", AddRecipe);
if (removeLastBtn) removeLastBtn.addEventListener("click", RemoveLastRecipe);
if (toggleRecipesBtn) toggleRecipesBtn.addEventListener("click", ToggleRecipesBlock);
if (themeBtn) themeBtn.addEventListener("click", ToggleTheme);

LoadState();
ApplyTheme();
ApplyRecipesVisibility();
RenderRecipes();