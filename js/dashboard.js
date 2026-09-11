/* =========================================================
   TASKFLOW DASHBOARD
   dashboard.js
========================================================= */

"use strict";


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   DOM ELEMENTS
========================================================= */

const sidebar = $("#sidebar");
const sidebarOverlay = $("#sidebarOverlay");
const mobileMenuButton = $("#mobileMenuButton");
const sidebarClose = $("#sidebarClose");

const workspaceButton = $("#workspaceButton");
const workspaceMenu = $("#workspaceMenu");

const userProfileButton = $("#userProfileButton");
const profileMenu = $("#profileMenu");

const notificationButton = $("#notificationButton");
const notificationPanel = $("#notificationPanel");

const searchButton = $("#searchButton");
const searchModal = $("#searchModal");
const globalSearch = $("#globalSearch");
const searchResults = $("#searchResults");

const createTaskButton = $("#createTaskButton");
const taskModal = $("#taskModal");
const createTaskForm = $("#createTaskForm");

const toast = $("#toast");
const toastTitle = $("#toastTitle");
const toastMessage = $("#toastMessage");
const toastClose = $("#toastClose");

const logoutButton = $("#logoutButton");
const profileLogout = $("#profileLogout");

const topbar = $(".topbar");

const markAllRead = $("#markAllRead");
const dashboardOverview = $("#dashboardOverview");
const taskModule = $("#taskModule");
const taskBoardModule = $("#taskBoardModule");
const projectsModule = $("#projectsModule");
const bugModule = $("#bugModule");
const bugBoard = $("#bugBoard");
const bugModal = $("#bugModal");
const bugForm = $("#bugForm");
const workspaceModule = $("#workspaceModule");
const openProfileButton = $("#openProfileButton");
const openAccountSettingsButton = $("#openAccountSettingsButton");
const taskBoard = $("#taskBoard");
const taskEmptyState = $("#taskEmptyState");
const taskModuleCreateButton = $("#taskModuleCreateButton");
const teamModule = $("#teamModule");
const teamDirectory = $("#teamDirectory");
const employeeModal = $("#employeeModal");
const employeeViewModal = $("#employeeViewModal");
const employeeForm = $("#employeeForm");
const createEmployeeButton = $("#createEmployeeButton");
const taskProjectInput = $("#taskProject");
const taskDepartmentInput = $("#taskDepartment");
const taskRoleInput = $("#taskRole");
let taskFilter = "assigned";
let workspaceView = "calendar";
let projectFilter = "active";
let timerStartedAt = null;
let timerInterval = null;

const IT_DEPARTMENTS = [
    "Software Engineering", "Frontend Development", "Backend Development", "Full-Stack Development", "Mobile Development", "QA / Quality Engineering", "DevOps", "Cloud & Infrastructure", "Cybersecurity", "Network Operations", "Database Administration", "Data Engineering", "Data Science", "AI/ML", "UI/UX Design", "Product Management", "Business Analysis", "Project Management", "Program Management", "IT Operations", "IT Support", "IT Service Management", "Enterprise Architecture", "ERP", "Sales", "Business Development", "Marketing", "Customer Success", "Technical Support", "Recruitment / Talent Acquisition", "Human Resources", "Finance", "Procurement", "Legal & Compliance", "Administration", "Technical Documentation", "Learning & Development", "Executive Management"
];

const IT_ROLES = [
    "Software Engineer", "Software Developer", "Frontend Developer", "Backend Developer", "Full-Stack Developer", "Java Developer", "Python Developer", ".NET Developer", "Node.js Developer", "React Developer", "Angular Developer", "Android Developer", "iOS Developer", "QA Analyst", "QA Engineer", "Automation Test Engineer", "SDET", "Performance Test Engineer", "DevOps Engineer", "Cloud Engineer", "Cloud Architect", "SRE", "Platform Engineer", "Cybersecurity Analyst", "SOC Analyst", "Security Engineer", "Penetration Tester", "Data Analyst", "Data Scientist", "Data Engineer", "BI Developer", "ML Engineer", "AI Engineer", "Generative AI Engineer", "MLOps Engineer", "Database Administrator", "SQL Developer", "Network Engineer", "Network Administrator", "System Administrator", "UI Designer", "UX Designer", "Product Designer", "UX Researcher", "Product Manager", "Product Owner", "Business Analyst", "Project Manager", "Program Manager", "Scrum Master", "Solution Architect", "Enterprise Architect", "IT Support Engineer", "Technical Support Engineer", "IT Service Manager", "SAP Consultant", "Salesforce Developer", "ServiceNow Developer", "Technical Writer", "IT Recruiter", "HR Manager", "IT Sales Executive", "Business Development Manager", "Customer Success Manager", "Finance Analyst", "Procurement Specialist"
];


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;
let currentUserName = "";

try {

    currentUser = JSON.parse(
        sessionStorage.getItem("taskflowCurrentUser") || "null"
    );

    const sessionUser = currentUser;

    const account = currentUser?.email
        ? getStoredAccount(currentUser.email)
        : null;

    if (account) {
        currentUser = {
            ...account,
            ...sessionUser,
            firstName: account.firstName || sessionUser.firstName,
            lastName: account.lastName || sessionUser.lastName,
            department: account.department || sessionUser.department,
            designation: account.designation || sessionUser.designation,
            role: account.role || sessionUser.role,
            accountType: isManagerRole(account.role || sessionUser.role)
                ? "manager"
                : "employee"
        };
    }

} catch (error) {

    currentUser = null;

}

function getStoredAccount(email) {
    try {
        const accounts = JSON.parse(localStorage.getItem("taskflowAccounts") || "[]");
        return accounts.find(account =>
            String(account.email || "").trim().toLowerCase() === String(email).trim().toLowerCase()
        ) || null;
    } catch (error) {
        return null;
    }
}

function isManagerRole(role) {
    return ["administrator", "manager", "project manager", "program manager", "programme manager"]
        .includes(String(role || "").trim().toLowerCase());
}

function isProjectManager() {
    const role = String(currentUser?.role || "").trim().toLowerCase();
    const designation = String(currentUser?.designation || "").trim().toLowerCase();
    const managerRoles = [
        "administrator",
        "manager",
        "project manager",
        "program manager",
        "programme manager"
    ];

    return isManagerRole(role) ||
        currentUser?.accountType === "manager" ||
        currentUser?.email?.toLowerCase() === "demo@taskflow.com" ||
        managerRoles.includes(role) ||
        managerRoles.includes(designation);
}

if (!currentUser || !currentUser.email || !currentUser.userId) {

    window.location.replace("login.html");

} else {

    const fullName =
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
        currentUser.email.split("@")[0];

    currentUserName = fullName;

    const initials =
        fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(name => name.charAt(0))
            .join("")
            .toUpperCase();

    $("#userAvatar").textContent = initials;
    $("#profileAvatar").textContent = initials;
    $("#userName").textContent = fullName;
    $("#profileName").textContent = fullName;
    $("#profileEmail").textContent = currentUser.email;
    $("#profileDesignation").textContent = currentUser.designation || currentUser.department || "Team member";
    $("#profileUserId").textContent = `ID: ${currentUser.userId}`;
    $("#userRole").textContent = currentUser.role || "Employee";
    $("#welcomeName").textContent = currentUser.firstName || "there";

    document.querySelectorAll(".manager-only").forEach(element => {
        element.hidden = !isProjectManager();
        element.disabled = !isProjectManager();
    });

}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    sidebar.classList.add("open");
    sidebarOverlay.classList.add("show");

    document.body.style.overflow = "hidden";
}


function closeSidebar() {

    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");

    document.body.style.overflow = "";
}


if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        openSidebar
    );

}


