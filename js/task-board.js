/* ===== Task Board Application ===== */

const AVATAR_COLORS = {
  'Alex Chen': '#6366f1',
  'Sarah Kim': '#ec4899',
  'Marcus Lee': '#14b8a6',
  'Priya Patel': '#f59e0b',
  'Jordan Blake': '#8b5cf6'
};

const STATUS_LABELS = {
  backlog: 'Backlog',
  todo: 'To Do',
  inprogress: 'In Progress',
  review: 'Review',
  done: 'Done'
};

const STATUS_ORDER = ['backlog', 'todo', 'inprogress', 'review', 'done'];

// Sample tasks
let tasks = [
  {
    id: 1,
    title: 'Design new landing page hero',
    assignee: 'Sarah Kim',
    priority: 'high',
    project: 'Website Redesign',
    status: 'inprogress',
    due: '2026-09-15',
    progress: 65,
    comments: 4,
    attachments: 2
  },
  {
    id: 2,
    title: 'Implement user authentication API',
    assignee: 'Alex Chen',
    priority: 'high',
    project: 'API Integration',
    status: 'todo',
    due: '2026-09-18',
    progress: 0,
    comments: 2,
    attachments: 1
  },
  {
    id: 3,
    title: 'Write Q3 marketing campaign brief',
    assignee: 'Jordan Blake',
    priority: 'medium',
    project: 'Marketing',
    status: 'review',
    due: '2026-09-12',
    progress: 90,
    comments: 6,
    attachments: 3
  },
  {
    id: 4,
    title: 'Fix mobile navigation overflow',
    assignee: 'Marcus Lee',
    priority: 'high',
    project: 'Mobile App',
    status: 'inprogress',
    due: '2026-09-13',
    progress: 40,
    comments: 1,
    attachments: 0
  },
  {
    id: 5,
    title: 'Update component library docs',
    assignee: 'Priya Patel',
    priority: 'low',
    project: 'Website Redesign',
    status: 'backlog',
    due: '2026-09-25',
    progress: 0,
    comments: 0,
    attachments: 1
  },
  {
    id: 6,
    title: 'Set up CI/CD pipeline for mobile',
    assignee: 'Alex Chen',
    priority: 'medium',
    project: 'Mobile App',
    status: 'todo',
    due: '2026-09-20',
    progress: 10,
    comments: 3,
    attachments: 2
  },
  {
    id: 7,
    title: 'Create social media assets',
    assignee: 'Jordan Blake',
    priority: 'medium',
    project: 'Marketing',
    status: 'done',
    due: '2026-09-10',
    progress: 100,
    comments: 5,
    attachments: 8
  },
  {
    id: 8,
    title: 'Optimize database queries',
    assignee: 'Marcus Lee',
    priority: 'high',
    project: 'API Integration',
    status: 'review',
    due: '2026-09-14',
    progress: 85,
    comments: 2,
    attachments: 0
  },
  {
    id: 9,
    title: 'User interview synthesis report',
    assignee: 'Sarah Kim',
    priority: 'low',
    project: 'Website Redesign',
    status: 'backlog',
    due: '2026-09-30',
    progress: 0,
    comments: 1,
    attachments: 4
  },
  {
    id: 10,
    title: 'Push notification service',
    assignee: 'Priya Patel',
    priority: 'medium',
    project: 'Mobile App',
    status: 'todo',
    due: '2026-09-22',
    progress: 0,
    comments: 0,
    attachments: 0
  },
  {
    id: 11,
    title: 'A/B test homepage CTA',
    assignee: 'Jordan Blake',
    priority: 'low',
    project: 'Marketing',
    status: 'inprogress',
    due: '2026-09-16',
    progress: 30,
    comments: 3,
    attachments: 1
  },
  {
    id: 12,
    title: 'Refactor auth middleware',
    assignee: 'Alex Chen',
    priority: 'medium',
    project: 'API Integration',
    status: 'done',
    due: '2026-09-08',
    progress: 100,
    comments: 4,
    attachments: 0
  }
];

let nextId = 13;
let currentView = 'board';
let draggedTaskId = null;
let calendarDate = new Date(2026, 8, 1); // Sept 2026
let editingTaskId = null;

