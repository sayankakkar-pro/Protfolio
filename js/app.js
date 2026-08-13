// Main Application Orchestrator & SLY Cinematic Micro-Interactions
(function() {
  function initApp() {
    // 1. Initialize Audio Engine safely
    try {
      if (typeof SoundSynthesizer !== 'undefined') {
        window.soundFX = new SoundSynthesizer();
      }
    } catch (e) {
      console.warn("Audio init error:", e);
    }

    // 2. SLY Cinematic Preloader with progressive reveal
    const preloader = document.getElementById('preloader');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderBar = document.getElementById('loader-bar');
    const loaderStatus = document.getElementById('loader-status');

    function dismissPreloader() {
      if (preloader && !preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
        setTimeout(() => {
          preloader.style.display = 'none';
          preloader.style.pointerEvents = 'none';
          window.dispatchEvent(new Event('resize'));
        }, 800);
      }
    }

    const autoDismissTimer = setTimeout(dismissPreloader, 1300);

    const statusMessages = [
      "INITIALIZING SYSTEM KERNEL...",
      "CALIBRATING ROS 2 HARDWARE BUS...",
      "LOADING 3D THREE.JS WEBGL KERNEL...",
      "SYNCHRONIZING LIDAR TELEMETRY...",
      "SAYAN KAKKAR // READY"
    ];

    let currentPercent = 0;
    const loadInterval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 8) + 6;
      if (currentPercent > 100) currentPercent = 100;

      if (loaderPercent) loaderPercent.textContent = `${String(currentPercent).padStart(3, '0')}%`;
      if (loaderBar) loaderBar.style.width = `${currentPercent}%`;

      const msgIdx = Math.min(Math.floor((currentPercent / 100) * statusMessages.length), statusMessages.length - 1);
      if (loaderStatus) loaderStatus.textContent = statusMessages[msgIdx];

      if (currentPercent >= 100) {
        clearInterval(loadInterval);
        clearTimeout(autoDismissTimer);
        setTimeout(dismissPreloader, 200);
      }
    }, 25);

    // 3. Initialize 3D Hero Scene safely
    try {
      if (typeof Hero3DScene !== 'undefined' && document.getElementById('hero-canvas-container')) {
        const hero3D = new Hero3DScene('hero-canvas-container');
        const wireframeBtn = document.getElementById('hero-wireframe-toggle');
        if (wireframeBtn) {
          wireframeBtn.addEventListener('click', () => {
            const isWire = hero3D.toggleWireframe();
            wireframeBtn.textContent = isWire ? 'SHADED' : 'WIREFRAME';
            if (window.soundFX) window.soundFX.playClick();
          });
        }
      }
    } catch (e) {
      console.warn("Hero 3D init error:", e);
    }

    // 4. Initialize 3D AGV Vehicle Viewer safely
    try {
      if (typeof AGV3DViewer !== 'undefined' && document.getElementById('agv-3d-container')) {
        const agvViewer = new AGV3DViewer('agv-3d-container', 'agv-subsystem-detail');

        const explodeBtn = document.getElementById('agv-explode-btn');
        if (explodeBtn) {
          explodeBtn.addEventListener('click', () => {
            const isExp = agvViewer.toggleExplode();
            explodeBtn.querySelector('span').textContent = isExp ? 'COLLAPSE MODEL' : 'EXPLODE BLUEPRINT';
          });
        }

        const agvWireBtn = document.getElementById('agv-wireframe-btn');
        if (agvWireBtn) {
          agvWireBtn.addEventListener('click', () => {
            const isWire = agvViewer.toggleWireframe();
            agvWireBtn.querySelector('span').textContent = isWire ? 'SOLID SHADER' : 'TOGGLE X-RAY';
          });
        }

        document.querySelectorAll('.subsystem-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const sys = btn.dataset.subsystem;
            if (sys && agvViewer) {
              agvViewer.selectSubsystem(sys);
              if (window.soundFX) window.soundFX.playClick();
            }
          });
        });
      }
    } catch (e) {
      console.warn("AGV 3D init error:", e);
    }

    // 5. Initialize Robotics Lab Playgrounds safely
    try {
      if (typeof PIDControllerLab !== 'undefined' && document.getElementById('pid-canvas')) {
        new PIDControllerLab('pid-canvas');
      }
      if (typeof LiDARRadarLab !== 'undefined' && document.getElementById('radar-canvas')) {
        new LiDARRadarLab('radar-canvas');
      }
    } catch (e) {
      console.warn("Robotics lab init error:", e);
    }

    // 6. Initialize SAYAN-OS Cyber Terminal safely
    try {
      if (typeof CyberTerminal !== 'undefined' && document.getElementById('cyber-terminal')) {
        new CyberTerminal('cyber-terminal');
      }
    } catch (e) {
      console.warn("Terminal init error:", e);
    }

    // 7. Side-Loading Scroll Reveal Observer
    try {
      const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      }, { threshold: 0.12 });

      revealElements.forEach(el => revealObserver.observe(el));
    } catch (e) {
      console.warn("Scroll reveal init error:", e);
    }

    // 8. 3D Card Interactive Tilt & SLY Radial Spotlight Tracker
    try {
      document.querySelectorAll('.sly-card, .feature-box, .counter-box').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -4;
          const rotateY = ((x - centerX) / centerX) * 4;

          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    } catch (e) {
      console.warn("Card tilt init error:", e);
    }

    // 9. Interactive "About Me" Tab Switcher
    try {
      const tabBtns = document.querySelectorAll('.about-tab-btn');
      const tabPanes = document.querySelectorAll('.about-tab-pane');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.dataset.tab;
          tabBtns.forEach(b => b.classList.remove('active'));
          tabPanes.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const activePane = document.getElementById(`tab-${targetTab}`);
          if (activePane) activePane.classList.add('active');

          if (window.soundFX) window.soundFX.playClick();
        });
      });
    } catch (e) {
      console.warn("About tabs init error:", e);
    }

    // 10. SLY Magnetic Smooth Cursor
    try {
      const cursorDot = document.querySelector('.cursor-dot');
      const cursorCircle = document.querySelector('.cursor-circle');
      let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      let circlePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;

        if (cursorDot) {
          cursorDot.style.left = `${mousePos.x}px`;
          cursorDot.style.top = `${mousePos.y}px`;
        }
      });

      function renderCursor() {
        circlePos.x += (mousePos.x - circlePos.x) * 0.18;
        circlePos.y += (mousePos.y - circlePos.y) * 0.18;

        if (cursorCircle) {
          cursorCircle.style.left = `${circlePos.x}px`;
          cursorCircle.style.top = `${circlePos.y}px`;
        }
        requestAnimationFrame(renderCursor);
      }
      renderCursor();

      document.querySelectorAll('a, button, input, textarea, .sly-card, .feature-box, .subsystem-btn, .cmd-chip, .about-tab-btn, .counter-box').forEach(el => {
        el.addEventListener('mouseenter', () => {
          if (cursorCircle) cursorCircle.classList.add('cursor-grow');
          if (window.soundFX) window.soundFX.playHover();
        });
        el.addEventListener('mouseleave', () => {
          if (cursorCircle) cursorCircle.classList.remove('cursor-grow');
        });
      });
    } catch (e) {
      console.warn("Cursor init error:", e);
    }

    // 11. Sound Toggle Button
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        if (window.soundFX) {
          const isEnabled = window.soundFX.toggleSound();
          soundToggle.classList.toggle('muted', !isEnabled);
          const stateText = soundToggle.querySelector('.sound-state');
          if (stateText) stateText.textContent = isEnabled ? 'AUDIO ON' : 'MUTED';
          if (isEnabled) window.soundFX.playClick();
        }
      });
    }

    // 12. Telemetry Live Clock & Uptime
    function updateTelemetry() {
      const clockEl = document.getElementById('telemetry-clock');
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST (UTC+5:30)';
      }

      const uptimeEl = document.getElementById('telemetry-uptime');
      if (uptimeEl) {
        const hours = Math.floor((performance.now() / 1000) / 3600);
        const mins = Math.floor(((performance.now() / 1000) % 3600) / 60);
        const secs = Math.floor((performance.now() / 1000) % 60);
        uptimeEl.textContent = `SYSTEM UPTIME: ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }
    setInterval(updateTelemetry, 1000);
    updateTelemetry();

    // 13. Header scroll glass blur
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // 14. Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-nav-menu');
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        if (window.soundFX) window.soundFX.playClick();
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
        });
      });
    }

    // 15. Instant Email Copy with Toast Alert
    document.querySelectorAll('.copy-email-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'sayankakkar@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`);
          if (window.soundFX) window.soundFX.playClick();
        }).catch(() => {
          window.location.href = `mailto:${email}`;
        });
      });
    });

    // 16. Interactive Contact Form Dispatch
    const contactForm = document.getElementById('cyber-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        showToast(`Dispatch transmitted successfully, ${name}! Sayan will connect soon.`);
        if (window.soundFX) window.soundFX.playClick();
        contactForm.reset();
      });
    }

    // 17. SLY Brief Studio Configurator Logic
    try {
      let selectedDomain = 'Autonomous AGV Logistics';
      let selectedTime = 'Rapid Sprint (1-2 Weeks)';
      let selectedHw = 'ROS 2 + Physical HW';

      const briefDomainDesc = {
        'Autonomous AGV Logistics': 'Architecture includes 360° RPLiDAR S2 SLAM navigation, ROS 2 Humble node orchestration, TEB local trajectory planner, and safety fallback loop.',
        'Edge AI & Computer Vision': 'Edge AI pipeline with NVIDIA Jetson Orin Nano, TensorRT model quantization, YOLOv8 object segmentation, and real-time inference at 45 FPS.',
        'Full-Stack Web Platform': 'Production Next.js / TypeScript web application with WebSocket telemetry feeds, high-performance UI components, and resilient cloud architecture.',
        'National Hackathon Collaboration': 'High-velocity prototype development, real-time physics engine, API orchestration, and technical pitch deck architecture.'
      };

      function updateBriefBlueprint() {
        const titleEl = document.getElementById('brief-summary-title');
        const descEl = document.getElementById('brief-summary-desc');
        const metaEl = document.getElementById('brief-meta-output');

        if (titleEl) titleEl.textContent = selectedDomain;
        if (descEl) descEl.textContent = briefDomainDesc[selectedDomain] || 'Custom engineered architecture tailored to your specifications.';
        if (metaEl) metaEl.innerHTML = `ESTIMATED TIMELINE: ${selectedTime}<br>CORE PIPELINE: ${selectedHw}`;
      }

      document.querySelectorAll('.brief-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.brief-option-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedDomain = btn.dataset.type;
          updateBriefBlueprint();
          if (window.soundFX) window.soundFX.playClick();
        });
      });

      document.querySelectorAll('.brief-timeline-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.brief-timeline-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedTime = btn.dataset.time;
          updateBriefBlueprint();
          if (window.soundFX) window.soundFX.playClick();
        });
      });

      document.querySelectorAll('.brief-hw-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.brief-hw-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedHw = btn.dataset.hw;
          updateBriefBlueprint();
          if (window.soundFX) window.soundFX.playClick();
        });
      });
    } catch (e) {
      console.warn("Brief studio init error:", e);
    }

    function showToast(text) {
      let toast = document.querySelector('.cyber-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'cyber-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span class="hud-dot"></span><span>${text}</span>`;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