if (sidebarClose) {

    sidebarClose.addEventListener(
        "click",
        closeSidebar
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

$$(".nav-item").forEach((item) => {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        $$(".nav-item").forEach((nav) => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

        const section = this.dataset.section;

        handleNavigation(section);

        if (window.innerWidth <= 900) {
            closeSidebar();
        }

    });

});

function navigateFromHash() {
    const section = window.location.hash.replace(/^#/, "");
    if (!section) return;
    const navItem = $(`.nav-item[data-section="${section}"]`);
    if (navItem) {
        $$(".nav-item").forEach(nav => nav.classList.remove("active"));
        navItem.classList.add("active");
        handleNavigation(section);
    }
}

window.addEventListener("hashchange", navigateFromHash);

$$('.nav-item[data-section="my-tasks"], .nav-item[data-section="projects"]').forEach(item => {
    item.addEventListener("click", () => {
        const submenu = $(`[data-submenu="${item.dataset.section}"]`);
        submenu?.classList.toggle("open");
        item.querySelector(".nav-chevron")?.classList.toggle("open");
    });
});

$$('.nav-subitem').forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        $$(".nav-item").forEach(nav => nav.classList.remove("active"));
        $$(".nav-subitem").forEach(subitem => subitem.classList.remove("active"));
        item.classList.add("active");
        if (item.dataset.taskFilter) taskFilter = item.dataset.taskFilter;
        if (item.dataset.projectFilter) projectFilter = item.dataset.projectFilter;
        if (item.dataset.section === "projects" && !item.dataset.projectFilter) projectFilter = "active";
        handleNavigation(item.dataset.section);
        renderTasks();
        if (item.dataset.projectFilter) renderProjects();
        if (window.innerWidth <= 900) closeSidebar();
    });
});


function handleNavigation(section) {

    const sectionNames = {

        dashboard: "Dashboard",
        "my-tasks": "My Tasks",
        projects: "Projects",
        "task-board": "Task Board",
        calendar: "Calendar",
        "time-tracking": "Time Tracking",
        team: "Team",
        reports: "Reports & Analytics",
        notifications: "Notifications",
        activity: "Activity",
        settings: "Settings",
        "bug-lifecycle": "Bug Life Cycle",
        profile: "My Profile",
        "account-settings": "Account Settings"

    };

    const name = sectionNames[section] || "Dashboard";

    const isTaskModule = section === "my-tasks" || section === "task-board";
    const isMyTasksModule = section === "my-tasks";
    const isTaskBoardModule = section === "task-board";
    const isProjectsModule = section === "projects";
    const isTeamModule = section === "team";
    const isBugModule = section === "bug-lifecycle";
    const workspaceSections = ["calendar", "reports", "notifications", "settings", "profile", "account-settings", "time-tracking", "activity"];
    const isWorkspaceModule = workspaceSections.includes(section);
    if (isTaskBoardModule) taskFilter = "assigned";

    dashboardOverview.classList.toggle("hidden", isTaskModule || isTeamModule || isBugModule || isWorkspaceModule || isProjectsModule);
    taskModule.classList.toggle("active", isMyTasksModule);
    taskBoardModule.classList.toggle("active", isTaskBoardModule);
    projectsModule.classList.toggle("active", isProjectsModule);
    teamModule.classList.toggle("active", isTeamModule);
    bugModule.classList.toggle("active", isBugModule);
    workspaceModule.classList.toggle("active", isWorkspaceModule);
    if (isMyTasksModule) renderMyTasks();
    if (isProjectsModule) renderProjects();

    if (isWorkspaceModule) {
        workspaceView = section;
        renderWorkspaceView(section);
    }

    $(".page-title h1").textContent = name;
    $(".breadcrumb").textContent = `Workspace /`;

    if (name !== "Dashboard" && !isTeamModule && !isBugModule && !isTaskModule && !isWorkspaceModule) {

        showToast(
            "Navigation",
            `${name} module is ready for the next development phase.`
        );

    }

}

function renderWorkspaceView(section) {
    const titles = {
        calendar: ["Calendar", "Plan deadlines and see what is coming next."],
        reports: ["Reports & Analytics", "Monitor delivery, workload, and quality trends."],
        notifications: ["Notifications", "Review updates that need your attention."],
        "time-tracking": ["Time Tracking", "Log focused work against your active tasks."],
        activity: ["Activity", "A chronological view of recent workspace changes."],
        settings: ["Settings", "Customize your workspace experience."],
        profile: ["My Profile", "Manage the details your team sees."],
        "account-settings": ["Account Settings", "Manage your sign-in and account preferences."]
    };
    const [title, description] = titles[section] || titles.calendar;
    $("#workspaceModuleTitle").textContent = title;
    $("#workspaceModuleDescription").textContent = description;
    $("#workspaceModuleBreadcrumb").textContent = section === "profile" || section === "account-settings" ? "Account /" : "Workspace /";
    ["calendarPanel", "reportsPanel", "notificationsPanel", "timeTrackingPanel", "activityPanel", "settingsPanel", "profilePanel", "accountSettingsPanel"].forEach(id => $("#" + id)?.classList.add("hidden-panel"));
    const panelId = { calendar: "calendarPanel", reports: "reportsPanel", notifications: "notificationsPanel", "time-tracking": "timeTrackingPanel", activity: "activityPanel", settings: "settingsPanel", profile: "profilePanel", "account-settings": "accountSettingsPanel" }[section];
    $("#" + panelId)?.classList.remove("hidden-panel");
    if (section === "calendar") renderCalendar();
    if (section === "reports") renderReports();
    if (section === "notifications") renderNotificationCenter();
    if (section === "time-tracking") renderTimeTracking();
    if (section === "activity") renderActivity();
    if (section === "settings") {
        try {
            const savedSettings = JSON.parse(localStorage.getItem("taskflowSettings") || "{}");
            $("#settingTheme").value = savedSettings.theme || "light";
            $("#settingEmailUpdates").checked = savedSettings.emailUpdates !== false;
            $("#settingCompactMode").checked = savedSettings.compactMode === true;
            $("#settingLanguage").value = savedSettings.language || "English";
            $("#settingDateFormat").value = savedSettings.dateFormat || "short";
            $("#settingWeeklyDigest").checked = savedSettings.weeklyDigest === true;
        } catch (error) {
            $("#settingTheme").value = "light";
        }
    }
    if (section === "profile") populateProfileForm();
    if (section === "account-settings") populateAccountSettings();
}

function getVisibleUserTasks() {
    const isManager = isProjectManager();
    const assignedTasks = isManager ? tasks : tasks.filter(task => String(task.assignee || "").toLowerCase() === currentUserName.toLowerCase());
    return taskFilter === "review" ? assignedTasks.filter(task => task.status === "review") : assignedTasks;
}

function renderMyTasks() {
    const list = $("#myTaskList");
    if (!list) return;
    const visibleTasks = getVisibleUserTasks();
    list.replaceChildren();
    if (!visibleTasks.length) {
        list.innerHTML = `<div class="empty-module"><strong>No tasks in this view</strong><span>Assigned work will appear here when it is available.</span></div>`;
        return;
    }
    visibleTasks.slice().sort((first, second) => second.createdAt - first.createdAt).forEach(task => {
        const item = document.createElement("article");
        item.className = "my-task-row";
        const statusLabel = task.status === "review" ? "In Review" : task.status === "completed" ? "Completed" : task.status === "progress" || task.status === "in-progress" ? "In Progress" : "To Do";
        item.innerHTML = `<div class="my-task-main"><span class="task-checkbox ${task.status === "completed" ? "completed" : ""}"></span><div><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.project || "No project")} · ${escapeHTML(task.description || "No description")}</small></div></div><span class="priority ${task.priority}">${task.priority}</span><span class="status ${task.status === "completed" ? "completed-status" : task.status === "review" ? "review-status" : task.status === "progress" || task.status === "in-progress" ? "progress-status" : ""}">${statusLabel}</span><time>${new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>`;
        item.addEventListener("click", () => { window.location.href = `${currentUser?.accountType === "employee" ? "employee-task-details.html" : "task.html"}?id=${encodeURIComponent(task.id)}`; });
        list.appendChild(item);
    });
}

