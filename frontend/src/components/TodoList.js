import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API = `${API_BASE}/api`;

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    try {
      await axios.post(`${API}/todos`, newTodo);
      setNewTodo({ title: '', description: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const updateTodo = async (todoId, updates) => {
    try {
      await axios.put(`${API}/todos/${todoId}`, updates);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API}/todos/${todoId}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = (todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const startEdit = (todo) => {
    setEditingTodo(todo.id);
    setEditForm({ title: todo.title, description: todo.description });
  };

  const saveEdit = () => {
    updateTodo(editingTodo, editForm);
    setEditingTodo(null);
    setEditForm({ title: '', description: '' });
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditForm({ title: '', description: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Todo List</h1>
      
      {/* Add new todo form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Todo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Todo title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)..."
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            />
            <Button onClick={createTodo} className="w-full">
              Add Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Todo items */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <Card key={todo.id} className={`transition-all ${todo.completed ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              {editingTodo === todo.id ? (
                <div className="space-y-4">
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm">Save</Button>
                    <Button onClick={cancelEdit} variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleComplete(todo)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`text-gray-600 mt-1 ${todo.completed ? 'line-through' : ''}`}>
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={todo.completed ? 'secondary' : 'default'}>
                        {todo.completed ? 'Completed' : 'Pending'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Created: {new Date(todo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(todo)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteTodo(todo.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {todos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No todos yet. Add one above to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TodoList;