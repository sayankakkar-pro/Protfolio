// Interactive Robotics Lab: PID Controller Simulator & LiDAR 360° Radar
class PIDControllerLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.kpInput = document.getElementById('pid-kp');
    this.kiInput = document.getElementById('pid-ki');
    this.kdInput = document.getElementById('pid-kd');
    this.kpVal = document.getElementById('kp-val');
    this.kiVal = document.getElementById('ki-val');
    this.kdVal = document.getElementById('kd-val');

    this.kp = parseFloat(this.kpInput?.value || 1.8);
    this.ki = parseFloat(this.kiInput?.value || 0.04);
    this.kd = parseFloat(this.kdInput?.value || 0.95);

    // State Variables
    this.currentY = 150;
    this.velocityY = 0;
    this.targetY = 70;
    this.prevError = 0;
    this.integral = 0;
    this.history = [];
    this.maxHistory = 180;
    this.stepCount = 0;

    this.init();
  }

  init() {
    // Setup High-DPI canvas
    this.setupCanvas();

    const updateLabels = () => {
      if (this.kpVal) this.kpVal.textContent = this.kp.toFixed(2);
      if (this.kiVal) this.kiVal.textContent = this.ki.toFixed(3);
      if (this.kdVal) this.kdVal.textContent = this.kd.toFixed(2);
    };

    if (this.kpInput) this.kpInput.addEventListener('input', (e) => { this.kp = parseFloat(e.target.value); updateLabels(); });
    if (this.kiInput) this.kiInput.addEventListener('input', (e) => { this.ki = parseFloat(e.target.value); updateLabels(); });
    if (this.kdInput) this.kdInput.addEventListener('input', (e) => { this.kd = parseFloat(e.target.value); updateLabels(); });

    // Presets
    document.querySelectorAll('.pid-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.preset;
        if (type === 'optimal') { this.kp = 1.8; this.ki = 0.04; this.kd = 0.95; }
        else if (type === 'oscillate') { this.kp = 3.6; this.ki = 0.18; this.kd = 0.1; }
        else if (type === 'sluggish') { this.kp = 0.5; this.ki = 0.01; this.kd = 1.8; }
        
        if (this.kpInput) this.kpInput.value = this.kp;
        if (this.kiInput) this.kiInput.value = this.ki;
        if (this.kdInput) this.kdInput.value = this.kd;
        updateLabels();
        this.currentY = 150; this.velocityY = 0; this.integral = 0; this.prevError = 0;
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    updateLabels();
    this.animate();
  }

  setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 540;
    const h = 220;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = w;
    this.height = h;
  }

  animate() {
    this.stepCount++;

    // Switch target periodically
    if (this.stepCount % 150 === 0) {
      this.targetY = this.targetY === 70 ? 160 : 70;
    }

    // PID Math
    const error = this.targetY - this.currentY;
    this.integral += error * 0.05;
    this.integral = Math.max(-80, Math.min(80, this.integral));
    const derivative = (error - this.prevError) / 0.05;
    this.prevError = error;

    const controlSignal = (this.kp * error) + (this.ki * this.integral) + (this.kd * derivative);
    this.velocityY += controlSignal * 0.018;
    this.velocityY *= 0.91; // Friction
    this.currentY += this.velocityY;

    this.history.push({ current: this.currentY, target: this.targetY });
    if (this.history.length > this.maxHistory) this.history.shift();

    // Render Canvas
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Background Gradient & Grid
    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Target Setpoint Line (Peach Glow)
    ctx.strokeStyle = '#f2a98c';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.targetY);
    ctx.lineTo(w, this.targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Target Label
    ctx.fillStyle = '#f2a98c';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`SETPOINT TARGET: ${Math.round(this.targetY)}px`, 12, this.targetY - 8);

    // Dynamic History Path (Cyan Glow)
    if (this.history.length > 1) {
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let i = 0; i < this.history.length; i++) {
        const x = (i / this.maxHistory) * (w - 40);
        if (i === 0) ctx.moveTo(x, this.history[i].current);
        else ctx.lineTo(x, this.history[i].current);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Current Vehicle Head
      const lastX = ((this.history.length - 1) / this.maxHistory) * (w - 40);
      const lastY = this.history[this.history.length - 1].current;
      
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Telemetry HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`ERROR: ${error.toFixed(1)}px | PWM_OUT: ${controlSignal.toFixed(1)}`, 14, h - 12);
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}

