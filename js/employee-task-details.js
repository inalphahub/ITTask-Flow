"use strict";

const taskStorageKey = "taskflow_tasks_v1";
const taskId = new URLSearchParams(window.location.search).get("id");

function readJson(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (error) {
        return fallback;
    }
}

function getSessionUser() {
    try {
        return JSON.parse(sessionStorage.getItem("taskflowCurrentUser") || "null");
    } catch (error) {
        return null;
    }
}

function initials(name) {
    return String(name || "Assigned Employee")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part.charAt(0))
        .join("")
        .toUpperCase();
}

function formatDate(value) {
    if (!value) return "Not set";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    });
}

function formatLabel(value) {
    return String(value || "todo")
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function showProfile(user) {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
    const avatar = initials(name);
    document.querySelector("#profileAvatar").textContent = avatar;
    document.querySelector("#profileName").textContent = name;
    document.querySelector("#profileRole").textContent = user.role || user.designation || "Employee";
    document.querySelector("#topbarAvatar").textContent = avatar;
    document.querySelector("#topbarName").textContent = name;
}

function renderTask(task, user) {
    const assignedName = task.assignee || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    document.querySelector("#taskTitle").textContent = task.title;
    document.querySelector("#breadcrumbTitle").textContent = task.title;
    document.querySelector("#taskId").textContent = `Task ID: ${task.id}`;
    document.querySelector("#taskStatusLabel").textContent = formatLabel(task.status);
    document.querySelector("#taskPriority").textContent = formatLabel(task.priority);
    document.querySelector("#taskProject").textContent = task.project || "Not set";
    document.querySelector("#taskDueDate").textContent = formatDate(task.dueDate);
    document.querySelector("#taskDescription").textContent = task.description || "No description available.";
    document.querySelector("#assignedEmployee").textContent = assignedName;
    document.querySelector("#statusSelect").value = task.status || "todo";
    document.querySelector("#statusDot").style.background = task.status === "completed" ? "var(--success)" : task.status === "in-progress" ? "var(--primary)" : "var(--warning)";
}

const currentUser = getSessionUser();
const tasks = readJson(taskStorageKey, []);
const task = tasks.find(item => String(item.id) === String(taskId));

if (!currentUser?.email || !task) {
    document.querySelector("#notFound").hidden = false;
} else {
    showProfile(currentUser);
    renderTask(task, currentUser);

    document.querySelector("#saveStatus").addEventListener("click", () => {
        task.status = document.querySelector("#statusSelect").value;
        localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
        renderTask(task, currentUser);
    });
}
