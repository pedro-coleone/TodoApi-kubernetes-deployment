import { useState, useEffect } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchTodos() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/todoitems");
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      console.log("Todos received from backend:", data);

      const filtered = data.filter(
        (todo) =>
          todo.name !== undefined &&
          todo.name !== null &&
          todo.name.trim() !== ""
      );
      setTodos(filtered);
    } catch (err) {
      setError("Erro ao carregar tarefas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo() {
    const trimmedTask = newTask.trim();
    if (!trimmedTask) return;
    setError(null);
    try {
      const res = await fetch("/api/todoitems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedTask, isComplete: false }),
      });
      if (res.ok) {
        setNewTask("");
        fetchTodos();
      } else {
        const errorData = await res.json();
        setError(errorData?.name ? errorData.name[0] : "Erro ao adicionar tarefa.");
      }
    } catch (err) {
      setError("Erro ao adicionar tarefa.");
      console.error(err);
    }
  }

  async function toggleTodo(id, isComplete, name) {
    if (!name || name.trim() === "") {
      setError("O nome da tarefa é obrigatório para alterar status.");
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/todoitems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          isComplete: !isComplete,
        }),
      });
      if (res.ok) {
        fetchTodos();
      } else {
        const errorData = await res.json();
        setError(errorData?.name ? errorData.name[0] : "Erro ao atualizar tarefa.");
      }
    } catch (err) {
      setError("Erro ao atualizar tarefa.");
      console.error(err);
    }
  }

  async function deleteTodo(id) {
    setError(null);
    try {
      const res = await fetch(`/api/todoitems/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchTodos();
      else setError("Falha ao deletar tarefa.");
    } catch (err) {
      setError("Erro ao deletar tarefa.");
      console.error(err);
    }
  }

  return (
  <div
    style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #eef2f7, #dce3f0)",  // Fundo no body todo
      padding: 20,
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 480,  // Fixa limite de largura, mas permite responsividade
        backgroundColor: "white",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24, color: "#222" }}>
        Lista de Tarefas
      </h1>

        <div style={{ display: "flex", marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Nova tarefa"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            style={{
              flexGrow: 1,
              padding: "10px 14px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #bbb",
              outline: "none",
              boxShadow: "inset 0 1px 4px rgb(0 0 0 / 0.05)",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#007bff")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#bbb")}
          />
          <button
            onClick={addTodo}
            style={{
              marginLeft: 12,
              padding: "10px 18px",
              fontSize: 16,
              borderRadius: 6,
              backgroundColor: "#007bff",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            Adicionar
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#842029",
              padding: 12,
              borderRadius: 6,
              marginBottom: 16,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>Carregando tarefas...</p>
        ) : todos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Nenhuma tarefa cadastrada.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              paddingLeft: 0,
              overflowY: "auto",
              flexGrow: 1,
              margin: 0,
            }}
          >
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  marginBottom: 12,
                  padding: 14,
                  borderRadius: 8,
                  backgroundColor: todo.isComplete ? "#d1e7dd" : "#fff",
                  boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #ccc",
                  transition: "background-color 0.3s ease",
                }}
              >
                <label
                  style={{
                    cursor: "pointer",
                    flexGrow: 1,
                    userSelect: "none",
                    color: todo.isComplete ? "#6c757d" : "#212529",
                    textDecoration: todo.isComplete ? "line-through" : "none",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.isComplete}
                    onChange={() =>
                      toggleTodo(todo.id, todo.isComplete, todo.name)
                    }
                    style={{ width: 20, height: 20, cursor: "pointer" }}
                  />
                  <span>{todo.name}</span>
                </label>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#dc3545",
                    fontWeight: "bold",
                    fontSize: 22,
                    cursor: "pointer",
                    padding: 0,
                    marginLeft: 12,
                    lineHeight: 1,
                    transition: "color 0.3s ease",
                  }}
                  title="Remover tarefa"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#a71d2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#dc3545")}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