function renderProjects() {
    const grid = $("#projectSummaryGrid");
    if (!grid) return;
    let archivedProjects = [];
    try {
        archivedProjects = JSON.parse(localStorage.getItem("taskflow_archived_projects") || "[]");
    } catch (error) {
        archivedProjects = [];
    }
    const grouped = tasks.reduce((projects, task) => {
        const name = task.project || "Unassigned project";
        projects[name] ||= [];
        projects[name].push(task);
        return projects;
    }, {});
    grid.replaceChildren();
    const visibleProjects = Object.entries(grouped).filter(([project]) => project === "Unassigned project" || (projectFilter === "archived" ? archivedProjects.includes(project) : !archivedProjects.includes(project)));
    Object.entries(grouped).forEach(([project, projectTasks]) => {
        if (!visibleProjects.some(([visibleProject]) => visibleProject === project)) return;
        const completed = projectTasks.filter(task => task.status === "completed").length;
        const card = document.createElement("article");
        card.className = "project-card";
        const isArchived = archivedProjects.includes(project);
        const assignees = [...new Set(projectTasks.map(task => task.assignee).filter(Boolean))];
        card.innerHTML = `<div class="project-card-top"><span class="project-mark">${escapeHTML(project.slice(0, 2).toUpperCase())}</span><span>${projectTasks.length} task${projectTasks.length === 1 ? "" : "s"}</span></div><h3>${escapeHTML(project)}</h3><p>${completed} completed · ${projectTasks.filter(task => task.status === "review").length} in review</p><p class="project-assignees"><strong>Assigned to:</strong> ${escapeHTML(assignees.join(", ") || "Unassigned")}</p><div class="project-progress"><span style="width: ${Math.round(completed / projectTasks.length * 100)}%"></span></div><small>${Math.round(completed / projectTasks.length * 100)}% complete</small>${project !== "Unassigned project" ? `<button type="button" class="project-archive-button" data-project="${escapeHTML(project)}">${isArchived ? "Restore project" : "Archive project"}</button>` : ""}`;
        grid.appendChild(card);
    });
    if (!grid.children.length) grid.innerHTML = `<div class="empty-module"><strong>${projectFilter === "archived" ? "No archived projects" : "No active projects"}</strong><span>Create a task with a project name to see it here.</span></div>`;
}

$("#projectSummaryGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-project]");
    if (!button || !isProjectManager()) return;
    const project = button.dataset.project;
    let archivedProjects = [];
    try { archivedProjects = JSON.parse(localStorage.getItem("taskflow_archived_projects") || "[]"); } catch (error) { archivedProjects = []; }
    archivedProjects = archivedProjects.includes(project) ? archivedProjects.filter(item => item !== project) : [...archivedProjects, project];
    localStorage.setItem("taskflow_archived_projects", JSON.stringify(archivedProjects));
    renderProjects();
    showToast("Projects Updated", `${project} is now ${archivedProjects.includes(project) ? "archived" : "active"}.`);
});

let calendarDate = new Date();

function renderCalendar() {
    const month = $("#calendarMonth");
    const grid = $("#calendarGrid");
    if (!month || !grid) return;
    const year = calendarDate.getFullYear();
    const monthIndex = calendarDate.getMonth();
    month.textContent = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    grid.replaceChildren();
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
        const heading = document.createElement("strong");
        heading.textContent = day;
        grid.appendChild(heading);
    });
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let index = 0; index < firstDay; index++) grid.appendChild(document.createElement("span"));
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayTasks = tasks.filter(task => task.dueDate === dateKey);
        cell.innerHTML = `<b>${day}</b>${dayTasks.slice(0, 2).map(task => `<small>${escapeHTML(task.title)}</small>`).join("")}`;
        grid.appendChild(cell);
    }
}

function renderReports() {
    const completed = tasks.filter(task => task.status === "completed").length;
    const overdue = tasks.filter(task => task.status !== "completed" && task.dueDate < new Date().toISOString().slice(0, 10)).length;
    $("#reportTotalTasks").textContent = tasks.length;
    $("#reportCompletionRate").textContent = tasks.length ? `${Math.round(completed / tasks.length * 100)}%` : "0%";
    $("#reportOpenBugs").textContent = bugs.filter(bug => bug.status !== "closed").length;
    $("#reportOverdueTasks").textContent = overdue;
    $("#reportList").innerHTML = `<p><strong>Task delivery</strong> ${completed} completed, ${tasks.filter(task => task.status === "review").length} awaiting review.</p><p><strong>Quality pipeline</strong> ${bugs.filter(bug => bug.status === "resolved").length} resolved bugs ready for closure.</p>`;
}

function renderNotificationCenter() {
    const list = $("#notificationCenterList");
    if (!list) return;
    const assigned = tasks.filter(task => String(task.assignee || "").toLowerCase() === currentUserName.toLowerCase());
    list.replaceChildren();
    [...assigned.map(task => `Task assigned: ${task.title}`), ...bugs.slice(0, 5).map(bug => `Bug ${bug.status}: ${bug.title}`)].forEach(message => {
        const item = document.createElement("div");
        item.className = "notification-center-item";
        item.innerHTML = `<span class="notification-item-icon purple">!</span><span>${escapeHTML(message)}</span><small>Just now</small>`;
        list.appendChild(item);
    });
    if (!list.children.length) list.innerHTML = "<p class=\"empty-module\">You are all caught up.</p>";
}

function renderTimeTracking() {
    const select = $("#timeTrackerTaskSelect");
    const list = $("#timeLogList");
    if (!select || !list) return;
    select.replaceChildren(new Option("Select a task to track", ""));
    getVisibleUserTasks().forEach(task => select.appendChild(new Option(task.title, task.id)));
    list.innerHTML = getVisibleUserTasks().slice(0, 5).map(task => `<div class="time-log-row"><span>${escapeHTML(task.title)}</span><strong>${task.timeLogged || "0m"}</strong><small>${escapeHTML(task.project || "Unassigned")}</small></div>`).join("") || "<p class=\"empty-module\">No tracked work yet.</p>";
}

function renderActivity() {
    const feed = $("#activityFeed");
    if (!feed) return;
    const events = [
        ...tasks.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 8).map(task => ({ title: "Task updated", text: task.title, time: task.createdAt })),
        ...bugs.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5).map(bug => ({ title: `Bug ${bug.status}`, text: bug.title, time: bug.createdAt }))
    ].sort((a, b) => b.time - a.time);
    feed.innerHTML = events.map(event => `<div class="activity-feed-row"><span class="activity-pulse"></span><div><strong>${escapeHTML(event.title)}</strong><p>${escapeHTML(event.text)}</p></div><small>${new Date(event.time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</small></div>`).join("") || "<p class=\"empty-module\">No recent activity.</p>";
}

function populateProfileForm() {
    $("#profileFirstName").value = currentUser?.firstName || "";
    $("#profileLastName").value = currentUser?.lastName || "";
    $("#profilePhone").value = currentUser?.phone || "";
    $("#profileDepartmentEdit").value = currentUser?.department || "";
    $("#profileBio").value = currentUser?.bio || "";
    $("#profileJobTitle").value = currentUser?.jobTitle || currentUser?.designation || "";
    $("#profileLocation").value = currentUser?.location || "";
    $("#profileSkills").value = currentUser?.skills || "";
}

function populateAccountSettings() {
    $("#accountEmailEdit").value = currentUser?.email || "";
    $("#accountPasswordEdit").value = "";
    $("#accountAlerts").checked = currentUser?.accountAlerts !== false;
    $("#accountUsernameEdit").value = currentUser?.username || currentUser?.email?.split("@")[0] || "";
    $("#accountTimezone").value = currentUser?.timezone || "UTC";
    $("#accountTwoFactor").checked = currentUser?.twoFactor === true;
}

$("#calendarPrevious")?.addEventListener("click", () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); });
$("#calendarNext")?.addEventListener("click", () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); });
$("#workspaceModuleAction")?.addEventListener("click", () => renderWorkspaceView(workspaceView));

$("#timeTrackerTaskSelect")?.addEventListener("change", event => {
    const task = tasks.find(item => String(item.id) === event.target.value);
    $("#timeTrackerTask").textContent = task?.title || "No task selected";
});

