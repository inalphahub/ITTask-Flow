/* ============================================================
   TASKFLOW TASK MODULE
   task.js
============================================================ */


/* ============================================================
   STORAGE
============================================================ */

const TASK_STORAGE_KEY = (() => {

    try {

        const currentUser = JSON.parse(
            sessionStorage.getItem("taskflowCurrentUser") || "null"
        );

        return "taskflow_tasks_v1";

    } catch (error) {

        return "taskflow_tasks_v1";

    }

})();


/* ============================================================
   SAMPLE TASK DATA
============================================================ */

const defaultTasks = [

    {
        id: 1,
        title: "Design Login Page",
        description: "Create the responsive login interface for the TaskFlow application.",
        project: "TaskFlow Dashboard",
        assignee: "John Doe",
        priority: "high",
        status: "completed",
        dueDate: "2026-08-20",
        hours: 6,
        createdAt: "2026-08-01"
    },

    {
        id: 2,
        title: "Build Dashboard",
        description: "Develop the employee task management dashboard with responsive layouts.",
        project: "TaskFlow Dashboard",
        assignee: "Sarah Wilson",
        priority: "medium",
        status: "in-progress",
        dueDate: "2026-08-28",
        hours: 12,
        createdAt: "2026-08-05"
    },

    {
        id: 3,
        title: "API Testing",
        description: "Perform functional testing for all task management APIs.",
        project: "QA Automation",
        assignee: "Mike Johnson",
        priority: "high",
        status: "review",
        dueDate: "2026-08-25",
        hours: 8,
        createdAt: "2026-08-07"
    },

    {
        id: 4,
        title: "Employee Profile",
        description: "Create employee profile screens and profile editing functionality.",
        project: "Employee Portal",
        assignee: "Alex Brown",
        priority: "low",
        status: "completed",
        dueDate: "2026-08-18",
        hours: 5,
        createdAt: "2026-08-02"
    },

    {
        id: 5,
        title: "Responsive Navigation",
        description: "Make the main application navigation responsive across devices.",
        project: "Website Redesign",
        assignee: "Emily Davis",
        priority: "medium",
        status: "in-progress",
        dueDate: "2026-08-27",
        hours: 7,
        createdAt: "2026-08-10"
    },

    {
        id: 6,
        title: "Task Filter Module",
        description: "Implement task search and filtering functionality.",
        project: "TaskFlow Dashboard",
        assignee: "Robert Smith",
        priority: "high",
        status: "todo",
        dueDate: "2026-08-30",
        hours: 6,
        createdAt: "2026-08-11"
    },

    {
        id: 7,
        title: "Calendar Integration",
        description: "Prepare calendar view for task deadlines and project schedules.",
        project: "Employee Portal",
        assignee: "John Doe",
        priority: "medium",
        status: "todo",
        dueDate: "2026-09-02",
        hours: 10,
        createdAt: "2026-08-12"
    },

    {
        id: 8,
        title: "Reports Dashboard",
        description: "Create management reports for employee task completion.",
        project: "TaskFlow Dashboard",
        assignee: "Sarah Wilson",
        priority: "high",
        status: "in-progress",
        dueDate: "2026-08-29",
        hours: 15,
        createdAt: "2026-08-13"
    },

    {
        id: 9,
        title: "Notification System",
        description: "Build task assignment and deadline notification UI.",
        project: "Mobile Application",
        assignee: "Mike Johnson",
        priority: "medium",
        status: "todo",
        dueDate: "2026-09-04",
        hours: 8,
        createdAt: "2026-08-14"
    },

    {
        id: 10,
        title: "Employee Search",
        description: "Implement employee search and filtering functionality.",
        project: "Employee Portal",
        assignee: "Alex Brown",
        priority: "low",
        status: "completed",
        dueDate: "2026-08-16",
        hours: 4,
        createdAt: "2026-08-04"
    },

    {
        id: 11,
        title: "QA Regression Testing",
        description: "Execute regression test cases for the latest application build.",
        project: "QA Automation",
        assignee: "Emily Davis",
        priority: "high",
        status: "review",
        dueDate: "2026-08-26",
        hours: 9,
        createdAt: "2026-08-15"
    },

    {
        id: 12,
        title: "Project Overview",
        description: "Create project overview screen with project progress metrics.",
        project: "Website Redesign",
        assignee: "Robert Smith",
        priority: "low",
        status: "todo",
        dueDate: "2026-09-06",
        hours: 6,
        createdAt: "2026-08-16"
    }

];


/* ============================================================
   APPLICATION STATE
============================================================ */

let tasks = [];

let currentPage = 1;

const tasksPerPage = 8;

let editingTaskId = null;

let deletingTaskId = null;

let selectedDetailsTaskId = null;


/* ============================================================
   DOM REFERENCES
============================================================ */

