import './index.css'

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    todoList.innerHTML = filteredTodos.map((todo, index) => `
        <li class="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-md" data-index="${index}">
            <div class="flex items-center">
                <input 
                    type="checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    class="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                >
                <span class="ml-2 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}">${todo.text}</span>
            </div>
            <button class="delete-todo text-red-500 hover:text-red-700 focus:outline-none">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </li>
    `).join('');
}

function addTodo(e) {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText) {
        todos.push({ text: todoText, completed: false });
        todoInput.value = '';
        saveTodos();
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

function setFilter(filter) {
    currentFilter = filter;
    [filterAll, filterActive, filterCompleted].forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    document.getElementById(`filter-${filter}`).classList.remove('bg-gray-200', 'text-gray-700');
    document.getElementById(`filter-${filter}`).classList.add('bg-blue-600', 'text-white');
    renderTodos();
}

todoForm.addEventListener('submit', addTodo);

todoList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    
    const index = parseInt(li.dataset.index);
    
    if (e.target.type === 'checkbox') {
        toggleTodo(index);
    } else if (e.target.closest('.delete-todo')) {
        deleteTodo(index);
    }
});

filterAll.addEventListener('click', () => setFilter('all'));
filterActive.addEventListener('click', () => setFilter('active'));
filterCompleted.addEventListener('click', () => setFilter('completed'));
renderTodos();
