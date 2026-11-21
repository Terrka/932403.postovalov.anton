# Лабораторная работа №6. Введение в Node.js и базовый сервер на Express

## Цель

Освоить запуск Node.js-приложений, работу с модулями, создание простого HTTP-сервера на Express, а также превращение статического сайта в PWA (устанавливаемое приложение с офлайн-режимом).

## Описание

Страница «Студент-разработчик» из лабораторной работы №5 перенесена в папку `public` и теперь раздаётся сервером на Express. Сервер находится в файле `server.js`, а файлы PWA (`manifest.json`, `pwa.js`, `service-worker.js`) — в папке `public`.

Реализованные функции:

* проект инициализирован командой `npm init`, установлен `express`, добавлен скрипт запуска `npm start`;
* сервер раздаёт статические файлы из папки `public` через `express.static()`;
* маршруты `GET /` (главная страница) и `GET /about` (страница «О себе»);
* маршрут `GET /api/tasks` возвращает список задач в виде JSON `[{ id, title, completed }]`; query-параметр `?completed=true` фильтрует только завершённые задачи;
* маршрут `POST /api/tasks` принимает JSON `{ title: "..." }` и добавляет новую задачу в массив в памяти; при отсутствии поля `title` возвращается `400` и `{ "error": "Title is required" }`;
* массив задач хранится в памяти сервера (без базы данных);
* если маршрут не найден, возвращается `404` и `{ "error": "Not found" }`;
* каждый запрос логируется в консоль (время, метод, адрес и код ответа);
* при запуске сервер выводит в консоль «Server started on port 3000»;
* `manifest.json` с названием, цветами и иконками подключён в `index.html` и `about.html`;
* service worker (`service-worker.js`) кеширует статику при установке и отдаёт её из кеша, поэтому сайт работает без сети; регистрация выполняется в `pwa.js`.

## Вариант работы

**Вариант 8.** Тема «Список задач» (в памяти).

Маршруты: `GET /`, `GET /about`, `GET /api/tasks`, `POST /api/tasks`.

Логика:
* массив задач в памяти;
* `POST` с `{ title: "..." }` добавляет задачу;
* `GET` возвращает список;
* query `?completed=true` фильтрует завершённые.

Формат ответа: `[{ id, title, completed: false }]` или отфильтрованный массив.

Ошибки: `POST` без `title` → `400`.

## Использованные технологии

* Node.js и npm
* Express (`express.static()`, маршруты, middleware, `express.json()` для разбора тела запроса)
* JSON API, коды ответов 200, 400, 404 и 500
* Query-параметры (`req.query`) для фильтрации задач
* Web App Manifest
* Service Worker и Cache API
* HTML5, CSS3, JavaScript

## Запуск проекта

1. Установить [Node.js](https://nodejs.org/) (версия 18 или новее).
2. В папке проекта установить зависимости:
```bash
npm install
```
3. Запустить сервер:
bash
```bash
npm install
```
4. Открыть в браузере http://localhost:3000.

## Проверка API
* Получить список задач:
```bash
curl http://localhost:3000/api/tasks
```
* Отфильтровать завершённые:
```bash
curl "http://localhost:3000/api/tasks?completed=true"
```
* Добавить задачу:
```bash
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d "{\"title\": \"Купить молоко\"}"
```
* Проверка ошибки (без `title` → `400 Bad Request`):
```bash
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d "{\"title\": \"\"}"
```
* Изменить статус задачи на выполенное:
```bash
curl -X PATCH http://localhost:3000/api/tasks/(id задачи) -H "Content-Type: application/json" -d '{"completed": true}'
```