const elements = {

    sidebar: document.getElementById("sidebar"),

    sidebarClose: document.getElementById("sidebarClose"),

    mobileMenuButton: document.getElementById("mobileMenuButton"),

    overlay: document.getElementById("overlay"),

    taskSearch: document.getElementById("taskSearch"),

    statusFilter: document.getElementById("statusFilter"),

    priorityFilter: document.getElementById("priorityFilter"),

    assigneeFilter: document.getElementById("assigneeFilter"),

    sortTasks: document.getElementById("sortTasks"),

    taskTableBody: document.getElementById("taskTableBody"),

    emptyState: document.getElementById("emptyState"),

    activeFilters: document.getElementById("activeFilters"),

    pagination: document.getElementById("pagination"),

    resultsInfo: document.getElementById("resultsInfo"),

    totalTasks: document.getElementById("totalTasks"),

    inProgressTasks: document.getElementById("inProgressTasks"),

    completedTasks: document.getElementById("completedTasks"),

    overdueTasks: document.getElementById("overdueTasks"),

    sidebarTaskCount: document.getElementById("sidebarTaskCount"),

    createTaskButton: document.getElementById("createTaskButton"),

    emptyCreateTask: document.getElementById("emptyCreateTask"),

    taskModal: document.getElementById("taskModal"),

    closeTaskModal: document.getElementById("closeTaskModal"),

    cancelTaskButton: document.getElementById("cancelTaskButton"),

    taskForm: document.getElementById("taskForm"),

    taskModalTitle: document.getElementById("taskModalTitle"),

    taskModalDescription: document.getElementById("taskModalDescription"),

    saveTaskButton: document.getElementById("saveTaskButton"),

    taskId: document.getElementById("taskId"),

    taskTitle: document.getElementById("taskTitle"),

    taskDescription: document.getElementById("taskDescription"),

    taskProject: document.getElementById("taskProject"),

    taskAssignee: document.getElementById("taskAssignee"),

    taskPriority: document.getElementById("taskPriority"),

    taskStatus: document.getElementById("taskStatus"),

    taskDueDate: document.getElementById("taskDueDate"),

    taskHours: document.getElementById("taskHours"),

    detailsModal: document.getElementById("detailsModal"),

    closeDetailsModal: document.getElementById("closeDetailsModal"),

    detailsTaskTitle: document.getElementById("detailsTaskTitle"),

    detailsTaskDescription: document.getElementById("detailsTaskDescription"),

    detailsPriority: document.getElementById("detailsPriority"),

    detailsProject: document.getElementById("detailsProject"),

    detailsAssignee: document.getElementById("detailsAssignee"),

    detailsDueDate: document.getElementById("detailsDueDate"),

    detailsStatus: document.getElementById("detailsStatus"),

    detailsHours: document.getElementById("detailsHours"),

    detailsCreated: document.getElementById("detailsCreated"),

    detailsStatusSelect: document.getElementById("detailsStatusSelect"),

    updateDetailsStatus: document.getElementById("updateDetailsStatus"),

    deleteModal: document.getElementById("deleteModal"),

    deleteTaskName: document.getElementById("deleteTaskName"),

    cancelDelete: document.getElementById("cancelDelete"),

    confirmDelete: document.getElementById("confirmDelete"),

    profileButton: document.getElementById("profileButton"),

    profileDropdown: document.getElementById("profileDropdown"),

    notificationButton: document.getElementById("notificationButton"),

    headerSearchButton: document.getElementById("headerSearchButton"),

    helpButton: document.getElementById("helpButton"),

    logoutButton: document.getElementById("logoutButton"),

    toastContainer: document.getElementById("toastContainer")

};


/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initializeCurrentUserProfile();

    initializeTasks();

    populateAssigneeFilter();

    populateAssigneeOptions();

    bindEvents();

    render();

    setMinimumDate();

});

function initializeCurrentUserProfile() {
    let user = null;
    try {
        user = JSON.parse(sessionStorage.getItem("taskflowCurrentUser") || "null");
        if (user?.email) {
            const accounts = JSON.parse(localStorage.getItem("taskflowAccounts") || "[]");
            const account = accounts.find(item => String(item.email || "").toLowerCase() === String(user.email).toLowerCase());
            user = { ...account, ...user };
        }
    } catch (error) {
        user = null;
    }

    if (!user?.email) return;
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email.split("@")[0];
    const initials = getInitials(name);
    const role = user.role || user.designation || "Employee";
    document.querySelector("#taskProfileName").textContent = name;
    document.querySelector("#taskProfileRole").textContent = role;
    document.querySelector("#taskProfileAvatar").textContent = initials;
    document.querySelector("#dropdownProfileName").textContent = name;
    document.querySelector("#dropdownProfileEmail").textContent = user.email;
    document.querySelector("#dropdownProfileAvatar").textContent = initials;
}