// ===== DOM References =====
const boardView = document.getElementById('boardView');
const listView = document.getElementById('listView');
const timelineView = document.getElementById('timelineView');
const calendarView = document.getElementById('calendarView');
const filtersPanel = document.getElementById('filtersPanel');
const searchInput = document.getElementById('searchInput');
const filterCount = document.getElementById('filterCount');
const workloadItems = document.getElementById('workloadItems');
const toast = document.getElementById('toast');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initViewSwitcher();
  initFilters();
  initSearch();
  initModal();
  initCalendarNav();
  renderAll();
});

// ===== Theme =====
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ===== View Switcher =====
function initViewSwitcher() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      showView(currentView);
    });
  });
}

function showView(view) {
  boardView.hidden = view !== 'board';
  listView.hidden = view !== 'list';
  timelineView.hidden = view !== 'timeline';
  calendarView.hidden = view !== 'calendar';
  if (view === 'list') renderList();
  if (view === 'timeline') renderTimeline();
  if (view === 'calendar') renderCalendar();
}

// ===== Filters =====
function initFilters() {
  document.getElementById('filterToggle').addEventListener('click', () => {
    filtersPanel.classList.toggle('open');
    document.getElementById('filterToggle').classList.toggle('active');
  });
  document.getElementById('clearFilters').addEventListener('click', clearFilters);
  ['filterAssignee', 'filterPriority', 'filterProject', 'filterStatus', 'filterDue'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      updateFilterCount();
      renderAll();
    });
  });
}

function clearFilters() {
  ['filterAssignee', 'filterPriority', 'filterProject', 'filterStatus', 'filterDue'].forEach(id => {
    document.getElementById(id).value = '';
  });
  updateFilterCount();
  renderAll();
}

function updateFilterCount() {
  let count = 0;
  ['filterAssignee', 'filterPriority', 'filterProject', 'filterStatus', 'filterDue'].forEach(id => {
    if (document.getElementById(id).value) count++;
  });
  if (count > 0) {
    filterCount.hidden = false;
    filterCount.textContent = count;
  } else {
    filterCount.hidden = true;
  }
}

function getFilteredTasks() {
  const q = searchInput.value.toLowerCase().trim();
  const assignee = document.getElementById('filterAssignee').value;
  const priority = document.getElementById('filterPriority').value;
  const project = document.getElementById('filterProject').value;
  const status = document.getElementById('filterStatus').value;
  const due = document.getElementById('filterDue').value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter(t => {
    if (q && !t.title.toLowerCase().includes(q) && !t.assignee.toLowerCase().includes(q) && !t.project.toLowerCase().includes(q)) return false;
    if (assignee && t.assignee !== assignee) return false;
    if (priority && t.priority !== priority) return false;
    if (project && t.project !== project) return false;
    if (status && t.status !== status) return false;
    if (due) {
      const d = new Date(t.due + 'T00:00:00');
      if (due === 'overdue' && d >= today) return false;
      if (due === 'today' && d.getTime() !== today.getTime()) return false;
      if (due === 'week') {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        if (d < today || d > weekEnd) return false;
      }
      if (due === 'month') {
        if (d.getMonth() !== today.getMonth() || d.getFullYear() !== today.getFullYear()) return false;
      }
    }
    return true;
  });
}

// ===== Search =====
function initSearch() {
  searchInput.addEventListener('input', () => renderAll());
}

// ===== Render All =====
function renderAll() {
  renderBoard();
  renderWorkload();
  if (currentView === 'list') renderList();
  if (currentView === 'timeline') renderTimeline();
  if (currentView === 'calendar') renderCalendar();
}

// ===== Board Render =====
function renderBoard() {
  const filtered = getFilteredTasks();
  STATUS_ORDER.forEach(status => {
    const col = document.getElementById('col-' + status);
    col.innerHTML = '';
    const colTasks = filtered.filter(t => t.status === status);
    colTasks.forEach(t => col.appendChild(createCard(t)));
    document.querySelector(`[data-count="${status}"]`).textContent = colTasks.length;
  });
  setupDragAndDrop();
}

function createCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.id = task.id;

  const initials = task.assignee.split(' ').map(n => n[0]).join('');
  const color = AVATAR_COLORS[task.assignee] || '#64748b';
  const dueDate = formatDate(task.due);
  const isOverdue = new Date(task.due + 'T00:00:00') < new Date(new Date().toDateString()) && task.status !== 'done';

  card.innerHTML = `
    <span class="card-priority ${task.priority}">${task.priority}</span>
    <div class="card-project">${task.project}</div>
    <div class="card-title">${escapeHtml(task.title)}</div>
    <div class="card-meta">
      <div class="card-meta-item" title="Due date" style="${isOverdue ? 'color:#ef4444' : ''}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${dueDate}${isOverdue ? ' (overdue)' : ''}
      </div>
    </div>
    <div class="card-progress">
      <div class="progress-track"><div class="progress-fill" style="width:${task.progress}%"></div></div>
      <div class="progress-label">${task.progress}%</div>
    </div>
    <div class="card-footer">
      <div class="card-assignee">
        <div class="avatar" style="background:${color}">${initials}</div>
        <span class="assignee-name">${task.assignee.split(' ')[0]}</span>
      </div>
      <div class="card-stats">
        ${task.comments ? `<span class="card-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${task.comments}</span>` : ''}
        ${task.attachments ? `<span class="card-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>${task.attachments}</span>` : ''}
      </div>
    </div>
  `;

  card.addEventListener('click', () => openEditModal(task.id));
  return card;
}

// ===== Drag & Drop =====
function setupDragAndDrop() {
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      draggedTaskId = parseInt(card.dataset.id);
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggedTaskId);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
      draggedTaskId = null;
    });
  });

  document.querySelectorAll('.kanban-column').forEach(col => {
    const cardsArea = col.querySelector('.column-cards');
    col.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', e => {
      if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
    });
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const status = col.dataset.status;
      const id = draggedTaskId || parseInt(e.dataTransfer.getData('text/plain'));
      if (!id) return;
      const task = tasks.find(t => t.id === id);
      if (task && task.status !== status) {
        task.status = status;
        if (status === 'done') task.progress = 100;
        showToast(`Moved to ${STATUS_LABELS[status]}`);
        renderAll();
      }
    });
  });
}

// ===== Workload =====
function renderWorkload() {
  const filtered = getFilteredTasks();
  const counts = {};
  Object.keys(AVATAR_COLORS).forEach(name => counts[name] = 0);
  filtered.forEach(t => {
    if (counts[t.assignee] !== undefined) counts[t.assignee]++;
  });
  const max = Math.max(...Object.values(counts), 1);
  workloadItems.innerHTML = '';
  Object.entries(counts).forEach(([name, count]) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    const color = AVATAR_COLORS[name];
    const pct = (count / max) * 100;
    const item = document.createElement('div');
    item.className = 'workload-item';
    item.innerHTML = `
      <div class="workload-avatar" style="background:${color}">${initials}</div>
      <div class="workload-info">
        <div class="workload-name">${name.split(' ')[0]}</div>
        <div class="workload-bar-track"><div class="workload-bar-fill" style="width:${pct}%;background:${color}"></div></div>
      </div>
      <span class="workload-count">${count}</span>
    `;
    workloadItems.appendChild(item);
  });
}

// ===== List View =====
function renderList() {
  const filtered = getFilteredTasks();
  const tbody = document.getElementById('listBody');
  tbody.innerHTML = '';
  filtered.forEach(t => {
    const initials = t.assignee.split(' ').map(n => n[0]).join('');
    const color = AVATAR_COLORS[t.assignee] || '#64748b';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(t.title)}</strong></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="avatar" style="background:${color};width:22px;height:22px;font-size:9px">${initials}</div>
          ${t.assignee}
        </div>
      </td>
      <td><span class="card-priority ${t.priority}">${t.priority}</span></td>
      <td>${t.project}</td>
      <td><span class="status-badge ${t.status}">${STATUS_LABELS[t.status]}</span></td>
      <td>${formatDate(t.due)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;min-width:100px">
          <div class="progress-track" style="flex:1"><div class="progress-fill" style="width:${t.progress}%"></div></div>
          <span style="font-size:12px;color:var(--text-muted)">${t.progress}%</span>
        </div>
      </td>
    `;
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => openEditModal(t.id));
    tbody.appendChild(tr);
  });
}

