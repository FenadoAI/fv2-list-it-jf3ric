import requests
import json

# Test the todo API endpoints
API_BASE = "https://8001-ie21qikicdpnfwnmbsz2u.e2b.app/api"

def test_create_todo():
    print("Testing create todo...")
    todo_data = {
        "title": "Test Todo",
        "description": "This is a test todo item"
    }
    response = requests.post(f"{API_BASE}/todos", json=todo_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json().get("id")

def test_get_todos():
    print("\nTesting get all todos...")
    response = requests.get(f"{API_BASE}/todos")
    print(f"Status: {response.status_code}")
    todos = response.json()
    print(f"Number of todos: {len(todos)}")
    for todo in todos:
        print(f"- {todo['title']} (ID: {todo['id']}, Completed: {todo['completed']})")
    return todos

def test_update_todo(todo_id):
    print(f"\nTesting update todo {todo_id}...")
    update_data = {
        "completed": True
    }
    response = requests.put(f"{API_BASE}/todos/{todo_id}", json=update_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_delete_todo(todo_id):
    print(f"\nTesting delete todo {todo_id}...")
    response = requests.delete(f"{API_BASE}/todos/{todo_id}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    print("Testing Todo API...")
    
    # Test creating a todo
    todo_id = test_create_todo()
    
    # Test getting all todos
    todos = test_get_todos()
    
    # Test updating a todo
    if todo_id:
        test_update_todo(todo_id)
        
        # Get todos again to see the update
        test_get_todos()
        
        # Test deleting the todo
        test_delete_todo(todo_id)
        
        # Get todos again to confirm deletion
        test_get_todos()
    
    print("\nTodo API testing completed!")