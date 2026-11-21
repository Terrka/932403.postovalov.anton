const tasks = [];
let nextId = 1;

function GetTasks(completed) {
    if (completed === undefined) {
        return tasks.slice();
    }
    return tasks.filter(task => task.completed === completed);
}

function FindTask(id) {
    return tasks.find(task => task.id === id);
}

function AddTask(title) {
    const task = { id: nextId++, title, completed: false };
    tasks.push(task);
    return task;
}

function SetCompleted(id, completed) {
    const task = FindTask(id);
    if (!task) {
        return null;
    }
    task.completed = completed;
    return task;
}

module.exports = { GetTasks, FindTask, AddTask, SetCompleted };