window.addEventListener("storage", event => {
    if (event.key !== TASK_STORAGE_KEY) return;

    try {
        tasks = JSON.parse(event.newValue || "[]");
    } catch (error) {
        tasks = [];
    }

    populateAssigneeFilter();
    render();
});


/* ============================================================
   INITIALIZE TASK DATA
============================================================ */

function initializeTasks() {

    const storedTasks = localStorage.getItem(TASK_STORAGE_KEY);

    if (storedTasks) {

        try {

            const parsedTasks = JSON.parse(storedTasks);

            if (Array.isArray(parsedTasks)) {

                tasks = parsedTasks.filter(task =>
                    !(Number.isInteger(task.id) && task.id >= 1 && task.id <= 12)
                );

                saveTasks();

                return;

            }

        } catch (error) {

            console.warn("Unable to read saved task data.");

        }

    }

    tasks = [];

}


/* ============================================================
   SAVE TASKS
============================================================ */

function saveTasks() {

    localStorage.setItem(
        TASK_STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


/* ============================================================
   EVENT BINDING
============================================================ */

function bindEvents() {

    /* Create */

    elements.createTaskButton.addEventListener(
        "click",
        () => openCreateTaskModal()
    );

    elements.emptyCreateTask.addEventListener(
        "click",
        () => openCreateTaskModal()
    );


    /* Search */

    elements.taskSearch.addEventListener(
        "input",
        () => {

            currentPage = 1;

            render();

        }
    );


    /* Filters */

    elements.statusFilter.addEventListener(
        "change",
        () => {

            currentPage = 1;

            render();

        }
    );

    elements.priorityFilter.addEventListener(
        "change",
        () => {

            currentPage = 1;

            render();

        }
    );

    elements.assigneeFilter.addEventListener(
        "change",
        () => {

            currentPage = 1;

            render();

        }
    );


    /* Sort */

    elements.sortTasks.addEventListener(
        "change",
        () => {

            currentPage = 1;

            render();

        }
    );


    /* Form */

    elements.taskForm.addEventListener(
        "submit",
        handleTaskSubmit
    );

    elements.closeTaskModal.addEventListener(
        "click",
        closeAllModals
    );

    elements.cancelTaskButton.addEventListener(
        "click",
        closeAllModals
    );


    /* Details */

    elements.closeDetailsModal.addEventListener(
        "click",
        closeAllModals
    );

    elements.updateDetailsStatus.addEventListener(
        "click",
        updateDetailsTaskStatus
    );


    /* Delete */

    elements.cancelDelete.addEventListener(
        "click",
        closeAllModals
    );

    elements.confirmDelete.addEventListener(
        "click",
        confirmTaskDelete
    );


    /* Mobile navigation */

    elements.mobileMenuButton.addEventListener(
        "click",
        openSidebar
    );

    elements.sidebarClose.addEventListener(
        "click",
        closeSidebar
    );


    /* Profile */

    elements.profileButton.addEventListener(
        "click",
        toggleProfileDropdown
    );


    /* Header search */

    elements.headerSearchButton.addEventListener(
        "click",
        focusTaskSearch
    );


    /* Notifications */

    elements.notificationButton.addEventListener(
        "click",
        () => {

            showToast(
                "info",
                "Notifications",
                "You have 3 new task notifications."
            );

        }
    );


    /* Help */

    elements.helpButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showToast(
                "info",
                "Help Center",
                "Help Center will be available soon."
            );

        }
    );


    /* Logout */

    elements.logoutButton.addEventListener(
        "click",
        handleLogout
    );


    document.addEventListener(
        "click",
        handleDocumentClick
    );


    document.addEventListener(
        "keydown",
        handleKeyboard
    );


    window.addEventListener(
        "scroll",
        handleScroll
    );

}


/* ============================================================
   RENDER APPLICATION
============================================================ */

function render() {

    updateStatistics();

    renderTasks();

    renderPagination();

    renderActiveFilters();

}


/* ============================================================
   FILTER TASKS
============================================================ */

function getFilteredTasks() {

    const searchValue =
        elements.taskSearch.value
            .trim()
            .toLowerCase();

    const status =
        elements.statusFilter.value;

    const priority =
        elements.priorityFilter.value;

    const assignee =
        elements.assigneeFilter.value;


    let filtered = tasks.filter(task => {

        const matchesSearch =
            !searchValue ||
            task.title.toLowerCase().includes(searchValue) ||
            task.description.toLowerCase().includes(searchValue) ||
            task.project.toLowerCase().includes(searchValue) ||
            task.assignee.toLowerCase().includes(searchValue);

        const matchesStatus =
            status === "all" ||
            task.status === status;

        const matchesPriority =
            priority === "all" ||
            task.priority === priority;

        const matchesAssignee =
            assignee === "all" ||
            task.assignee === assignee;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesAssignee
        );

    });


    /* Sorting */

    const sortValue =
        elements.sortTasks.value;

    filtered.sort((a, b) => {

        switch (sortValue) {

            case "oldest":

                return new Date(a.createdAt) -
                       new Date(b.createdAt);


            case "priority": {

                const order = {
                    high: 1,
                    medium: 2,
                    low: 3
                };

                return order[a.priority] -
                       order[b.priority];

            }


            case "due-date":

                return new Date(a.dueDate) -
                       new Date(b.dueDate);


            case "alphabetical":

                return a.title.localeCompare(b.title);


            case "newest":

            default:

                return new Date(b.createdAt) -
                       new Date(a.createdAt);

        }

    });


    return filtered;

}


