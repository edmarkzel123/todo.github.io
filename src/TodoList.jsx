import { useState, useEffect } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState([
    { text: "Learn React", completed: false },
    { text: "Build a project", completed: false },
  ]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [filter, setFilter] = useState("all");

  // Add Task
  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  // Remove Task
  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Edit Task
  const editTask = (index) => {
    setEditingIndex(index);
    setEditedText(tasks[index].text);
  };

  const saveEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editedText;
    setTasks(updatedTasks);
    setEditingIndex(null);
  };

  // Mark as Completed
  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
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
          <li key={index} className={task.completed ? "completed" : ""}>
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
                <button onClick={() => removeTask(index)}>❌</button>
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
