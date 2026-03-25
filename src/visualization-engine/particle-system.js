/**
 * 粒子系统模块
 * 负责粒子效果的渲染和更新
 */

import { noise } from '../utils.js';

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 800;
    this.currentSeason = 'spring';
    this.seasonConfig = {
      spring: { wind: 0.5 },
      summer: { wind: 1.2 },
      autumn: { wind: 0.8 },
      winter: { wind: 0.3 }
    };
    this.initParticles();
  }

  /**
   * 初始化粒子
   */
  initParticles() {
    this.particles.length = 0;
    const canvas = this.canvas;
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        alpha: Math.random() * 0.6 + 0.4
      });
    }
  }

  /**
   * 更新粒子系统
   * @param {Uint8Array} dataArray - 频域数据
   */
  update(dataArray) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const dataIndex = Math.floor((i / this.particleCount) * dataArray.length);
      const speedFactor = (dataArray[dataIndex] / 255) * 2;
      p.x += p.speedX * speedFactor;
      p.y += p.speedY * speedFactor;

      const noiseValue = noise.simplex2(p.x/500, Date.now()/5000);
      p.x += this.seasonConfig[this.currentSeason].wind * (0.5 + noiseValue * 1.5);

      // 边界检查
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // 绘制粒子
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /**
   * 设置季节
   * @param {string} season - 季节名称
   */
  setSeason(season) {
    if (this.seasonConfig[season]) {
      this.currentSeason = season;
    }
  }

  /**
   * 调整画布大小
   */
  resize() {
    this.initParticles();
  }
}