const express = require("express");
const path = require("path");
const { GetTasks, FindTask, AddTask, SetCompleted } = require("./tasks");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

function ParseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "about.html"));
});

app.use(express.static(PUBLIC_DIR));

app.get("/api/status", (req, res) => {
    res.json({
        status: "ok",
        uptime: Math.round(process.uptime()),
        time: new Date().toISOString(),
        tasks: GetTasks().length
    });
});

app.get("/api/tasks", (req, res) => {
    const { completed } = req.query;

    if (completed === undefined) {
        return res.json(GetTasks());
    }
    if (completed !== "true" && completed !== "false") {
        return res.status(400).json({ error: "Параметр completed должен быть true или false" });
    }
    res.json(GetTasks(completed === "true"));
});

app.get("/api/tasks/:id", (req, res) => {
    const id = ParseId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: "Некорректный id" });
    }
    const task = FindTask(id);
    if (!task) {
        return res.status(404).json({ error: "Задача не найдена" });
    }
    res.json(task);
});

app.post("/api/tasks", (req, res) => {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    if (!title) {
        return res.status(400).json({ error: "Поле title обязательно" });
    }
    res.status(201).json(AddTask(title));
});

app.patch("/api/tasks/:id", (req, res) => {
    const id = ParseId(req.params.id);
    if (id === null) {
        return res.status(400).json({ error: "Некорректный id" });
    }
    if (typeof req.body?.completed !== "boolean") {
        return res.status(400).json({ error: "Поле completed должно быть true или false" });
    }
    const task = SetCompleted(id, req.body.completed);
    if (!task) {
        return res.status(404).json({ error: "Задача не найдена" });
    }
    res.json(task);
});

app.use("/api", (req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Некорректный JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
