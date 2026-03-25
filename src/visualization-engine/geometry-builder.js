/**
 * 几何构建模块
 * 负责绘制几何图形可视化效果
 */

export class GeometryBuilder {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  /**
   * 绘制几何图形
   * @param {Uint8Array} dataArray - 频域数据
   */
  draw(dataArray) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    // 绘制外圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201, 32, 39, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制多边形
    const sides = 12;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI / sides) + (Math.PI / 2);
      const distance = radius + ((dataArray[i * 2] / 255) * 50);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = '#C92027';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 绘制连接线
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle1 = (i * 2 * Math.PI / sides) + (Math.PI / 2);
      const distance1 = radius + ((dataArray[i * 2] / 255) * 50);
      const x1 = centerX + Math.cos(angle1) * distance1;
      const y1 = centerY + Math.sin(angle1) * distance1;
      for (let j = i + 1; j < sides; j++) {
        const angle2 = (j * 2 * Math.PI / sides) + (Math.PI / 2);
        const distance2 = radius + ((dataArray[j * 2] / 255) * 50);
        const x2 = centerX + Math.cos(angle2) * distance2;
        const y2 = centerY + Math.sin(angle2) * distance2;
        if (Math.abs(j - i) <= 3) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }
    }
    ctx.strokeStyle = 'rgba(201, 32, 39, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /**
   * 调整画布大小
   */
  resize() {
    // 几何图形会根据画布大小自动调整
  }
}