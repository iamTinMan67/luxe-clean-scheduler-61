
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TodoTask } from "@/hooks/useTaskManagement";

interface TodoListComponentProps {
  todos: TodoTask[];
  newTodo: string;
  onSetNewTodo: (todo: string) => void;
  onAddTodo: () => void;
  onCompleteTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const TodoListComponent = ({
  todos,
  newTodo,
  onSetNewTodo,
  onAddTodo,
  onCompleteTodo,
  onDeleteTodo
}: TodoListComponentProps) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Add a new task"
          className="bg-black/70 text-white border-gold/50 focus-visible:ring-gold/50"
          value={newTodo}
          onChange={(e) => onSetNewTodo(e.target.value)}
        />
        <Button onClick={onAddTodo} className="gold-gradient text-black">Add</Button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between py-2 border-b border-gold/30">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => onCompleteTodo(todo.id)}
                className="ring-gold/50 focus-visible:ring-gold/50"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`text-white ${todo.completed ? 'line-through text-gray-400' : ''}`}
              >
                {todo.text}
              </label>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteTodo(todo.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListComponent;
