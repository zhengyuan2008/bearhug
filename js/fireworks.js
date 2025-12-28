/* ========================================
   烟花动画效果 - 柔和粉色系
   ======================================== */

function createFireworks() {
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworks-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = [
    '#ffc0cb', // 粉色
    '#ffb6c1', // 淡粉
    '#ff69b4', // 热情粉
    '#dda0dd', // 梅花粉
    '#e6b3ff', // 淡紫
    '#c8b3ff', // 薰衣草
    '#ffd1dc'  // 樱花粉
  ];

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = Math.random() * 3 + 2;
      this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
      };
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015;
      this.gravity = 0.15;
    }

    update() {
      this.velocity.y += this.gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();

      // 添加光晕效果
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius * 2
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(0.5, this.color + '80');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // 中心亮点
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    isAlive() {
      return this.alpha > 0;
    }
  }

  function createExplosion(x, y) {
    const particleCount = 30 + Math.random() * 20;
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();

      if (!particles[i].isAlive()) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      // 所有烟花结束，移除canvas
      setTimeout(() => {
        canvas.remove();
      }, 500);
    }
  }

  // 创建多个烟花效果
  const explosionCount = 5;
  const delays = [0, 200, 400, 600, 800];

  delays.forEach((delay, index) => {
    setTimeout(() => {
      const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
      const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
      createExplosion(x, y);

      if (index === 0) {
        animate();
      }
    }, delay);
  });
}

// 页面加载时触发烟花
window.addEventListener('load', () => {
  setTimeout(() => {
    createFireworks();
  }, 300);
});
