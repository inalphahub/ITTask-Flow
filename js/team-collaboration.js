document.addEventListener('DOMContentLoaded', () => {
  // ===== Workspace tabs =====
  const tabs = document.querySelectorAll('.ws-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const content = document.getElementById(`${target}-tab`);
      if (content) content.classList.add('active');
    });
  });

  // ===== Project list interaction =====
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    item.addEventListener('click', () => {
      projectItems.forEach(p => p.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ===== Scroll reveal animations =====
  const fadeUps = document.querySelectorAll('.fade-up');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeUps.forEach(el => observer.observe(el));

  // ===== Task check interaction (demo) =====
  document.querySelectorAll('.task-check.empty').forEach(check => {
    check.addEventListener('click', function () {
      this.classList.remove('empty');
      this.innerHTML = '<i class="fas fa-check"></i>';
      const taskItem = this.closest('.task-item');
      if (taskItem) {
        const title = taskItem.querySelector('h5');
        if (title) {
          title.style.textDecoration = 'line-through';
          title.style.opacity = '0.6';
        }
      }
    });
  });

});