// ===== Timeline View =====
function renderTimeline() {
  const filtered = getFilteredTasks().slice().sort((a, b) => a.due.localeCompare(b.due));
  const container = document.getElementById('timelineContainer');
  container.innerHTML = '';
  if (!filtered.length) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px">No tasks match filters</p>';
    return;
  }
  const dates = filtered.map(t => new Date(t.due + 'T00:00:00').getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const range = maxDate - minDate || 1;
  const colors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  filtered.forEach(t => {
    const d = new Date(t.due + 'T00:00:00').getTime();
    const left = ((d - minDate) / range) * 70 + 5;
    const width = Math.max(12, 18);
    const row = document.createElement('div');
    row.className = 'timeline-row';
    row.innerHTML = `
      <div class="timeline-label" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>
      <div class="timeline-bar-wrap">
        <div class="timeline-bar" style="left:${left}%;width:${width}%;background:${colors[t.priority]}" title="${t.due}">
          ${formatDate(t.due)}
        </div>
      </div>
    `;
    container.appendChild(row);
  });
}

// ===== Calendar View =====
function initCalendarNav() {
  document.getElementById('prevMonth').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const filtered = getFilteredTasks();
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day-name';
    el.textContent = d;
    grid.appendChild(el);
  });

  const today = new Date();
  // Prev month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrev - i;
    const el = createCalDay(day, true, false, []);
    grid.appendChild(el);
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTasks = filtered.filter(t => t.due === dateStr);
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    grid.appendChild(createCalDay(d, false, isToday, dayTasks));
  }
  // Next month fill
  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    grid.appendChild(createCalDay(i, true, false, []));
  }
}

function createCalDay(num, other, isToday, dayTasks) {
  const el = document.createElement('div');
  el.className = 'cal-day' + (other ? ' other-month' : '') + (isToday ? ' today' : '');
  let html = `<div class="cal-day-num">${num}</div>`;
  dayTasks.slice(0, 3).forEach(t => {
    html += `<div class="cal-task ${t.priority}" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>`;
  });
  if (dayTasks.length > 3) {
    html += `<div style="font-size:10px;color:var(--text-muted);padding:0 4px">+${dayTasks.length - 3} more</div>`;
  }
  el.innerHTML = html;
  return el;
}

// ===== Modal =====
function initModal() {
  document.getElementById('addTaskBtn').addEventListener('click', () => openAddModal());
  document.querySelectorAll('.column-add').forEach(btn => {
    btn.addEventListener('click', () => openAddModal(btn.dataset.status));
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  taskModal.addEventListener('click', e => {
    if (e.target === taskModal) closeModal();
  });
  document.getElementById('taskProgress').addEventListener('input', e => {
    document.getElementById('progressValue').textContent = e.target.value + '%';
  });
  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    saveTask();
  });
}

function openAddModal(status = 'todo') {
  editingTaskId = null;
  document.getElementById('modalTitle').textContent = 'Add Task';
  taskForm.reset();
  document.getElementById('taskStatus').value = status;
  document.getElementById('taskProgress').value = 0;
  document.getElementById('progressValue').textContent = '0%';
  document.getElementById('taskDue').value = getDefaultDue();
  taskModal.hidden = false;
}

function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingTaskId = id;
  document.getElementById('modalTitle').textContent = 'Edit Task';
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskAssignee').value = task.assignee;
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskProject').value = task.project;
  document.getElementById('taskDue').value = task.due;
  document.getElementById('taskProgress').value = task.progress;
  document.getElementById('progressValue').textContent = task.progress + '%';
  document.getElementById('taskStatus').value = task.status;
  taskModal.hidden = false;
}

function closeModal() {
  taskModal.hidden = true;
  editingTaskId = null;
}

function saveTask() {
  const data = {
    title: document.getElementById('taskTitle').value.trim(),
    assignee: document.getElementById('taskAssignee').value,
    priority: document.getElementById('taskPriority').value,
    project: document.getElementById('taskProject').value,
    due: document.getElementById('taskDue').value,
    progress: parseInt(document.getElementById('taskProgress').value),
    status: document.getElementById('taskStatus').value,
    comments: 0,
    attachments: 0
  };
  if (!data.title) return;

  if (editingTaskId) {
    const task = tasks.find(t => t.id === editingTaskId);
    Object.assign(task, data);
    showToast('Task updated');
  } else {
    data.id = nextId++;
    tasks.push(data);
    showToast('Task created');
  }
  closeModal();
  renderAll();
}

function getDefaultDue() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

// ===== Helpers =====
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 2200);
}