$("#timeToggleButton")?.addEventListener("click", event => {
    if (!timerStartedAt) {
        if (!$("#timeTrackerTaskSelect").value) {
            showToast("Select a Task", "Choose a task before starting the timer.");
            return;
        }
        timerStartedAt = Date.now();
        event.target.textContent = "Stop timer";
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
            $("#timeTrackerValue").textContent = new Date(elapsed * 1000).toISOString().slice(11, 19);
        }, 1000);
    } else {
        clearInterval(timerInterval);
        timerStartedAt = null;
        event.target.textContent = "Start timer";
        showToast("Time Logged", "Your focused work session has been recorded.");
        renderTimeTracking();
    }
});

$("#moduleMarkAllRead")?.addEventListener("click", () => {
    $(".notification-dot")?.style.setProperty("display", "none");
    $("#notificationCount").hidden = true;
    showToast("Notifications", "All notifications have been marked as read.");
});

$("#settingsForm")?.addEventListener("submit", event => {
    event.preventDefault();
    localStorage.setItem("taskflowSettings", JSON.stringify({
        theme: $("#settingTheme").value,
        emailUpdates: $("#settingEmailUpdates").checked,
        compactMode: $("#settingCompactMode").checked,
        language: $("#settingLanguage").value,
        dateFormat: $("#settingDateFormat").value,
        weeklyDigest: $("#settingWeeklyDigest").checked
    }));
    document.body.dataset.theme = $("#settingTheme").value;
    showToast("Settings Saved", "Your workspace preferences have been updated.");
});

$("#profileForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const updated = { ...currentUser, firstName: $("#profileFirstName").value.trim(), lastName: $("#profileLastName").value.trim(), phone: $("#profilePhone").value.trim(), department: $("#profileDepartmentEdit").value.trim(), jobTitle: $("#profileJobTitle").value.trim(), location: $("#profileLocation").value.trim(), skills: $("#profileSkills").value.trim(), bio: $("#profileBio").value.trim() };
    const accounts = getAccounts();
    const index = accounts.findIndex(account => account.email === currentUser.email);
    if (index >= 0) accounts[index] = { ...accounts[index], ...updated };
    saveAccounts(accounts);
    currentUser = updated;
    sessionStorage.setItem("taskflowCurrentUser", JSON.stringify(currentUser));
    $("#userName").textContent = `${updated.firstName} ${updated.lastName}`.trim();
    $("#profileName").textContent = $("#userName").textContent;
    showToast("Profile Saved", "Your profile details have been updated.");
});

$("#accountSettingsForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#accountEmailEdit").value.trim().toLowerCase();
    const accounts = getAccounts();
    const index = accounts.findIndex(account => account.email === currentUser.email);
    if (index >= 0) {
        accounts[index] = { ...accounts[index], email, username: $("#accountUsernameEdit").value.trim(), timezone: $("#accountTimezone").value, accountAlerts: $("#accountAlerts").checked, twoFactor: $("#accountTwoFactor").checked };
        if ($("#accountPasswordEdit").value) accounts[index].password = $("#accountPasswordEdit").value;
        saveAccounts(accounts);
    }
    currentUser = { ...currentUser, email, username: $("#accountUsernameEdit").value.trim(), timezone: $("#accountTimezone").value, accountAlerts: $("#accountAlerts").checked, twoFactor: $("#accountTwoFactor").checked };
    if ($("#accountPasswordEdit").value) currentUser.password = $("#accountPasswordEdit").value;
    sessionStorage.setItem("taskflowCurrentUser", JSON.stringify(currentUser));
    $("#profileEmail").textContent = email;
    showToast("Account Saved", "Your account settings have been updated.");
});

openProfileButton?.addEventListener("click", () => { profileMenu.classList.remove("show"); handleNavigation("profile"); });
openAccountSettingsButton?.addEventListener("click", () => { profileMenu.classList.remove("show"); handleNavigation("account-settings"); });

function getAccounts() {
    try {
        return JSON.parse(localStorage.getItem("taskflowAccounts") || "[]");
    } catch (error) {
        return [];
    }
}

function saveAccounts(accounts) {
    localStorage.setItem("taskflowAccounts", JSON.stringify(accounts));
}

function fillSelect(select, values, placeholder) {
    if (!select) return;
    select.replaceChildren(new Option(placeholder, ""));
    values.forEach(value => select.appendChild(new Option(value, value)));
}

fillSelect($("#employeeDepartment"), IT_DEPARTMENTS, "Select department");
fillSelect($("#employeeRole"), IT_ROLES, "Select IT role");
fillSelect(taskDepartmentInput, IT_DEPARTMENTS, "Select department");
fillSelect(taskRoleInput, IT_ROLES, "Select IT role");

function renderTeamDirectory() {
    if (!teamDirectory) return;

    teamDirectory.replaceChildren();
    getAccounts().forEach(account => {
        const name = `${account.firstName || ""} ${account.lastName || ""}`.trim();
        const item = document.createElement("tr");
        item.innerHTML = `
            <td><strong>${escapeHTML(name)}</strong></td>
            <td>${escapeHTML(account.department || "Unassigned")}</td>
            <td>${escapeHTML(account.role || "Unassigned")}</td>
            <td>${escapeHTML(account.email)}</td>
            <td>${escapeHTML(account.project || "Unassigned")}</td>
            <td><small>${escapeHTML(account.userId || "")}</small></td>
            <td class="team-member-actions">
                <button type="button" data-team-action="view" data-team-id="${escapeHTML(account.userId)}">View</button>
                ${isProjectManager() ? `<button type="button" data-team-action="edit" data-team-id="${escapeHTML(account.userId)}">Edit</button>
                <button type="button" data-team-action="delete" data-team-id="${escapeHTML(account.userId)}">Delete</button>` : ""}
            </td>`;
        teamDirectory.appendChild(item);
    });
}

createEmployeeButton?.addEventListener("click", () => {
    employeeForm?.reset();
    $("#employeeId").value = "";
    $("#employeeModal h3").textContent = "Create Employee";
    $("#saveEmployeeButton").textContent = "Create Employee";
    employeeModal?.classList.add("show");
    document.body.style.overflow = "hidden";
});

