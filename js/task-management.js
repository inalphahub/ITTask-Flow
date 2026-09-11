document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileToggle.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Intersection Observer for fade-up animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Tab switching in Task Details
  const tabs = document.querySelectorAll('.details-tab');
  const tabContent = document.getElementById('tab-content');

  const tabData = {
    info: `
      <p>
        Plan and execute the Q3 product launch campaign across email, social and paid channels.
        Coordinate with design for creative assets and with analytics for performance tracking.
      </p>
      <div class="comment">
        <div class="comment-avatar">AK</div>
        <div class="comment-content">
          <div class="name">Alex Kim <span class="time">2 hours ago</span></div>
          <p>Assets are ready for review. Please check the Figma file and leave comments.</p>
        </div>
      </div>
      <div class="comment">
        <div class="comment-avatar" style="background:linear-gradient(135deg,#16a34a,#15803d)">SR</div>
        <div class="comment-content">
          <div class="name">Sarah Rivera <span class="time">45 min ago</span></div>
          <p>Looks great! Small tweak on the CTA color — otherwise good to go.</p>
        </div>
      </div>
    `,
    activity: `
      <div class="comment">
        <div class="comment-avatar" style="background:linear-gradient(135deg,#4f46e5,#9333ea)">TF</div>
        <div class="comment-content">
          <div class="name">System <span class="time">Today 10:12</span></div>
          <p>Status changed from <strong>Not Started</strong> → <strong>In Progress</strong></p>
        </div>
      </div>
      <div class="comment">
        <div class="comment-avatar">AK</div>
        <div class="comment-content">
          <div class="name">Alex Kim <span class="time">Yesterday</span></div>
          <p>Assigned task to Alex Kim and set due date to Sep 30</p>
        </div>
      </div>
      <div class="comment">
        <div class="comment-avatar" style="background:linear-gradient(135deg,#4f46e5,#9333ea)">TF</div>
        <div class="comment-content">
          <div class="name">System <span class="time">Sep 10</span></div>
          <p>Task created by Alex Kim</p>
        </div>
      </div>
    `,
    comments: `
      <div class="comment">
        <div class="comment-avatar">AK</div>
        <div class="comment-content">
          <div class="name">Alex Kim <span class="time">2 hours ago</span></div>
          <p>Assets are ready for review. Please check the Figma file and leave comments.</p>
        </div>
      </div>
      <div class="comment">
        <div class="comment-avatar" style="background:linear-gradient(135deg,#16a34a,#15803d)">SR</div>
        <div class="comment-content">
          <div class="name">Sarah Rivera <span class="time">45 min ago</span></div>
          <p>Looks great! Small tweak on the CTA color — otherwise good to go.</p>
        </div>
      </div>
      <div class="comment">
        <div class="comment-avatar" style="background:linear-gradient(135deg,#d97706,#b45309)">MJ</div>
        <div class="comment-content">
          <div class="name">Marcus Johnson <span class="time">30 min ago</span></div>
          <p>@SarahRivera Noted — will update the button style before end of day.</p>
        </div>
      </div>
    `,
    files: `
      <p style="color:var(--text-muted);margin-bottom:16px">2 attachments</p>
      <div class="comment">
        <div class="comment-avatar" style="background:linear-gradient(135deg,#2563eb,#1d4ed8)">📄</div>
        <div class="comment-content">
          <div class="name">Campaign_Brief_v2.pdf <span class="time">1.2 MB</span></div>
          <p>Uploaded by Alex Kim · Sep 11</p>
        </div>
      </div>
      <div class="comment">
        <div class="comment-avatar" style="background:linear-gradient(135deg,#9333ea,#7e22ce)">🎨</div>
        <div class="comment-content">
          <div class="name">Creative_Assets.fig <span class="time">Figma link</span></div>
          <p>Uploaded by Sarah Rivera · Sep 12</p>
        </div>
      </div>
    `
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.tab;
      if (tabContent && tabData[key]) {
        tabContent.innerHTML = tabData[key];
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Demo create task button
  const createBtn = document.querySelector('.form-actions .btn-primary');
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Task created successfully! (Demo)');
    });
  }
});