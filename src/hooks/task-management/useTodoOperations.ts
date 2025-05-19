
import { TodoTask } from '../useTaskManagement';

export const useTodoOperations = (
  todos: TodoTask[],
  setTodos: React.Dispatch<React.SetStateAction<TodoTask[]>>,
  newTodo: string,
  setNewTodo: React.Dispatch<React.SetStateAction<string>>
) => {
  // Handle adding a regular todo
  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  // Handle completing a regular todo
  const handleCompleteTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle deleting a regular todo
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return {
    handleAddTodo,
    handleCompleteTodo,
    handleDeleteTodo
  };
};