employeeForm?.addEventListener("submit", event => {
    event.preventDefault();

    const firstName = $("#employeeFirstName").value.trim();
    const lastName = $("#employeeLastName").value.trim();
    const email = $("#employeeEmail").value.trim().toLowerCase();
    const employeeId = $("#employeeId").value;
    const accounts = getAccounts();

    if (!isProjectManager()) return;

    if (accounts.some(account => account.email.toLowerCase() === email && account.userId !== employeeId)) {
        showToast("Employee Exists", "An account already uses this email address.");
        return;
    }

    const account = {
        firstName,
        lastName,
        email,
        phone: "",
        password: $("#employeePassword").value,
        department: $("#employeeDepartment").value,
        role: $("#employeeRole").value,
        accountType: "employee",
        project: $("#employeeProject").value.trim(),
        userId: `TF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    };

    if (
        account.role === "Project Manager" &&
        accounts.some(item => item.role === "Project Manager" && item.userId !== employeeId)
    ) {
        showToast("Project Manager Exists", "Only one Project Manager can be created for the workspace.");
        return;
    }

    if (employeeId) {
        const index = accounts.findIndex(item => item.userId === employeeId);
        account.userId = employeeId;
        account.password = accounts[index]?.password || account.password;
        accounts[index] = account;
    } else {
        accounts.push(account);
    }
    saveAccounts(accounts);
    populateEmployeeOptions();
    renderTeamDirectory();
    employeeModal.classList.remove("show");
    document.body.style.overflow = "";
    showToast("Employee Created", `${firstName} can now log in with ${email}.`);
});

teamDirectory?.addEventListener("click", event => {
    const button = event.target.closest("[data-team-action]");
    if (!button) return;

    const accounts = getAccounts();
    const index = accounts.findIndex(account => account.userId === button.dataset.teamId);
    if (index < 0) return;

    if (button.dataset.teamAction === "view") {
        const account = accounts[index];
        const name = `${account.firstName || ""} ${account.lastName || ""}`.trim();
        $("#viewEmployeeName").textContent = name;
        $("#viewEmployeeCode").textContent = account.userId || "Not assigned";
        $("#viewEmployeeEmail").textContent = account.email || "Not assigned";
        $("#viewEmployeeDepartment").textContent = account.department || "Not assigned";
        $("#viewEmployeeRole").textContent = account.role || "Not assigned";
        $("#viewEmployeeProject").textContent = account.project || "Not assigned";
        employeeViewModal.classList.add("show");
        document.body.style.overflow = "hidden";
        return;
    }

    if (button.dataset.teamAction === "delete") {
        if (!window.confirm(`Delete ${accounts[index].firstName} ${accounts[index].lastName} from the team?`)) return;
        accounts.splice(index, 1);
        saveAccounts(accounts);
        populateEmployeeOptions();
        renderTeamDirectory();
        return;
    }

    const account = accounts[index];
    $("#employeeId").value = account.userId;
    $("#employeeFirstName").value = account.firstName || "";
    $("#employeeLastName").value = account.lastName || "";
    $("#employeeEmail").value = account.email || "";
    $("#employeeRole").value = account.role || "Employee";
    $("#employeeDepartment").value = account.department || "";
    $("#employeeProject").value = account.project || "";
    $("#employeePassword").value = account.password || "";
    $("#employeeModal h3").textContent = "Update Employee";
    $("#saveEmployeeButton").textContent = "Update Employee";
    employeeModal.classList.add("show");
    document.body.style.overflow = "hidden";
});

renderTeamDirectory();


if (taskModuleCreateButton) {

    if (!isProjectManager()) taskModuleCreateButton.hidden = true;

    taskModuleCreateButton.addEventListener("click", () => {

        taskModal.classList.add("show");
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            $("#taskTitle")?.focus();
        }, 100);

    });

}


const taskStorageKey = "taskflow_tasks_v1";

let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem(taskStorageKey) || "[]");
    tasks = tasks.filter(task =>
        !(Number.isInteger(task.id) && task.id >= 1 && task.id <= 12)
    );
    const accounts = getAccounts();
    let tasksUpdated = false;
    tasks = tasks.map(task => {
        if (task.project || task.projectName) {
            if (!task.project && task.projectName) {
                tasksUpdated = true;
                return { ...task, project: task.projectName };
            }
            return task;
        }
        const assignee = accounts.find(account => {
            const name = `${account.firstName || ""} ${account.lastName || ""}`.trim().toLowerCase();
            return name === String(task.assignee || "").trim().toLowerCase();
        });
        if (!assignee?.project) return task;
        tasksUpdated = true;
        return { ...task, project: assignee.project };
    });
    if (tasksUpdated) saveTasks();
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
}

function updateAssignedNotifications() {

    const assignedTasks = tasks.filter(task =>
        String(task.assignee || "").toLowerCase() === currentUserName.toLowerCase()
    );

    const taskCount = $("#myTasksCount");
    const summary = $("#notificationSummary");
    const list = $(".notification-list");
    const notificationCount = $("#notificationCount");

    if (taskCount) {
        taskCount.textContent = assignedTasks.length;
        taskCount.hidden = assignedTasks.length === 0;
    }

    if (summary) {
        summary.textContent = `${assignedTasks.length} assigned task${assignedTasks.length === 1 ? "" : "s"}`;
    }

    if (notificationCount) {
        notificationCount.textContent = assignedTasks.length;
        notificationCount.hidden = assignedTasks.length === 0;
    }

    if (list) {
        list.replaceChildren();
        assignedTasks.slice(0, 5).forEach(task => {
            const item = document.createElement("div");
            item.className = "notification-item unread";
            item.innerHTML = `
                <span class="notification-item-icon purple">+</span>
                <div>
                    <strong>Task assigned</strong>
                    <p>You have been assigned "${escapeHTML(task.title)}" for ${escapeHTML(task.project || "your project")}.</p>
                    <small>${escapeHTML(task.department || "Department not set")} &middot; ${escapeHTML(task.role || "Role not set")}</small>
                </div>`;
            list.appendChild(item);
        });
    }

}

function populateEmployeeOptions() {

    const assigneeSelect = $("#taskAssignee");
    if (!assigneeSelect) return;

    let accounts = [];
    try {
        accounts = JSON.parse(localStorage.getItem("taskflowAccounts") || "[]");
    } catch (error) {
        accounts = [];
    }

    assigneeSelect.replaceChildren(new Option("Select employee", ""));

    const selectedProject = taskProjectInput?.value.trim().toLowerCase() || "";
    const selectedDepartment = taskDepartmentInput?.value.trim().toLowerCase() || "";
    const selectedRole = taskRoleInput?.value.trim().toLowerCase() || "";

    accounts.forEach(account => {
        const name = `${account.firstName || ""} ${account.lastName || ""}`.trim();
        const accountProject = String(account.project || "").trim().toLowerCase();

        const accountDepartment = String(account.department || "").trim().toLowerCase();
        const accountRole = String(account.role || "").trim().toLowerCase();

        if (
            name &&
            (!selectedProject || !accountProject || accountProject === selectedProject) &&
            (!selectedDepartment || accountDepartment === selectedDepartment) &&
            (!selectedRole || accountRole === selectedRole)
        ) {
            assigneeSelect.appendChild(new Option(name, name));
        }
    });

}

populateEmployeeOptions();

taskProjectInput?.addEventListener("input", populateEmployeeOptions);
taskDepartmentInput?.addEventListener("change", populateEmployeeOptions);
taskRoleInput?.addEventListener("change", populateEmployeeOptions);

function renderDashboardWidgets() {
    const total = tasks.length;
    const statusCounts = {
        todo: tasks.filter(task => task.status === "todo").length,
        progress: tasks.filter(task => task.status === "progress" || task.status === "in-progress").length,
        review: tasks.filter(task => task.status === "review").length,
        completed: tasks.filter(task => task.status === "completed").length
    };
    const dashboardEmpty = text => `<p class="dashboard-empty">${text}</p>`;
    const chart = $("#dashboardBarChart");
    const distribution = $("#dashboardDistribution");
    const projects = $("#dashboardProjects");
    const workload = $("#dashboardWorkload");
    const activity = $("#dashboardActivity");

    if (chart) {
        if (!total) chart.innerHTML = dashboardEmpty("Create a task to see progress here.");
        else {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const today = new Date();
            chart.innerHTML = days.map((day, index) => {
                const date = new Date(today);
                date.setDate(today.getDate() - (today.getDay() - index + 7) % 7);
                const key = date.toISOString().slice(0, 10);
                const dayTasks = tasks.filter(task => String(task.createdAt || "").startsWith(key) || task.dueDate === key);
                const completed = dayTasks.filter(task => task.status === "completed").length;
                const active = dayTasks.filter(task => task.status !== "completed").length;
                const scale = Math.max(1, ...tasks.map(task => 1));
                return `<div class="bar-column"><div class="bar-group"><span class="bar completed" style="height:${completed ? Math.max(12, completed / scale * 100) : 3}%"></span><span class="bar progress" style="height:${active ? Math.max(12, active / scale * 100) : 3}%"></span></div><small>${day}</small></div>`;
            }).join("");
        }
    }

    if (distribution) {
        distribution.innerHTML = total ? Object.entries({ todo: "To Do", progress: "In Progress", review: "In Review", completed: "Completed" }).map(([key, label]) => `<div class="distribution-item"><span><i class="distribution-dot ${key === "todo" ? "blue" : key === "progress" ? "orange" : key === "review" ? "purple" : "green"}"></i>${label}</span><strong>${Math.round(statusCounts[key] / total * 100)}%</strong></div>`).join("") : dashboardEmpty("No task status data yet.");
    }
    $("#distributionTotal")?.replaceChildren(document.createTextNode(String(total)));

    if (projects) {
        const grouped = tasks.reduce((result, task) => { const name = task.project || "Unassigned"; result[name] ||= []; result[name].push(task); return result; }, {});
        projects.innerHTML = Object.entries(grouped).map(([name, projectTasks]) => { const complete = projectTasks.filter(task => task.status === "completed").length; const percent = Math.round(complete / projectTasks.length * 100); return `<div class="project-row"><div class="project-main"><div class="project-icon project-blue">${escapeHTML(name.slice(0, 2).toUpperCase())}</div><div><strong>${escapeHTML(name)}</strong><small>${projectTasks.length} task${projectTasks.length === 1 ? "" : "s"}</small></div></div><div class="project-progress"><div class="project-progress-header"><span>${percent}%</span></div><div class="progress-track"><span style="width:${percent}%"></span></div></div></div>`; }).join("") || dashboardEmpty("Create a task with a project to see progress.");
    }

    if (workload) {
        const grouped = tasks.reduce((result, task) => { const name = task.assignee || "Unassigned"; result[name] ||= []; result[name].push(task); return result; }, {});
        workload.innerHTML = Object.entries(grouped).map(([name, assigned]) => { const open = assigned.filter(task => task.status !== "completed").length; const percent = Math.min(100, Math.round(open / Math.max(1, assigned.length) * 100)); return `<div class="workload-person"><div class="person-info"><span class="avatar blue-avatar">${getInitials(name)}</span><div><strong>${escapeHTML(name)}</strong><small>${assigned.length} assigned task${assigned.length === 1 ? "" : "s"}</small></div></div><div class="workload-value"><strong>${percent}%</strong><div class="progress-track"><span style="width:${percent}%"></span></div></div></div>`; }).join("") || dashboardEmpty("Assign a task to see team workload.");
    }

    if (activity) {
        activity.innerHTML = tasks.slice().sort((first, second) => second.createdAt - first.createdAt).slice(0, 5).map(task => `<div class="activity-item"><span class="activity-avatar blue-avatar">${getInitials(task.assignee || "Task")}</span><div class="activity-content"><p><strong>${escapeHTML(task.assignee || "Workspace")}</strong> created <b>${escapeHTML(task.title)}</b></p><span>${new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div></div>`).join("") || dashboardEmpty("Your task activity will appear here.");
    }
}

function updateTaskStats() {
    const completed = tasks.filter(task => task.status === "completed").length;
    const progress = tasks.filter(task =>
        task.status === "progress" || task.status === "in-progress"
    ).length;
    const overdue = tasks.filter(task =>
        task.status !== "completed" && task.dueDate < new Date().toISOString().slice(0, 10)
    ).length;

    $("#totalTasks").dataset.target = tasks.length;
    $("#completedTasks").dataset.target = completed;
    $("#progressTasks").dataset.target = progress;
    $("#overdueTasks").dataset.target = overdue;
    $("#totalTasks").textContent = tasks.length;
    $("#completedTasks").textContent = completed;
    $("#progressTasks").textContent = progress;
    $("#overdueTasks").textContent = overdue;
    updateAssignedNotifications();
    renderDashboardWidgets();
}

function renderTasks() {
    if (!taskBoard) return;

    const isManager = isProjectManager();
    const assignedTasks = isManager
        ? tasks
        : tasks.filter(task =>
            String(task.assignee || "").toLowerCase() === currentUserName.toLowerCase()
        );
    const visibleTasks = taskFilter === "review"
        ? assignedTasks.filter(task => task.status === "review")
        : assignedTasks;

    $$(".task-column-list").forEach(list => list.replaceChildren());

    visibleTasks.forEach(task => {
        const card = document.createElement("article");
        card.className = "task-card";
        card.draggable = true;
        card.dataset.taskId = task.id;
        card.innerHTML = `
            <div class="task-card-top">
                <span class="priority ${task.priority}">${task.priority}</span>
                <span class="task-status-label">${task.status === "review" ? "In Review" : task.status === "completed" ? "Done" : task.status === "progress" || task.status === "in-progress" ? "In Progress" : "To Do"}</span>
                <button class="task-card-menu" type="button" aria-label="Task options">•••</button>
            </div>
            <h4>${escapeHTML(task.title)}</h4>
            <p>${escapeHTML(task.project || "Unassigned project")} · ${escapeHTML(task.description || "No description added.")}</p>
            <div class="task-card-footer">
                <span>${escapeHTML(task.assignee)}</span>
                <time datetime="${task.dueDate}">${new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
            </div>`;

        card.addEventListener("dragstart", () => card.classList.add("dragging"));
        card.addEventListener("dragend", () => card.classList.remove("dragging"));
        card.addEventListener("click", event => {
            if (event.target.closest("button")) return;
            const detailsPage = currentUser?.accountType === "employee"
                ? "employee-task-details.html"
                : "task.html";
            window.location.href = `${detailsPage}?id=${encodeURIComponent(task.id)}`;
        });

        const boardStatus = task.status === "in-progress" ? "progress" : task.status;
        const column = taskBoard.querySelector(`[data-drop-status="${boardStatus}"]`);
        if (column) column.appendChild(card);
    });

    $$(".column-count").forEach(count => {
        const column = count.closest(".task-column");
        count.textContent = visibleTasks.filter(task => {
            const status = task.status === "in-progress" ? "progress" : task.status;
            return status === column.dataset.columnStatus;
        }).length;
    });

    const recentTasksBody = $(".task-table tbody");

    if (recentTasksBody) {
        recentTasksBody.replaceChildren();

        visibleTasks.slice().sort((first, second) => second.createdAt - first.createdAt).slice(0, 5).forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><div class="task-name">${escapeHTML(task.title)}</div></td>
                <td>${escapeHTML(task.assignee)}</td>
                <td><span class="priority ${task.priority}">${task.priority}</span></td>
                <td><span class="status ${task.status === "completed" ? "completed-status" : task.status === "progress" || task.status === "in-progress" ? "progress-status" : task.status === "review" ? "review-status" : ""}">${task.status === "completed" ? "Completed" : task.status === "progress" || task.status === "in-progress" ? "In Progress" : task.status === "review" ? "In Review" : "To Do"}</span></td>
                <td>${new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>`;
            recentTasksBody.appendChild(row);
        });
    }

    updateTaskStats();
    renderMyTasks();
    renderProjects();
}

if (taskBoard) {
    $$(".task-column-list").forEach(column => {
        column.addEventListener("dragover", event => event.preventDefault());
        column.addEventListener("drop", event => {
            event.preventDefault();
            const draggedCard = $(".task-card.dragging");
            const task = tasks.find(item => String(item.id) === String(draggedCard?.dataset.taskId));
            if (!task) return;
            task.status = column.dataset.dropStatus === "progress"
                ? "in-progress"
                : column.dataset.dropStatus;
            saveTasks();
            renderTasks();
            showToast("Task Updated", "Task progress has been updated.");
        });
    });

    $$("#taskSort, #boardSort").forEach(sortSelect => sortSelect.addEventListener("change", event => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        tasks.sort((first, second) => event.target.value === "priority"
            ? priorityOrder[first.priority] - priorityOrder[second.priority]
            : event.target.value === "due"
                ? new Date(first.dueDate) - new Date(second.dueDate)
                : second.createdAt - first.createdAt);
        renderTasks();
        renderMyTasks();
    }));

    renderTasks();
}