/* ============================================================
   RENDER TASK TABLE
============================================================ */

function renderTasks() {

    const filteredTasks =
        getFilteredTasks();

    const total =
        filteredTasks.length;

    const startIndex =
        (currentPage - 1) * tasksPerPage;

    const endIndex =
        startIndex + tasksPerPage;

    const pageTasks =
        filteredTasks.slice(
            startIndex,
            endIndex
        );


    elements.taskTableBody.innerHTML = "";


    if (pageTasks.length === 0) {

        elements.emptyState.classList.add(
            "visible"
        );

    } else {

        elements.emptyState.classList.remove(
            "visible"
        );

        pageTasks.forEach(task => {

            elements.taskTableBody.appendChild(
                createTaskRow(task)
            );

        });

    }


    if (total === 0) {

        elements.resultsInfo.textContent =
            "Showing 0 tasks";

    } else {

        elements.resultsInfo.textContent =
            `Showing ${startIndex + 1}-${Math.min(endIndex, total)} of ${total} tasks`;

    }

}


/* ============================================================
   CREATE TASK TABLE ROW
============================================================ */

function createTaskRow(task) {

    const row =
        document.createElement("tr");


    const isCompleted =
        task.status === "completed";


    const initials =
        getInitials(task.assignee);


    const dueDateOverdue =
        isTaskOverdue(task);


    row.innerHTML = `

        <td>

            <div class="task-cell">

                <button
                    class="task-checkbox ${isCompleted ? "completed" : ""}"
                    data-action="toggle"
                    data-id="${task.id}"
                    aria-label="Toggle task completion"
                    title="Mark task completed"
                ></button>

                <div
                    class="task-name ${isCompleted ? "completed-task" : ""}"
                    data-action="view"
                    data-id="${task.id}"
                    role="button"
                    tabindex="0"
                    title="View task details"
                >

                    <strong title="${escapeHTML(task.title)}">
                        ${escapeHTML(task.title)}
                    </strong>

                    <small>
                        ${escapeHTML(task.description || "No description")}
                    </small>

                </div>

            </div>

        </td>


        <td>
            <span class="project-name">
                ${escapeHTML(task.project)}
            </span>
        </td>


        <td>

            <div class="assignee">

                <span class="assignee-avatar">
                    ${initials}
                </span>

                <span class="assignee-name">
                    ${escapeHTML(task.assignee)}
                </span>

            </div>

        </td>


        <td>

            <span class="priority-badge priority-${task.priority}">
                ${formatPriority(task.priority)}
            </span>

        </td>


        <td>

            <span class="due-date ${dueDateOverdue ? "overdue" : ""}">

                ${formatDate(task.dueDate)}

                ${dueDateOverdue && !isCompleted ? " • Overdue" : ""}

            </span>

        </td>


        <td>

            <select
                class="status-select status-${task.status}"
                data-action="status"
                data-id="${task.id}"
                aria-label="Change task status"
            >

                <option value="todo"
                    ${task.status === "todo" ? "selected" : ""}>
                    To Do
                </option>

                <option value="in-progress"
                    ${task.status === "in-progress" ? "selected" : ""}>
                    In Progress
                </option>

                <option value="review"
                    ${task.status === "review" ? "selected" : ""}>
                    Review
                </option>

                <option value="completed"
                    ${task.status === "completed" ? "selected" : ""}>
                    Completed
                </option>

            </select>

        </td>


        <td>

            <div class="task-actions">

                <button
                    class="action-button"
                    data-action="view"
                    data-id="${task.id}"
                    aria-label="View task"
                    title="View task"
                >

                    <svg viewBox="0 0 24 24">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path>
                        <circle cx="12" cy="12" r="2.5"></circle>
                    </svg>

                </button>


                <button
                    class="action-button"
                    data-action="edit"
                    data-id="${task.id}"
                    aria-label="Edit task"
                    title="Edit task"
                >

                    <svg viewBox="0 0 24 24">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"></path>
                    </svg>

                </button>


                <button
                    class="action-button delete"
                    data-action="delete"
                    data-id="${task.id}"
                    aria-label="Delete task"
                    title="Delete task"
                >

                    <svg viewBox="0 0 24 24">
                        <path d="M4 7h16"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M6 7l1 14h10l1-14"></path>
                        <path d="M9 7V4h6v3"></path>
                    </svg>

                </button>

            </div>

        </td>

    `;


    return row;

}


