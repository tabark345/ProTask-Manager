import './style.css'

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');
const todoStats = document.getElementById('todo-stats');
const langToggle = document.getElementById('lang-toggle');
const appTitle = document.getElementById('app-title');
const addButton = document.getElementById('add-button');
const statusProgress = document.getElementById('status-progress');
const celebration = document.getElementById('celebration');
const celebrationText = document.getElementById('celebration-text');
const celebrationSubtext = document.getElementById('celebration-subtext');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let currentLang = 'en';

const translations = {
    en: {
        title: 'ProTask Manager',
        addPlaceholder: 'Add a new task...',
        addButton: 'Add',
        all: 'All',
        active: 'Active',
        completed: 'Completed',
        stats: 'Total: {0} | Active: {1} | Completed: {2}',
        langButton: 'عربي',
        celebrationTitle: 'Congratulations!',
        celebrationSubtext: 'You\'ve completed all tasks!'
    },
    ar: {
        title: 'مدير المهام الاحترافي',
        addPlaceholder: 'أضف مهمة جديدة...',
        addButton: 'إضافة',
        all: 'الكل',
        active: 'النشطة',
        completed: 'المكتملة',
        stats: 'الإجمالي: {0} | النشطة: {1} | المكتملة: {2}',
        langButton: 'English',
        celebrationTitle: 'تهانينا!',
        celebrationSubtext: 'لقد أكملت جميع المهام!'
    }
};

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    todoList.innerHTML = filteredTodos.map((todo) => `
        <li class="todo-item ${todo.completed ? 'todo-completed' : ''}" data-index="${todos.indexOf(todo)}">
            <div class="flex items-center">
                <input 
                    type="checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    class="checkbox"
                >
                <span class="todo-text">${todo.text}</span>
            </div>
            <button class="delete-btn">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </li>
    `).join('');

    updateStats();
    updateStatusBar();
    checkAllCompleted();
}

function addTodo(e) {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText) {
        todos.push({ text: todoText, completed: false, createdAt: new Date().toISOString() });
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
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    document.getElementById(`filter-${filter}`).classList.remove('bg-gray-200', 'text-gray-700');
    document.getElementById(`filter-${filter}`).classList.add('bg-indigo-600', 'text-white');
    renderTodos();
}

function updateStats() {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const activeTodos = totalTodos - completedTodos;

    todoStats.textContent = translations[currentLang].stats
        .replace('{0}', totalTodos)
        .replace('{1}', activeTodos)
        .replace('{2}', completedTodos);
}

function updateStatusBar() {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const completionPercentage = totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100;
    statusProgress.style.width = `${completionPercentage}%`;
}

function checkAllCompleted() {
    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
    if (allCompleted) {
        celebration.classList.remove('hidden');
        setTimeout(() => {
            celebration.classList.add('hidden');
        }, 3000);
    } else {
        celebration.classList.add('hidden');
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    updateTranslations();
}

function updateTranslations() {
    appTitle.textContent = translations[currentLang].title;
    todoInput.placeholder = translations[currentLang].addPlaceholder;
    addButton.textContent = translations[currentLang].addButton;
    filterAll.textContent = translations[currentLang].all;
    filterActive.textContent = translations[currentLang].active;
    filterCompleted.textContent = translations[currentLang].completed;
    langToggle.textContent = translations[currentLang].langButton;
    celebrationText.textContent = translations[currentLang].celebrationTitle;
    celebrationSubtext.textContent = translations[currentLang].celebrationSubtext;
    updateStats();
}

todoForm.addEventListener('submit', addTodo);

todoList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    
    const index = parseInt(li.dataset.index);
    
    if (e.target.type === 'checkbox') {
        toggleTodo(index);
    } else if (e.target.closest('.delete-btn')) {
        deleteTodo(index);
    }
});

filterAll.addEventListener('click', () => setFilter('all'));
filterActive.addEventListener('click', () => setFilter('active'));
filterCompleted.addEventListener('click', () => setFilter('completed'));
langToggle.addEventListener('click', toggleLanguage);

updateTranslations();
renderTodos();