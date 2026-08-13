// Interactive Cyber Terminal Shell (SAYAN-OS v3.2)
class CyberTerminal {
  constructor(terminalContainerId) {
    this.container = document.getElementById(terminalContainerId);
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    if (!this.container || !this.input) return;

    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => `
<span class="text-cyan">AVAILABLE COMMANDS:</span>
  <span class="text-emerald">achievements</span>   - View hackathon podiums, Delhi Govt Top 100 selection & IIIT Boot Camp
  <span class="text-emerald">agv</span>            - View autonomous factory vehicle robotics architecture & telemetry specs
  <span class="text-emerald">skills</span>         - Print hardware, AI & software technology matrix
  <span class="text-emerald">about</span>          - Print background bio (Sayan Kakkar // SOSE Shalimar Bagh, Class 10)
  <span class="text-emerald">lab</span>            - Jump to interactive PID & LiDAR radar playgrounds
  <span class="text-emerald">contact</span>        - Get direct email, phone & GitHub endpoints
  <span class="text-emerald">clear</span>          - Clear terminal history
  <span class="text-emerald">matrix</span>         - Toggle cybernetic matrix visual mode
  <span class="text-emerald">sound</span>          - Toggle global UI audio effects
      `,

      achievements: () => `
<span class="text-yellow">🏆 HALL OF ACHIEVEMENTS &amp; ACCOLADES:</span>
1. <span class="text-cyan">[DELHI GOVT ELITE SELECTION]</span>: Selected in <span class="text-emerald">Top 100 students out of 33,000+</span> applicants across Delhi for the 21-Day Intensive Robotics Boot Camp at <span class="text-purple">IIIT Delhi</span> (Top 0.3% tier).
2. <span class="text-cyan">[TAKUMI HACKATHON]</span>: Secured <span class="text-yellow">5th Position Nationwide</span> building full-stack automated solutions under intense competition.
3. <span class="text-cyan">[AAROH INDIA HACKATHON]</span>: Secured <span class="text-yellow">3rd Position</span> in Game Development &amp; Physics Simulation.
4. <span class="text-cyan">[AUTONOMOUS FACTORY AGV]</span>: Engineered an industrial logistics robot with LiDAR SLAM, obstacle avoidance &amp; differential drive.
5. <span class="text-cyan">[STARTUP CLIENT PLATFORMS]</span>: Engineered and shipped production web applications for 2 startups (under NDA).
      `,

      agv: () => `
<span class="text-cyan">🚗 AUTONOMOUS FACTORY TRANSPORT VEHICLE (AGV) SPECS:</span>
  ● <span class="text-emerald">Compute</span>: NVIDIA Jetson Orin Nano + Quad ARM Cortex (40 TOPS AI)
  ● <span class="text-emerald">Perception</span>: 360° RPLiDAR S2 (32,000 pts/sec) + 8x Ultrasonic Mesh Array
  ● <span class="text-emerald">Drive System</span>: 4x 250W Brushless Planetary DC Motors with 4096-PPR Encoders
  ● <span class="text-emerald">Navigation Stack</span>: ROS 2 Humble, Nav2, Cartographer SLAM, Adaptive PID
  ● <span class="text-emerald">Payload</span>: 150 kg industrial payload capacity
  ● <span class="text-emerald">Safety</span>: Hardware SIL-2 E-Stop + Triple-layer Ultrasonic fail-safe zone
      `,

      skills: () => `
<span class="text-purple">⚡ CAPABILITIES &amp; TECH MATRIX:</span>
  • <span class="text-cyan">Languages</span>: Python, JavaScript (ES6+), TypeScript, C/C++ (Embedded), HTML5, CSS3
  • <span class="text-cyan">Software</span>: React, Next.js, Node.js, Express, REST APIs, WebSockets, MongoDB, Git
  • <span class="text-cyan">Robotics &amp; HW</span>: ROS/ROS2, LiDAR, ESP32, Arduino, Sensor Fusion, Motor Drivers
  • <span class="text-cyan">AI &amp; Automation</span>: Agentic Workflows, LLM Routing, Automation, Computer Vision
      `,

      about: () => `
<span class="text-cyan">SAYAN KAKKAR</span> - Student Systems Developer &amp; Robotics/AI Engineer
School: <span class="text-emerald">SOSE Shalimar Bagh (Class 10)</span>
Philosophy: <span class="text-yellow">"I don't just understand technology. I build working physical &amp; digital reality."</span>
      `,

      contact: () => `
<span class="text-cyan">📬 CONTACT &amp; CONNECT:</span>
  • Email:  <a href="mailto:sayankakkar@gmail.com" class="text-emerald underline">sayankakkar@gmail.com</a>
  • Phone:  <a href="tel:7042368060" class="text-cyan underline">7042368060</a>
  • GitHub: <a href="https://github.com/sayankakkar-pro" target="_blank" class="text-purple underline">github.com/sayankakkar-pro</a>
      `,

      clear: () => {
        if (this.output) this.output.innerHTML = '';
        return null;
      },

      sound: () => {
        if (window.soundFX) {
          const state = window.soundFX.toggleSound();
          return `Global Audio FX: <span class="${state ? 'text-emerald' : 'text-red'}">${state ? 'ENABLED' : 'MUTED'}</span>`;
        }
        return 'Audio engine not loaded.';
      },

      matrix: () => {
        document.body.classList.toggle('matrix-glow-mode');
        return '<span class="text-emerald">Matrix mode toggled. Visual telemetry boosted.</span>';
      },

      sudo: () => `<span class="text-red">Permission Denied: Sayan is already operating with root cyber privileges.</span>`
    };

    this.init();
  }

  init() {
    this.input.addEventListener('keydown', (e) => {
      if (window.soundFX) window.soundFX.playTerminalKey();

      if (e.key === 'Enter') {
        const cmdText = this.input.value.trim();
        this.input.value = '';
        if (cmdText) {
          this.execute(cmdText);
          this.history.push(cmdText);
          this.historyIndex = this.history.length;
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    // Quick Command Tag Buttons
    document.querySelectorAll('.cmd-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        if (cmd) {
          this.execute(cmd);
          if (window.soundFX) window.soundFX.playClick();
        }
      });
    });

    // Initial greeting
    this.printLine(`
<span class="text-cyan">SAYAN-OS v3.2 [ROBOTICS &amp; FULL-STACK AI KERNEL]</span>
Type <span class="text-emerald">"help"</span> or click the command chips below to query system metrics.
    `);
  }

  execute(cmdRaw) {
    const cleanCmd = cmdRaw.toLowerCase().trim();
    this.printLine(`<span class="text-white/40">&gt;</span> <span class="text-yellow">${cmdRaw}</span>`);

    if (this.commands[cleanCmd]) {
      const result = this.commands[cleanCmd]();
      if (result) this.printLine(result);
    } else {
      this.printLine(`<span class="text-red">Command not recognized: "${cmdRaw}". Type <span class="text-cyan">"help"</span> for a list of valid commands.</span>`);
    }

    if (this.output) {
      this.output.scrollTop = this.output.scrollHeight;
    }
  }

  printLine(html) {
    if (!this.output) return;
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = html;
    this.output.appendChild(div);
  }
}

window.CyberTerminal = CyberTerminal;