/* ============================================================
   TABLE ACTION DELEGATION
============================================================ */

elements.taskTableBody.addEventListener(
    "click",
    event => {

        const target =
            event.target.closest("[data-action]");

        if (!target) return;

        const id =
            target.dataset.id;

        const action =
            target.dataset.action;


        if (action === "view") {

            window.location.href = `task-details.html?id=${encodeURIComponent(id)}`;

        }


        if (action === "edit") {

            openEditTaskModal(id);

        }


        if (action === "delete") {

            openDeleteModal(id);

        }


        if (action === "toggle") {

            toggleTaskCompletion(id);

        }

    }
);


/* ============================================================
   STATUS SELECT
============================================================ */

elements.taskTableBody.addEventListener(
    "change",
    event => {

        const select =
            event.target.closest(
                '[data-action="status"]'
            );

        if (!select) return;

        const id =
            select.dataset.id;

        const task =
            findTask(id);

        if (!task) return;

        task.status =
            select.value;

        saveTasks();

        render();

        showToast(
            "success",
            "Status Updated",
            `${task.title} is now ${formatStatus(task.status)}.`
        );

    }
);


/* ============================================================
   STATISTICS
============================================================ */

function updateStatistics() {

    const total =
        tasks.length;

    const inProgress =
        tasks.filter(
            task => task.status === "in-progress"
        ).length;

    const completed =
        tasks.filter(
            task => task.status === "completed"
        ).length;

    const overdue =
        tasks.filter(
            task =>
                isTaskOverdue(task) &&
                task.status !== "completed"
        ).length;


    elements.totalTasks.textContent =
        total;

    elements.inProgressTasks.textContent =
        inProgress;

    elements.completedTasks.textContent =
        completed;

    elements.overdueTasks.textContent =
        overdue;

    elements.sidebarTaskCount.textContent =
        total;

    elements.sidebarTaskCount.hidden =
        total === 0;

}


/* ============================================================
   PAGINATION
============================================================ */

function renderPagination() {

    const filteredTasks =
        getFilteredTasks();

    const totalPages =
        Math.ceil(
            filteredTasks.length /
            tasksPerPage
        );


    elements.pagination.innerHTML = "";


    if (totalPages <= 1) {

        return;

    }


    const previousButton =
        createPaginationButton(
            "‹",
            currentPage === 1
        );

    previousButton.addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                currentPage--;

                render();

            }

        }
    );

    elements.pagination.appendChild(
        previousButton
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            createPaginationButton(
                page,
                false,
                page === currentPage
            );

        button.addEventListener(
            "click",
            () => {

                currentPage = page;

                render();

            }
        );

        elements.pagination.appendChild(
            button
        );

    }


    const nextButton =
        createPaginationButton(
            "›",
            currentPage === totalPages
        );

    nextButton.addEventListener(
        "click",
        () => {

            if (currentPage < totalPages) {

                currentPage++;

                render();

            }

        }
    );

    elements.pagination.appendChild(
        nextButton
    );

}


/* ============================================================
   PAGINATION BUTTON
============================================================ */

function createPaginationButton(
    text,
    disabled = false,
    active = false
) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        `pagination-button ${active ? "active" : ""}`;

    button.textContent =
        text;

    button.disabled =
        disabled;

    return button;

}


/* ============================================================
   ASSIGNEE FILTER
============================================================ */

function populateAssigneeFilter() {

    const currentValue =
        elements.assigneeFilter.value;


    const assignees =
        [...new Set(
            tasks.map(task => task.assignee)
        )].sort();


    elements.assigneeFilter.innerHTML = `
        <option value="all">All Assignees</option>
    `;


    assignees.forEach(assignee => {

        const option =
            document.createElement("option");

        option.value =
            assignee;

        option.textContent =
            assignee;

        elements.assigneeFilter.appendChild(
            option
        );

    });


    if (
        assignees.includes(currentValue)
    ) {

        elements.assigneeFilter.value =
            currentValue;

    }

}

function populateAssigneeOptions() {

    let accounts = [];

    try {
        accounts = JSON.parse(localStorage.getItem("taskflowAccounts") || "[]");
    } catch (error) {
        accounts = [];
    }

    const assignees = accounts
        .map(account => `${account.firstName || ""} ${account.lastName || ""}`.trim())
        .filter(Boolean);

    elements.taskAssignee.innerHTML = `<option value="">Select employee</option>`;

    assignees.forEach(assignee => {
        const option = document.createElement("option");
        option.value = assignee;
        option.textContent = assignee;
        elements.taskAssignee.appendChild(option);
    });

}


/* ============================================================
   ACTIVE FILTERS
============================================================ */

