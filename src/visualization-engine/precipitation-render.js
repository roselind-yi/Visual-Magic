/**
 * 降水渲染模块
 * 负责绘制雨滴可视化效果
 */

export class PrecipitationRender {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.precipitation = [];
    this.config = {
      color: [190, 80, 60],
      density: 0.1,
      sizeRange: [2, 5],
      speedRange: [1.5, 3],
    };
  }

  /**
   * 绘制雨滴
   * @param {Uint8Array} dataArray - 频域数据
   */
  draw(dataArray) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 根据音频数据调整雨滴密度
    const avgIntensity = dataArray.reduce((a, v) => a + v, 0) / dataArray.length;
    const dynamicDensity = this.config.density * (1 + avgIntensity / 255 * 2);
    
    // 创建新雨滴
    if(Math.random() < dynamicDensity) {
      this.precipitation.push({
        x: Math.random() * canvas.width,
        y: -50,
        size: (Math.random() * (this.config.sizeRange[1] - this.config.sizeRange[0])) + this.config.sizeRange[0],
        speed: (Math.random() * (this.config.speedRange[1] - this.config.speedRange[0])) + this.config.speedRange[0],
        color: `hsl(${this.config.color[0]}, ${this.config.color[1]}%, ${this.config.color[2]}%)`
      });
    }
    
    // 更新和绘制雨滴
    this.precipitation = this.precipitation.filter(drop => {
      // 根据音频强度调整下落速度
      const speedFactor = 1 + (avgIntensity / 255);
      drop.y += drop.speed * speedFactor;
      
      // 移除超出画布的雨滴
      if (drop.y > canvas.height) return false;
      
      // 绘制雨滴
      ctx.beginPath();
      ctx.ellipse(drop.x, drop.y, drop.size, drop.size * 0.6, 0, 0, 2 * Math.PI);
      ctx.fillStyle = drop.color;
      ctx.fill();
      
      return true;
    });
  }

  /**
   * 调整画布大小
   */
  resize() {
    // 雨滴效果会根据画布大小自动调整
  }

  /**
   * 清空雨滴
   */
  clear() {
    this.precipitation = [];
  }
}