const bugStorageKey = "taskflow_bugs_v1";
let bugs = [];

try {
    bugs = JSON.parse(localStorage.getItem(bugStorageKey) || "[]");
} catch (error) {
    bugs = [];
}

function saveBugs() {
    localStorage.setItem(bugStorageKey, JSON.stringify(bugs));
}

function renderBugs() {
    if (!bugBoard) return;
    const priority = $("#bugPriorityFilter")?.value || "all";
    const filteredBugs = priority === "all" ? bugs : bugs.filter(bug => bug.priority === priority);
    $$(".bug-column-list").forEach(list => list.replaceChildren());

    filteredBugs.forEach(bug => {
        const card = document.createElement("article");
        card.className = "bug-card";
        card.draggable = true;
        card.dataset.bugId = bug.id;
        card.innerHTML = `<div class="bug-card-top"><span class="priority ${bug.priority}">${bug.priority}</span><span class="bug-id">${escapeHTML(bug.id)}</span></div><h4>${escapeHTML(bug.title)}</h4><p>${escapeHTML(bug.description)}</p><div class="bug-card-footer"><span>${escapeHTML(bug.project)}</span><small>${escapeHTML(bug.reporter)}</small></div>`;
        card.addEventListener("dragstart", () => card.classList.add("dragging"));
        card.addEventListener("dragend", () => card.classList.remove("dragging"));
        const column = bugBoard.querySelector(`[data-bug-status="${bug.status}"] .bug-column-list`);
        column?.appendChild(card);
    });

    $$(".bug-column").forEach(column => {
        column.querySelector(".bug-column-count").textContent = filteredBugs.filter(bug => bug.status === column.dataset.bugStatus).length;
    });
    $("#bugSummary").textContent = `${bugs.length} issue${bugs.length === 1 ? "" : "s"} tracked · ${bugs.filter(bug => bug.status !== "closed").length} active`;
    const bugCount = $("#bugCount");
    if (bugCount) {
        const activeCount = bugs.filter(bug => bug.status !== "closed").length;
        bugCount.textContent = activeCount;
        bugCount.hidden = activeCount === 0;
    }
}

