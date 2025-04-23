import { useState, useEffect } from "react";

export default function TodoList() {
  const API_URL = "http://localhost/my-todo-api/api.php";

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [filter, setFilter] = useState("all");

  // Load tasks from API
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // Add Task
  const addTask = () => {
    if (task.trim() === "") return;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks(prev => [...prev, newTask]);
        setTask("");
      });
  };

  // Remove Task
  const removeTask = (id) => {
    fetch(`${API_URL}?id=${id}`, { method: "DELETE" })
      .then(() => setTasks(prev => prev.filter(task => task.id !== id)));
  };

  // Edit Task
  const editTask = (index) => {
    setEditingIndex(index);
    setEditedText(tasks[index].text);
  };

  const saveEdit = (index) => {
    const taskToEdit = tasks[index];
    fetch(`${API_URL}?id=${taskToEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText, completed: taskToEdit.completed })
    })
      .then(res => res.json())
      .then(updatedTask => {
        const updatedTasks = [...tasks];
        updatedTasks[index].text = updatedTask.text;
        setTasks(updatedTasks);
        setEditingIndex(null);
      });
  };

  // Mark as Completed
  const toggleComplete = (index) => {
    const taskToUpdate = tasks[index];
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    fetch(`${API_URL}?id=${taskToUpdate.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask)
    })
      .then(res => res.json())
      .then(() => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = updatedTask;
        setTasks(updatedTasks);
      });
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul>
        {filteredTasks.map((task, index) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(index)} />
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => saveEdit(index)}>Save</button>
              </>
            ) : (
              <>
                {task.text}
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => removeTask(task.id)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <input type="text" placeholder="Add a new task..." value={task} onChange={(e) => setTask(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}
