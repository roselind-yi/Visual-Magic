/**
 * 波形渲染模块
 * 负责绘制波形、频谱和数字10效果
 */

export class WaveformRender {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.matrixNumbers = [
      [
        [0,0,1,0,0],
        [0,1,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [1,1,1,1,1]
      ],
      [
        [1,1,1,1,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,1,1,1,1]
      ]
    ];
  }

  /**
   * 绘制波形
   * @param {Uint8Array} dataArray - 时域数据
   */
  draw(dataArray) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 创建渐变
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#2D2A91');
    gradient.addColorStop(1, '#A32E67');
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);

    // 平滑处理音频数据
    const smoothedData = this.smoothData(dataArray, 4);
    
    const sliceWidth = canvas.width * 1.0 / dataArray.length;
    let x = 0;
    for(let i = 0; i < dataArray.length; i++) {
      const v = (smoothedData[i] - 128) / 128.0;
      const isHighFreq = Math.abs(v) > 0.8;
      if (isHighFreq) {
        let weightedSum = 0;
        let weightTotal = 0;
        for (let j = Math.max(0, i - 4); j <= Math.min(dataArray.length - 1, i + 4); j++) {
          let weight = 30 - Math.abs(j - i);
          weightedSum += smoothedData[j] * weight;
          weightTotal += weight;
        }
        smoothedData[i] = weightedSum / weightTotal;
      }
      const y = (smoothedData[i] - 128) / 128.0 * canvas.height/2 + canvas.height/2;
      if(i === 0) {
        ctx.lineTo(x, y);
      } else {
        const prevY = (smoothedData[i-1] - 128) / 128.0 * canvas.height/2 + canvas.height/2;
        const cx = (x + x - sliceWidth)/2;
        const cy = (prevY + y)/2;
        ctx.quadraticCurveTo(cx, cy, x, y);
      }
      x += sliceWidth*0.7;
    }

    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
    ctx.shadowBlur = 15;
    ctx.stroke();
  }

  /**
   * 绘制频谱
   * @param {Uint8Array} dataArray - 频域数据
   */
  drawSpectrum(dataArray) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(1, '#C92027');
      gradient.addColorStop(0.5, '#8A0000');
      gradient.addColorStop(0, '#333333');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  /**
   * 绘制数字10效果
   * @param {Uint8Array} dataArray - 频域数据
   */
  drawNumber10(dataArray) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const baseSize = 80 + (dataArray[50]/255 * 120);
    const spacing = baseSize * 0.15;
    const wavePhase = Date.now() / 500;
    this.drawMatrixDigit(this.matrixNumbers[0], canvas.width/2 - baseSize*3.5, canvas.height/2 - baseSize*1.5, baseSize, spacing, dataArray, wavePhase);
    this.drawMatrixDigit(this.matrixNumbers[1], canvas.width/2 + baseSize*0.5, canvas.height/2 - baseSize*1.5, baseSize, spacing, dataArray, wavePhase + Math.PI);
  }

  /**
   * 绘制矩阵数字
   * @param {Array} matrix - 数字矩阵
   * @param {number} startX - 起始X坐标
   * @param {number} startY - 起始Y坐标
   * @param {number} cellSize - 单元格大小
   * @param {number} spacing - 间距
   * @param {Uint8Array} data - 音频数据
   * @param {number} phase - 相位
   */
  drawMatrixDigit(matrix, startX, startY, cellSize, spacing, data, phase) {
    const ctx = this.ctx;
    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if(cell === 1) {
          const freqIndex = Math.floor((i*row.length + j) * (data.length/25));
          const intensity = data[freqIndex]/255;
          const dynamicSize = cellSize * (0.7 + intensity*0.5 + Math.sin(phase + j*0.5)*0.2);
          const x = startX + j * (cellSize + spacing);
          const y = startY + i * (cellSize + spacing);
          const hue = 200 + (i*0.3 + j*0.2)*30 + phase*50;
          const saturation = 70 + intensity * 30;
          const lightness = 40 + intensity * 30 + Math.sin(phase*2 + j)*10;
          ctx.beginPath();
          ctx.arc(x + cellSize/2, y + cellSize/2, dynamicSize * 1.2, 0, Math.PI*2);
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, 50%, ${0.1 * intensity})`;
          ctx.fill();
          const gradient = ctx.createRadialGradient(x + cellSize/2, y + cellSize/2, 0, x + cellSize/2, y + cellSize/2, dynamicSize/2);
          gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
          gradient.addColorStop(1, `hsl(${hue}, ${saturation + 20}%, ${lightness - 20}%)`);
          ctx.beginPath();
          ctx.arc(x + cellSize/2, y + cellSize/2, dynamicSize/2, 0, Math.PI*2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });
    });
  }

  /**
   * 平滑数据
   * @param {Uint8Array} data - 原始数据
   * @param {number} windowSize - 窗口大小
   * @returns {Array} 平滑后的数据
   */
  smoothData(data, windowSize) {
    const smoothed = [];
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j <= Math.min(data.length - 1, i + windowSize); j++) {
        sum += data[j];
        count++;
      }
      smoothed[i] = sum / count;
    }
    return smoothed;
  }
}