function renderActiveFilters() {

    elements.activeFilters.innerHTML = "";


    const filters = [];


    if (elements.statusFilter.value !== "all") {

        filters.push({
            label: `Status: ${formatStatus(elements.statusFilter.value)}`,
            type: "status"
        });

    }


    if (elements.priorityFilter.value !== "all") {

        filters.push({
            label: `Priority: ${formatPriority(elements.priorityFilter.value)}`,
            type: "priority"
        });

    }


    if (elements.assigneeFilter.value !== "all") {

        filters.push({
            label: `Assignee: ${elements.assigneeFilter.value}`,
            type: "assignee"
        });

    }


    filters.forEach(filter => {

        const chip =
            document.createElement("div");

        chip.className =
            "filter-chip";

        chip.innerHTML = `
            <span>${escapeHTML(filter.label)}</span>
            <button
                type="button"
                data-filter-type="${filter.type}"
                aria-label="Remove filter"
            >
                ×
            </button>
        `;

        chip
            .querySelector("button")
            .addEventListener(
                "click",
                () => removeFilter(filter.type)
            );

        elements.activeFilters.appendChild(
            chip
        );

    });

}


/* ============================================================
   REMOVE FILTER
============================================================ */

function removeFilter(type) {

    if (type === "status") {

        elements.statusFilter.value =
            "all";

    }

    if (type === "priority") {

        elements.priorityFilter.value =
            "all";

    }

    if (type === "assignee") {

        elements.assigneeFilter.value =
            "all";

    }

    currentPage = 1;

    render();

}


/* ============================================================
   CREATE TASK MODAL
============================================================ */

function openCreateTaskModal() {

    editingTaskId = null;

    elements.taskForm.reset();

    elements.taskId.value = "";

    clearValidation();

    elements.taskModalTitle.textContent =
        "Create Task";

    elements.taskModalDescription.textContent =
        "Add a new task to your workspace.";

    elements.saveTaskButton.textContent =
        "Create Task";

    elements.taskStatus.value =
        "todo";

    setMinimumDate();

    openModal(elements.taskModal);

    setTimeout(
        () => elements.taskTitle.focus(),
        150
    );

}


/* ============================================================
   EDIT TASK MODAL
============================================================ */

function openEditTaskModal(id) {

    const task =
        findTask(id);

    if (!task) return;


    editingTaskId =
        id;


    clearValidation();


    elements.taskId.value =
        task.id;

    elements.taskTitle.value =
        task.title;

    elements.taskDescription.value =
        task.description || "";

    elements.taskProject.value =
        task.project;

    elements.taskAssignee.value =
        task.assignee;

    elements.taskPriority.value =
        task.priority;

    elements.taskStatus.value =
        task.status;

    elements.taskDueDate.value =
        task.dueDate;

    elements.taskHours.value =
        task.hours || "";


    elements.taskModalTitle.textContent =
        "Edit Task";

    elements.taskModalDescription.textContent =
        "Update the selected task.";

    elements.saveTaskButton.textContent =
        "Save Changes";


    openModal(elements.taskModal);

}


/* ============================================================
   SUBMIT TASK
============================================================ */

function handleTaskSubmit(event) {

    event.preventDefault();


    if (!validateTaskForm()) {

        return;

    }


    const taskData = {

        title:
            elements.taskTitle.value.trim(),

        description:
            elements.taskDescription.value.trim(),

        project:
            elements.taskProject.value,

        assignee:
            elements.taskAssignee.value,

        priority:
            elements.taskPriority.value,

        status:
            elements.taskStatus.value,

        dueDate:
            elements.taskDueDate.value,

        hours:
            Number(elements.taskHours.value) || 0

    };

    const employee = getAccountForEmployee(taskData.assignee);
    taskData.department = employee?.department || "";
    taskData.role = employee?.role || "";


    if (editingTaskId) {

        const task =
            findTask(editingTaskId);

        if (!task) return;


        Object.assign(
            task,
            taskData
        );


        saveTasks();

        populateAssigneeFilter();

        render();

        closeAllModals();


        showToast(
            "success",
            "Task Updated",
            `${task.title} was updated successfully.`
        );


    } else {

        const newTask = {

            id:
                Date.now(),

            ...taskData,

            createdAt:
                getTodayDate()

        };


        tasks.unshift(
            newTask
        );


        saveTasks();

        populateAssigneeFilter();

        currentPage = 1;

        render();

        closeAllModals();


        showToast(
            "success",
            "Task Created",
            `${newTask.title} was added successfully.`
        );

    }

}


/* ============================================================
   FORM VALIDATION
============================================================ */

