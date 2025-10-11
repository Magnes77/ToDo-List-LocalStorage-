// Selectors
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const countEl = document.getElementById('count');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');

const STORAGE_KEY = 'wiktor_todo_v1';

let todos = loadTodos();
render();

// Add task
addBtn.addEventListener('click', () => addTodoFromInput());
input.addEventListener('keydown', (e) => { if(e.key==='Enter') addTodoFromInput() });

// Clear completed
clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  saveTodos(); render();
});

// Clear all
clearAllBtn.addEventListener('click', () => {
  if(confirm('Delete all tasks?')) { todos=[]; saveTodos(); render(); }
});

function addTodoFromInput(){
  const text = input.value.trim();
  if(!text) { input.focus(); return; }
  const newTodo = { id: cryptoRandomId(), text, completed:false, createdAt:new Date().toISOString() };
  todos.unshift(newTodo);
  input.value=''; saveTodos(); render();
}

function render(){
  todoList.innerHTML='';
  if(todos.length===0){
    todoList.innerHTML='<li style="color:var(--muted);padding:10px;border-radius:8px;">No tasks — add a new task</li>';
  } else {
    todos.forEach(todo => {
      const li=document.createElement('li'); li.className='todo-item'; li.dataset.id=todo.id;
      const left=document.createElement('div'); left.className='left';
      const check=document.createElement('div'); check.className='check'+(todo.completed?' checked':'');
      check.setAttribute('role','checkbox'); check.setAttribute('aria-checked',String(!!todo.completed));
      check.title = todo.completed?'Mark as incomplete':'Mark as complete';
      check.innerHTML = todo.completed?'&#10003;':'';
      check.addEventListener('click',()=>toggleCompleted(todo.id));
      const textDiv=document.createElement('div'); textDiv.className='text'+(todo.completed?' completed':''); textDiv.textContent=todo.text;
      textDiv.addEventListener('dblclick',()=>startEdit(todo.id,textDiv));
      left.appendChild(check); left.appendChild(textDiv);

      const actions=document.createElement('div'); actions.className='item-actions';
      const date=document.createElement('div'); date.style.fontSize='12px'; date.style.color='var(--muted)';
      date.textContent=formatDate(todo.createdAt);
      const delBtn=document.createElement('button'); delBtn.className='ghost'; delBtn.textContent='Delete';
      delBtn.addEventListener('click',()=>deleteTodo(todo.id));
      actions.appendChild(date); actions.appendChild(delBtn);

      li.appendChild(left); li.appendChild(actions);
      todoList.appendChild(li);
    });
  }
  const total = todos.length;
  const completedCount = todos.filter(t=>t.completed).length;
  countEl.textContent = `${total} task(s), ${completedCount} completed`;
  input.focus();
}

function toggleCompleted(id){
  const idx=todos.findIndex(t=>t.id===id);
  if(idx!==-1){ todos[idx].completed=!todos[idx].completed; saveTodos(); render(); }
}

function deleteTodo(id){ todos = todos.filter(t=>t.id!==id); saveTodos(); render(); }

function startEdit(id,textNode){
  const todo=todos.find(t=>t.id===id); if(!todo) return;
  const inputEdit=document.createElement('input'); inputEdit.type='text'; inputEdit.value=todo.text;
  inputEdit.style.width='100%'; inputEdit.style.padding='6px 8px'; inputEdit.style.borderRadius='8px'; inputEdit.style.border='1px solid #e6ebf8';
  const parent=textNode.parentElement; parent.replaceChild(inputEdit,textNode); inputEdit.focus(); inputEdit.select();
  const saveEdit = ()=>{ const newVal=inputEdit.value.trim(); if(newVal){ todo.text=newVal; saveTodos(); } render(); };
  inputEdit.addEventListener('keydown',(e)=>{ if(e.key==='Enter') saveEdit(); if(e.key==='Escape') render(); });
  inputEdit.addEventListener('blur', saveEdit);
}

function saveTodos(){ try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(todos)); } catch(e){ console.error('localStorage save error',e);} }
function loadTodos(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return []; const parsed=JSON.parse(raw); if(!Array.isArray(parsed)) return []; return parsed; } catch(e){ console.error('localStorage load error',e); return []; } }

function formatDate(iso){ try{ const d=new Date(iso); if(isNaN(d)) return ''; const now=new Date(); const diff=(now-d)/1000; if(diff<60) return 'now'; if(diff<3600) return `${Math.floor(diff/60)} min ago`; if(diff<86400) r