if (bugBoard) {
    $$(".bug-column-list").forEach(column => {
        column.addEventListener("dragover", event => event.preventDefault());
        column.addEventListener("drop", event => {
            event.preventDefault();
            const draggedCard = $(".bug-card.dragging");
            const bug = bugs.find(item => String(item.id) === String(draggedCard?.dataset.bugId));
            if (!bug) return;
            bug.status = column.closest(".bug-column").dataset.bugStatus;
            saveBugs();
            renderBugs();
            showToast("Bug Updated", "Issue status has been updated.");
        });
    });
    $("#bugPriorityFilter")?.addEventListener("change", renderBugs);
    renderBugs();
}

navigateFromHash();

$("#reportBugButton")?.addEventListener("click", () => {
    bugForm?.reset();
    bugModal?.classList.add("show");
    document.body.style.overflow = "hidden";
    $("#bugTitle")?.focus();
});

bugForm?.addEventListener("submit", event => {
    event.preventDefault();
    const title = $("#bugTitle").value.trim();
    const description = $("#bugDescription").value.trim();
    const project = $("#bugProject").value.trim();
    if (!title || !description || !project) return;
    bugs.unshift({
        id: `BUG-${Date.now().toString().slice(-6)}`,
        title,
        description,
        project,
        priority: $("#bugPriority").value,
        reporter: currentUserName,
        status: "open",
        createdAt: Date.now()
    });
    saveBugs();
    renderBugs();
    bugModal.classList.remove("show");
    document.body.style.overflow = "";
    showToast("Bug Reported", `"${title}" was added to Open.`);
});

window.addEventListener("storage", event => {
    if (event.key === taskStorageKey) {
        try {
            tasks = JSON.parse(event.newValue || "[]");
        } catch (error) {
            tasks = [];
        }
        renderTasks();
    }
    if (event.key === bugStorageKey) {
        try { bugs = JSON.parse(event.newValue || "[]"); } catch (error) { bugs = []; }
        renderBugs();
    }
});


/* =========================================================
   WORKSPACE DROPDOWN
========================================================= */

if (workspaceButton) {

    workspaceButton.addEventListener("click", (event) => {

        event.stopPropagation();

        workspaceMenu.classList.toggle("show");

        profileMenu.classList.remove("show");
        notificationPanel.classList.remove("show");

    });

}


/* =========================================================
   PROFILE DROPDOWN
========================================================= */

if (userProfileButton) {

    userProfileButton.addEventListener("click", (event) => {

        event.stopPropagation();

        profileMenu.classList.toggle("show");

        workspaceMenu.classList.remove("show");
        notificationPanel.classList.remove("show");

    });

}


/* =========================================================
   NOTIFICATION PANEL
========================================================= */

if (notificationButton) {

    notificationButton.addEventListener("click", (event) => {

        event.stopPropagation();

        notificationPanel.classList.toggle("show");

        profileMenu.classList.remove("show");
        workspaceMenu.classList.remove("show");

    });

}


/* =========================================================
   CLOSE DROPDOWNS ON OUTSIDE CLICK
========================================================= */

document.addEventListener("click", (event) => {

    if (
        workspaceMenu &&
        !workspaceMenu.contains(event.target) &&
        !workspaceButton.contains(event.target)
    ) {

        workspaceMenu.classList.remove("show");

    }


    if (
        profileMenu &&
        !profileMenu.contains(event.target) &&
        !userProfileButton.contains(event.target)
    ) {

        profileMenu.classList.remove("show");

    }


    if (
        notificationPanel &&
        !notificationPanel.contains(event.target) &&
        !notificationButton.contains(event.target)
    ) {

        notificationPanel.classList.remove("show");

    }

});


/* =========================================================
   NAVBAR / TOPBAR SCROLL
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 10) {

            topbar.classList.add("scrolled");

        } else {

            topbar.classList.remove("scrolled");

        }

    },
    { passive: true }
);


/* =========================================================
   DATE
========================================================= */

function updateDate() {

    const currentDateElement = $("#currentDate");

    if (!currentDateElement) {
        return;
    }

    const today = new Date();

    const formattedDate = today.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

    currentDateElement.textContent = formattedDate;

}

updateDate();


/* =========================================================
   STAT COUNTER ANIMATION
========================================================= */

function animateCounter(element) {

    const target = Number(element.dataset.target);

    if (!Number.isFinite(target)) {
        return;
    }

    const duration = 1000;

    const startTime = performance.now();

    function update(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );

        const easedProgress =
            1 - Math.pow(1 - progress, 3);

        const currentValue =
            Math.floor(target * easedProgress);

        element.textContent =
            currentValue.toLocaleString();

        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toLocaleString();

        }

    }

    requestAnimationFrame(update);
}


/* =========================================================
   INTERSECTION OBSERVER
========================================================= */

const statObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            const counters =
                entry.target.querySelectorAll(".stat-number");

            counters.forEach(animateCounter);

            observer.unobserve(entry.target);

        });

    },
    {
        threshold: 0.25
    }
);


const statsGrid = $(".stats-grid");

if (statsGrid) {
    statObserver.observe(statsGrid);
}


/* =========================================================
   CREATE TASK MODAL
========================================================= */

if (createTaskButton) {

    if (!isProjectManager()) createTaskButton.hidden = true;

    createTaskButton.addEventListener(
        "click",
        () => {

            taskModal.classList.add("show");

            document.body.style.overflow = "hidden";

            setTimeout(() => {

                $("#taskTitle")?.focus();

            }, 100);

        }
    );

}


/* =========================================================
   MODAL CLOSE BUTTONS
========================================================= */

$$("[data-close]").forEach((button) => {

    button.addEventListener("click", () => {

        const modalId = button.dataset.close;

        const modal = document.getElementById(modalId);

        if (modal) {

            modal.classList.remove("show");

            document.body.style.overflow = "";

        }

    });

});


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

$$(".modal-overlay").forEach((modal) => {

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {

            modal.classList.remove("show");

            document.body.style.overflow = "";

        }

    });

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
        return;
    }

    closeAllOverlays();

});


function closeAllOverlays() {

    workspaceMenu?.classList.remove("show");

    profileMenu?.classList.remove("show");

    notificationPanel?.classList.remove("show");

    searchModal?.classList.remove("show");

    taskModal?.classList.remove("show");

    closeSidebar();

    document.body.style.overflow = "";

}


/* =========================================================
   CREATE TASK
========================================================= */