function validateTaskForm() {

    clearValidation();


    let valid = true;


    if (
        elements.taskTitle.value.trim().length < 3
    ) {

        showFieldError(
            "taskTitle",
            "Task title must contain at least 3 characters."
        );

        valid = false;

    }


    if (!elements.taskProject.value) {

        showFieldError(
            "taskProject",
            "Please select a project."
        );

        valid = false;

    }


    if (!elements.taskAssignee.value) {

        showFieldError(
            "taskAssignee",
            "Please select an assignee."
        );

        valid = false;

    }


    if (!elements.taskPriority.value) {

        showFieldError(
            "taskPriority",
            "Please select a priority."
        );

        valid = false;

    }


    if (!elements.taskDueDate.value) {

        showFieldError(
            "taskDueDate",
            "Please select a due date."
        );

        valid = false;

    }


    if (
        elements.taskDueDate.value &&
        elements.taskDueDate.value < getTodayDate()
    ) {

        showFieldError(
            "taskDueDate",
            "Due date cannot be in the past."
        );

        valid = false;

    }


    return valid;

}


/* ============================================================
   FIELD ERROR
============================================================ */

function showFieldError(
    fieldId,
    message
) {

    const field =
        document.getElementById(fieldId);

    const group =
        field.closest(".form-group");

    const error =
        document.getElementById(
            `${fieldId}Error`
        );


    if (group) {

        group.classList.add(
            "has-error"
        );

    }


    if (error) {

        error.textContent =
            message;

    }

}


/* ============================================================
   CLEAR VALIDATION
============================================================ */

function clearValidation() {

    document
        .querySelectorAll(".form-group.has-error")
        .forEach(group => {

            group.classList.remove(
                "has-error"
            );

        });


    document
        .querySelectorAll(".field-error")
        .forEach(error => {

            error.textContent = "";

        });

}


/* ============================================================
   DETAILS MODAL
============================================================ */

function openDetailsModal(id) {

    const task =
        findTask(id);

    if (!task) return;


    selectedDetailsTaskId =
        id;


    elements.detailsTaskTitle.textContent =
        task.title;

    elements.detailsTaskDescription.textContent =
        task.description ||
        "No description available.";

    elements.detailsProject.textContent =
        task.project;

    elements.detailsAssignee.textContent =
        task.assignee;

    elements.detailsDueDate.textContent =
        formatDate(task.dueDate);

    elements.detailsStatus.textContent =
        formatStatus(task.status);

    elements.detailsHours.textContent =
        task.hours
            ? `${task.hours} hours`
            : "Not specified";

    elements.detailsCreated.textContent =
        formatDate(task.createdAt);


    elements.detailsPriority.textContent =
        formatPriority(task.priority);

    elements.detailsPriority.className =
        `priority-badge priority-${task.priority}`;


    elements.detailsStatusSelect.value =
        task.status;


    openModal(
        elements.detailsModal
    );

}


/* ============================================================
   UPDATE DETAILS STATUS
============================================================ */

function updateDetailsTaskStatus() {

    if (!selectedDetailsTaskId) return;


    const task =
        findTask(
            selectedDetailsTaskId
        );

    if (!task) return;


    task.status =
        elements.detailsStatusSelect.value;


    saveTasks();

    render();


    elements.detailsStatus.textContent =
        formatStatus(task.status);


    showToast(
        "success",
        "Status Updated",
        `${task.title} status was updated.`
    );

}


/* ============================================================
   DELETE MODAL
============================================================ */

function openDeleteModal(id) {

    const task =
        findTask(id);

    if (!task) return;


    deletingTaskId =
        id;


    elements.deleteTaskName.textContent =
        task.title;


    openModal(
        elements.deleteModal
    );

}


/* ============================================================
   CONFIRM DELETE
============================================================ */

function confirmTaskDelete() {

    if (!deletingTaskId) return;


    const task =
        findTask(
            deletingTaskId
        );

    if (!task) return;


    tasks =
        tasks.filter(
            item =>
                item.id !== deletingTaskId
        );


    saveTasks();

    populateAssigneeFilter();

    currentPage = 1;

    render();

    closeAllModals();


    showToast(
        "success",
        "Task Deleted",
        `${task.title} was deleted successfully.`
    );


    deletingTaskId =
        null;

}


/* ============================================================
   TOGGLE TASK COMPLETION
============================================================ */

function toggleTaskCompletion(id) {

    const task =
        findTask(id);

    if (!task) return;


    task.status =
        task.status === "completed"
            ? "todo"
            : "completed";


    saveTasks();

    render();


    showToast(
        "success",
        "Task Updated",
        `${task.title} is now ${formatStatus(task.status)}.`
    );

}


/* ============================================================
   OPEN MODAL
============================================================ */

function openModal(modal) {

    closeProfileDropdown();

    elements.overlay.classList.add(
        "visible"
    );

    modal.classList.add(
        "visible"
    );

    document.body.style.overflow =
        "hidden";

}


/* ============================================================
   CLOSE MODALS
============================================================ */

