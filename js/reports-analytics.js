/* Reports & Analytics – interactions, charts, animations */

(function () {
  "use strict";

  // ---------- Navbar ----------
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  menuToggle?.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  // ---------- Scroll reveal ----------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

  // ---------- Count-up KPIs ----------
  function animateCount(el, target, duration = 1400) {
    const isPercent = el.parentElement?.textContent?.includes("%") || el.nextSibling?.textContent === "%";
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const kpiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          if (!isNaN(target) && !el.dataset.counted) {
            el.dataset.counted = "1";
            animateCount(el, target);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => kpiObserver.observe(el));

  // ---------- Chart defaults ----------
  Chart.defaults.color = "#94a3b8";
  Chart.defaults.borderColor = "rgba(255,255,255,0.06)";
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";

  const gridColor = "rgba(255,255,255,0.05)";

  // Hero mini chart
  const heroCtx = document.getElementById("heroChart");
  if (heroCtx) {
    new Chart(heroCtx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Completed",
            data: [42, 58, 51, 72, 68, 45, 61],
            borderColor: "#818cf8",
            backgroundColor: "rgba(99,102,241,0.15)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { font: { size: 11 }, maxTicksLimit: 4 }, beginAtZero: true },
        },
      },
    });
  }

  // Task completion trend
  const completionCtx = document.getElementById("completionChart");
  if (completionCtx) {
    new Chart(completionCtx, {
      type: "bar",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
        datasets: [
          {
            label: "Completed",
            data: [148, 162, 155, 178, 191, 184],
            backgroundColor: "rgba(99,102,241,0.75)",
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Assigned",
            data: [170, 185, 172, 198, 210, 205],
            backgroundColor: "rgba(148,163,184,0.25)",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top", labels: { boxWidth: 12, padding: 16 } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: gridColor }, beginAtZero: true },
        },
      },
    });
  }

  // Status doughnut
  const statusCtx = document.getElementById("statusChart");
  if (statusCtx) {
    new Chart(statusCtx, {
      type: "doughnut",
      data: {
        labels: ["Completed", "In Progress", "Pending", "Overdue"],
        datasets: [
          {
            data: [1024, 138, 48, 38],
            backgroundColor: ["#22c55e", "#6366f1", "#94a3b8", "#f43f5e"],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "68%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } },
        },
      },
    });
  }

  // Priority bar
  const priorityCtx = document.getElementById("priorityChart");
  if (priorityCtx) {
    new Chart(priorityCtx, {
      type: "bar",
      data: {
        labels: ["Critical", "High", "Medium", "Low"],
        datasets: [
          {
            label: "Tasks",
            data: [42, 186, 512, 508],
            backgroundColor: ["#f43f5e", "#f59e0b", "#6366f1", "#14b8a6"],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, beginAtZero: true },
          y: { grid: { display: false } },
        },
      },
    });
  }

  // Overdue by week
  const overdueCtx = document.getElementById("overdueChart");
  if (overdueCtx) {
    new Chart(overdueCtx, {
      type: "line",
      data: {
        labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
        datasets: [
          {
            label: "Overdue",
            data: [28, 35, 42, 31, 27, 22, 18, 15],
            borderColor: "#f43f5e",
            backgroundColor: "rgba(244,63,94,0.12)",
            fill: true,
            tension: 0.35,
            pointBackgroundColor: "#f43f5e",
            pointRadius: 4,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: gridColor }, beginAtZero: true },
        },
      },
    });
  }

  // Employee productivity trend
  const empTrendCtx = document.getElementById("employeeTrendChart");
  if (empTrendCtx) {
    new Chart(empTrendCtx, {
      type: "line",
      data: {
        labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
        datasets: [
          {
            label: "Aisha Khan",
            data: [88, 90, 91, 93, 92, 94, 95, 94],
            borderColor: "#6366f1",
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "Marcus Reed",
            data: [82, 84, 85, 87, 88, 89, 90, 90],
            borderColor: "#8b5cf6",
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "Sofia Lopez",
            data: [78, 80, 79, 81, 82, 83, 83, 83],
            borderColor: "#14b8a6",
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "James Park",
            data: [75, 74, 72, 70, 71, 73, 72, 72],
            borderColor: "#f59e0b",
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top", labels: { boxWidth: 12, padding: 14 } },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: gridColor },
            min: 60,
            max: 100,
            ticks: { callback: (v) => v + "%" },
          },
        },
      },
    });
  }

  // Team comparison
  const teamCtx = document.getElementById("teamChart");
  if (teamCtx) {
    new Chart(teamCtx, {
      type: "bar",
      data: {
        labels: ["Engineering", "Design", "Product", "Marketing", "Support", "Sales"],
        datasets: [
          {
            label: "Completion %",
            data: [87, 91, 79, 84, 88, 76],
            backgroundColor: [
              "rgba(99,102,241,0.8)",
              "rgba(167,139,250,0.8)",
              "rgba(20,184,166,0.8)",
              "rgba(245,158,11,0.8)",
              "rgba(34,197,94,0.8)",
              "rgba(244,63,94,0.7)",
            ],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: gridColor },
            min: 0,
            max: 100,
            ticks: { callback: (v) => v + "%" },
          },
        },
      },
    });
  }

  // Time & Productivity Trends (switchable)
  const trendData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      completed: [42, 58, 51, 72, 68, 28, 35],
      focus: [6.2, 7.1, 6.8, 7.5, 7.0, 3.2, 4.1],
    },
    weekly: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      completed: [148, 162, 155, 178, 191, 184, 172, 198],
      focus: [32, 34, 31, 36, 38, 37, 35, 40],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      completed: [620, 680, 710, 745, 790, 820],
      focus: [138, 145, 152, 148, 160, 168],
    },
  };

  let trendChart = null;
  const trendCtx = document.getElementById("trendChart");

  function renderTrendChart(range) {
    const d = trendData[range];
    if (!d || !trendCtx) return;

    if (trendChart) trendChart.destroy();

    trendChart = new Chart(trendCtx, {
      type: "line",
      data: {
        labels: d.labels,
        datasets: [
          {
            label: "Tasks Completed",
            data: d.completed,
            borderColor: "#818cf8",
            backgroundColor: "rgba(99,102,241,0.12)",
            fill: true,
            tension: 0.35,
            yAxisID: "y",
            borderWidth: 2.5,
            pointRadius: 3,
          },
          {
            label: "Focus Hours",
            data: d.focus,
            borderColor: "#14b8a6",
            backgroundColor: "transparent",
            tension: 0.35,
            yAxisID: "y1",
            borderWidth: 2.5,
            pointRadius: 3,
            borderDash: [5, 4],
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "top", labels: { boxWidth: 12, padding: 16 } },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            type: "linear",
            position: "left",
            grid: { color: gridColor },
            title: { display: true, text: "Tasks", color: "#64748b", font: { size: 11 } },
          },
          y1: {
            type: "linear",
            position: "right",
            grid: { drawOnChartArea: false },
            title: { display: true, text: "Hours", color: "#64748b", font: { size: 11 } },
          },
        },
      },
    });
  }

  renderTrendChart("daily");

  document.querySelectorAll(".trend-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".trend-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderTrendChart(tab.dataset.range);
    });
  });

  // ---------- Custom report builder ----------
  const metricChips = document.querySelectorAll("#metricChips .chip");
  metricChips.forEach((chip) => {
    chip.addEventListener("click", () => chip.classList.toggle("active"));
  });

  const generateBtn = document.getElementById("generateReport");
  const preview = document.getElementById("reportPreview");

  const sampleMetrics = {
    completion: { label: "Completion Rate", value: "84%" },
    tasks: { label: "Tasks Completed", value: "1,024" },
    overdue: { label: "Overdue Tasks", value: "38" },
    cycle: { label: "Avg Cycle Time", value: "3.2 days" },
    workload: { label: "Avg Workload", value: "12.4 tasks" },
  };

  generateBtn?.addEventListener("click", () => {
    const active = [...metricChips]
      .filter((c) => c.classList.contains("active"))
      .map((c) => c.dataset.value);

    if (active.length === 0) {
      showToast("Select at least one metric");
      return;
    }

    const dateRange = document.getElementById("dateRange")?.value || "Last 30 days";
    const employees = document.getElementById("employees")?.value || "All employees";
    const projects = document.getElementById("projects")?.value || "All projects";

    let html = `
      <div class="preview-content">
        <h4>Report Preview</h4>
        <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:1rem">
          ${dateRange} · ${employees} · ${projects}
        </p>
        <div class="preview-metrics">
    `;

    active.forEach((key) => {
      const m = sampleMetrics[key];
      if (m) {
        html += `
          <div class="preview-metric">
            <span>${m.label}</span>
            <strong>${m.value}</strong>
          </div>
        `;
      }
    });

    html += `</div></div>`;
    preview.innerHTML = html;
    showToast("Report generated");
  });

  // ---------- Export buttons ----------
  document.querySelectorAll(".export-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const format = btn.dataset.format?.toUpperCase() || "FILE";
      showToast(`${format} export started — check your downloads`);
    });
  });

  // ---------- Toast ----------
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // ---------- Progress bar animation on scroll ----------
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll(".progress-fill");
          fills.forEach((fill) => {
            const width = fill.style.width;
            fill.style.width = "0%";
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                fill.style.width = width;
              });
            });
          });
          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll(".project-grid").forEach((grid) => progressObserver.observe(grid));
})();