if (createTaskForm) {

    createTaskForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const title =
                $("#taskTitle").value.trim();

            const assignee =
                $("#taskAssignee").value;

            const project =
                taskProjectInput?.value.trim() || "";

            const department =
                taskDepartmentInput?.value || "";

            const role =
                taskRoleInput?.value || "";

            const priority =
                $("#taskPriority").value;

            const dueDate =
                $("#taskDueDate").value;

            const description =
                $("#taskDescription").value.trim();

            if (!title || !assignee || !project || !dueDate) {

                showToast(
                    "Missing Information",
                    "Please complete the task title, assignee, project, and due date."
                );

                return;

            }

            taskModal.classList.remove("show");

            document.body.style.overflow = "";

            createTaskForm.reset();

            tasks.push({
                id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                title,
                assignee,
                project,
                department,
                role,
                priority,
                dueDate,
                description,
                status: "todo",
                createdAt: Date.now()
            });

            saveTasks();
            renderTasks();

            if (taskModule) {
                dashboardOverview.classList.add("hidden");
                taskModule.classList.add("active");
            }

            showToast(
                "Task Created",
                `"${title}" was successfully assigned to ${assignee}.`
            );

            console.log({
                title,
                assignee,
                priority,
                dueDate
            });

        }
    );

}


/* =========================================================
   TASK CHECKBOX INTERACTION
========================================================= */

$$(".task-checkbox").forEach((checkbox) => {

    checkbox.addEventListener("click", function () {

        this.classList.toggle("completed");

        const taskName =
            this.closest("tr")
                ?.querySelector(".task-name");

        if (!taskName) {
            return;
        }

        if (this.classList.contains("completed")) {

            showToast(
                "Task Completed",
                `${taskName.textContent.trim()} marked as completed.`
            );

        } else {

            showToast(
                "Task Reopened",
                `${taskName.textContent.trim()} moved back to active tasks.`
            );

        }

    });

});


/* =========================================================
   TASK PERIOD SELECT
========================================================= */

const taskPeriod = $("#taskPeriod");

if (taskPeriod) {

    taskPeriod.addEventListener(
        "change",
        function () {

            const selected =
                this.options[this.selectedIndex].text;

            showToast(
                "Chart Updated",
                `Task overview changed to ${selected}.`
            );

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

const searchableItems = [];


function getSearchableItems() {
    const taskItems = tasks.map(task => ({ title: task.title, type: "Task", person: task.assignee || task.project || "" }));
    const bugItems = bugs.map(bug => ({ title: bug.title, type: "Bug", person: `${bug.status} · ${bug.project}` }));
    const projectItems = [...new Set(tasks.map(task => task.project).filter(Boolean))].map(project => ({ title: project, type: "Project", person: "Workspace project" }));
    const teamItems = getAccounts().map(account => ({ title: `${account.firstName || ""} ${account.lastName || ""}`.trim(), type: "Team member", person: account.role || account.department || "" }));
    return [...taskItems, ...bugItems, ...projectItems, ...teamItems, ...searchableItems];
}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        () => {

            searchModal.classList.add("show");

            document.body.style.overflow = "hidden";

            setTimeout(() => {

                globalSearch.focus();

            }, 100);

        }
    );

}


if (globalSearch) {

    globalSearch.addEventListener(
        "input",
        function () {

            const query =
                this.value
                    .trim()
                    .toLowerCase();

            if (!query) {

                searchResults.innerHTML = `
                    <p class="search-placeholder">
                        Start typing to search.
                    </p>
                `;

                return;

            }

            const results =
                getSearchableItems().filter((item) =>
                    `${item.title} ${item.type} ${item.person}`
                        .toLowerCase()
                        .includes(query)
                );

            renderSearchResults(results);

        }
    );

}


function renderSearchResults(results) {

    if (!results.length) {

        searchResults.innerHTML = `
            <p class="search-placeholder">
                No results found.
            </p>
        `;

        return;

    }

    searchResults.innerHTML =
        results
            .map(
                (item) => `
                    <div
                        class="search-result-item"
                        data-result="${escapeHTML(item.title)}"
                        data-result-type="${escapeHTML(item.type)}">

                        <span class="avatar blue-avatar">
                            ${getInitials(item.title)}
                        </span>

                        <div>
                            <strong>${escapeHTML(item.title)}</strong>
                            <span>
                                ${escapeHTML(item.type)}
                                •
                                ${escapeHTML(item.person)}
                            </span>
                        </div>

                    </div>
                `
            )
            .join("");


    $$(".search-result-item").forEach((result) => {

        result.addEventListener("click", () => {

            const name =
                result.dataset.result;

            const resultType = result.dataset.resultType;

            searchModal.classList.remove("show");

            document.body.style.overflow = "";

            if (resultType === "Task") handleNavigation("my-tasks");
            if (resultType === "Bug") handleNavigation("bug-lifecycle");
            if (resultType === "Project") handleNavigation("projects");
            if (resultType === "Team member") handleNavigation("team");

            showToast(
                "Search Result",
                `Opening ${name}.`
            );

        });

    });

}


/* =========================================================
   SEARCH HELPERS
========================================================= */

function getInitials(text) {

    return text
        .split(" ")
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =========================================================
   NOTIFICATION MARK ALL READ
========================================================= */

if (markAllRead) {

    markAllRead.addEventListener(
        "click",
        () => {

            $$(".notification-item").forEach(
                (item) => {
                    item.classList.remove("unread");
                }
            );

            notificationPanel.classList.remove("show");

            const dot =
                $(".notification-dot");

            if (dot) {
                dot.style.display = "none";
            }

            const count =
                $(".notification-count");

            if (count) {
                count.textContent = "0";
            }

            showToast(
                "Notifications",
                "All notifications have been marked as read."
            );

        }
    );

}


/* =========================================================
   PROFILE LOGOUT
========================================================= */

function handleLogout() {

    const confirmed =
        window.confirm(
            "Are you sure you want to logout?"
        );

    if (!confirmed) {
        return;
    }

    showToast(
        "Logged Out",
        "You have been logged out successfully."
    );

    /*
        Frontend-only placeholder.

        When backend authentication is connected,
        redirect here to:

        login.html
    */

    setTimeout(() => {

        sessionStorage.removeItem("taskflowCurrentUser");
        window.location.href = "login.html";

    }, 1200);

}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        handleLogout
    );

}


if (profileLogout) {

    profileLogout.addEventListener(
        "click",
        handleLogout
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(title, message) {

    if (!toast) {
        return;
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

}


if (toastClose) {

    toastClose.addEventListener(
        "click",
        () => {

            toast.classList.remove("show");

            clearTimeout(toastTimer);

        }
    );

}


/* =========================================================
   CARD MENU BUTTONS
========================================================= */

$$(".card-menu-button").forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            showToast(
                "More Options",
                "Additional dashboard options will be available here."
            );

        }
    );

});


/* =========================================================
   HELP CENTER
========================================================= */

$$(".help-card").forEach((card) => {

    card.addEventListener(
        "click",
        () => {

            showToast(
                "Help Center",
                "Help Center module will be connected here."
            );

        }
    );

});


/* =========================================================
   PROFILE MENU ACTIONS
========================================================= */

if (profileMenu) {

    const profileButtons =
        profileMenu.querySelectorAll(
            "button:not(.profile-logout)"
        );

    profileButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const text =
                    button.textContent.trim();

                profileMenu.classList.remove("show");

                showToast(
                    text,
                    `${text} module will be available in the next phase.`
                );

            }
        );

    });

}


/* =========================================================
   WORKSPACE ACTIONS
========================================================= */

if (workspaceMenu) {

    const workspaceButtons =
        workspaceMenu.querySelectorAll(
            "button"
        );

    workspaceButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const text =
                    button.textContent.trim();

                workspaceMenu.classList.remove("show");

                if (
                    text.includes("Create Workspace")
                ) {

                    showToast(
                        "Workspace",
                        "Create Workspace functionality will be added later."
                    );

                    return;

                }

                showToast(
                    "Workspace Changed",
                    `Switched to ${text.replace("✓", "").trim()}.`
                );

            }
        );

    });

}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 900 &&
            sidebar.classList.contains("open")
        ) {

            closeSidebar();

        }

    }
);


/* =========================================================
   INITIAL DASHBOARD STATE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
            Frontend dashboard initialized.

            Future backend integration points:

            - Employee API
            - Task API
            - Project API
            - Notification API
            - Reports API
            - Authentication API
        */

        console.log(
            "TaskFlow Dashboard initialized successfully."
        );

    }
);