// 2D LiDAR 360° Radar Obstacle Avoidance Sandbox
class LiDARRadarLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.sweepAngle = 0;
    this.selectedObstacle = null;

    this.init();
  }

  init() {
    this.setupCanvas();

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.obstacles = [
      { x: centerX - 85, y: centerY - 45, r: 18, vx: 0.6, vy: 0.4 },
      { x: centerX + 80, y: centerY + 40, r: 22, vx: -0.5, vy: 0.3 },
      { x: centerX + 75, y: centerY - 55, r: 16, vx: 0.3, vy: -0.5 }
    ];

    // Mouse Interaction: Drag & Spawn Obstacles
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * this.width;
      const my = ((e.clientY - rect.top) / rect.height) * this.height;

      for (let ob of this.obstacles) {
        const dist = Math.hypot(mx - ob.x, my - ob.y);
        if (dist <= ob.r + 10) {
          this.selectedObstacle = ob;
          if (window.soundFX) window.soundFX.playHover();
          break;
        }
      }

      if (!this.selectedObstacle && this.obstacles.length < 6) {
        this.obstacles.push({ x: mx, y: my, r: 18, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 });
        if (window.soundFX) window.soundFX.playClick();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.selectedObstacle) return;
      const rect = this.canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * this.width;
      const my = ((e.clientY - rect.top) / rect.height) * this.height;
      this.selectedObstacle.x = Math.max(30, Math.min(this.width - 30, mx));
      this.selectedObstacle.y = Math.max(30, Math.min(this.height - 30, my));
    });

    window.addEventListener('mouseup', () => {
      this.selectedObstacle = null;
    });

    this.animate();
  }

  setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 540;
    const h = 220;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = w;
    this.height = h;
  }

  animate() {
    this.sweepAngle += 0.05;
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Radar Dark Grid
    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, w, h);

    // Concentric Range Rings (SLY Peach / White)
    ctx.strokeStyle = 'rgba(242, 169, 140, 0.18)';
    ctx.lineWidth = 1;
    [35, 65, 95, 125].forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(242, 169, 140, 0.5)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`${(idx + 1) * 0.5}m`, centerX + r + 2, centerY - 4);
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(centerX - 135, centerY); ctx.lineTo(centerX + 135, centerY);
    ctx.moveTo(centerX, centerY - 100); ctx.lineTo(centerX, centerY + 100);
    ctx.stroke();

    // Move and Draw Obstacles
    this.obstacles.forEach(ob => {
      if (!this.selectedObstacle || this.selectedObstacle !== ob) {
        ob.x += ob.vx;
        ob.y += ob.vy;
        if (ob.x < 30 || ob.x > w - 30) ob.vx *= -1;
        if (ob.y < 30 || ob.y > h - 30) ob.vy *= -1;
      }

      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ob.x, ob.y, ob.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`OBS`, ob.x - 8, ob.y + 3);
    });

    // 360° LiDAR Raycast Simulation
    const rayCount = 72;
    let minDistance = 999;

    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      let maxRayDist = 130;

      for (let ob of this.obstacles) {
        const dx = ob.x - centerX;
        const dy = ob.y - centerY;
        const obDist = Math.hypot(dx, dy);
        const obAngle = Math.atan2(dy, dx);
        
        let diffAngle = Math.abs(angle - obAngle);
        while (diffAngle > Math.PI) diffAngle = Math.abs(diffAngle - Math.PI * 2);

        if (diffAngle < Math.asin(ob.r / obDist)) {
          const hitDist = obDist - ob.r;
          if (hitDist < maxRayDist) {
            maxRayDist = Math.max(8, hitDist);
          }
        }
      }

      if (maxRayDist < minDistance) {
        minDistance = maxRayDist;
      }

      const hitX = centerX + Math.cos(angle) * maxRayDist;
      const hitY = centerY + Math.sin(angle) * maxRayDist;

      // Draw Laser Point
      ctx.fillStyle = maxRayDist < 50 ? '#ef4444' : '#00f0ff';
      ctx.beginPath();
      ctx.arc(hitX, hitY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Radar Sweep Line
    const sweepX = centerX + Math.cos(this.sweepAngle) * 130;
    const sweepY = centerY + Math.sin(this.sweepAngle) * 130;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(sweepX, sweepY);
    ctx.stroke();

    // Central Robot Indicator
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Safety Alert HUD
    ctx.fillStyle = minDistance < 45 ? '#ef4444' : '#10b981';
    ctx.font = '11px JetBrains Mono, monospace';
    const warning = minDistance < 45 ? '⚠️ HAZARD ALERT: CLOSE PROXIMITY' : '● RADAR STATUS: CLEAR PATHWAY';
    ctx.fillText(`${warning} | MIN RANGE: ${(minDistance / 35).toFixed(2)}m`, 14, h - 12);

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.PIDControllerLab = PIDControllerLab;
window.LiDARRadarLab = LiDARRadarLab;
window.RoboticsLab = class {
  constructor() {
    new PIDControllerLab('pid-canvas');
    new LiDARRadarLab('radar-canvas');
  }
};