function closeAllModals() {

    document
        .querySelectorAll(".modal.visible")
        .forEach(modal => {

            modal.classList.remove(
                "visible"
            );

        });


    elements.overlay.classList.remove(
        "visible"
    );


    document.body.style.overflow =
        "";


    editingTaskId =
        null;

    deletingTaskId =
        null;

    selectedDetailsTaskId =
        null;

}


/* ============================================================
   SIDEBAR
============================================================ */

function openSidebar() {

    elements.sidebar.classList.add(
        "open"
    );

    elements.overlay.classList.add(
        "visible"
    );

}


function closeSidebar() {

    elements.sidebar.classList.remove(
        "open"
    );


    if (
        !document.querySelector(
            ".modal.visible"
        )
    ) {

        elements.overlay.classList.remove(
            "visible"
        );

    }

}


/* ============================================================
   PROFILE DROPDOWN
============================================================ */

function toggleProfileDropdown(event) {

    event.stopPropagation();

    elements.profileDropdown.classList.toggle(
        "visible"
    );

}


function closeProfileDropdown() {

    elements.profileDropdown.classList.remove(
        "visible"
    );

}


/* ============================================================
   DOCUMENT CLICK
============================================================ */

function handleDocumentClick(event) {

    if (
        !elements.profileDropdown.contains(
            event.target
        ) &&
        !elements.profileButton.contains(
            event.target
        )
    ) {

        closeProfileDropdown();

    }


    if (
        event.target === elements.overlay
    ) {

        closeAllModals();

        closeSidebar();

    }

}


/* ============================================================
   KEYBOARD
============================================================ */

function handleKeyboard(event) {

    if (event.key === "Escape") {

        closeAllModals();

        closeProfileDropdown();

        closeSidebar();

    }

}


/* ============================================================
   HEADER SCROLL
============================================================ */

function handleScroll() {

    const header =
        document.querySelector(
            ".top-header"
        );

    if (
        window.scrollY > 5
    ) {

        header.classList.add(
            "scrolled"
        );

    } else {

        header.classList.remove(
            "scrolled"
        );

    }

}


/* ============================================================
   FOCUS SEARCH
============================================================ */

function focusTaskSearch() {

    elements.taskSearch.focus();

    elements.taskSearch.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* ============================================================
   LOGOUT
============================================================ */

function handleLogout(event) {

    event.preventDefault();


    const confirmed =
        window.confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) return;


    /*
       For the current frontend-only project,
       redirect to login.html.
    */

    window.location.href =
        "login.html";

}


/* ============================================================
   MINIMUM DATE
============================================================ */

function setMinimumDate() {

    elements.taskDueDate.min =
        getTodayDate();

}


/* ============================================================
   FIND TASK
============================================================ */

function findTask(id) {

    return tasks.find(
        task => String(task.id) === String(id)
    );

}


/* ============================================================
   TASK OVERDUE
============================================================ */

function isTaskOverdue(task) {

    if (
        task.status === "completed"
    ) {

        return false;

    }


    if (!task.dueDate) {

        return false;

    }


    return (
        task.dueDate <
        getTodayDate()
    );

}


/* ============================================================
   TODAY
============================================================ */

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* ============================================================
   FORMAT DATE
============================================================ */

function formatDate(dateString) {

    if (!dateString) {

        return "—";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* ============================================================
   FORMAT STATUS
============================================================ */

function formatStatus(status) {

    const labels = {

        "todo":
            "To Do",

        "in-progress":
            "In Progress",

        "review":
            "Review",

        "completed":
            "Completed"

    };


    return labels[status] ||
           status;

}


/* ============================================================
   FORMAT PRIORITY
============================================================ */

function formatPriority(priority) {

    const labels = {

        high:
            "High",

        medium:
            "Medium",

        low:
            "Low"

    };


    return labels[priority] ||
           priority;

}


/* ============================================================
   GET INITIALS
============================================================ */

function getInitials(name) {

    return name
        .split(" ")
        .map(
            part =>
                part.charAt(0)
        )
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   TOAST NOTIFICATION
============================================================ */

function showToast(
    type,
    title,
    message
) {

    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type}`;


    const icon =
        type === "success"
            ? "✓"
            : type === "error"
                ? "!"
                : "i";


    toast.innerHTML = `

        <span class="toast-icon">
            ${icon}
        </span>

        <span class="toast-content">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <span>
                ${escapeHTML(message)}
            </span>

        </span>

    `;


    elements.toastContainer.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "removing"
            );


            setTimeout(
                () => toast.remove(),
                200
            );

        },
        3200
    );

}

function getAccountForEmployee(name) {

    try {
        const accounts = JSON.parse(localStorage.getItem("taskflowAccounts") || "[]");
        return accounts.find(account =>
            `${account.firstName || ""} ${account.lastName || ""}`.trim() === name
        );
    } catch (error) {
        return null;
    }

}