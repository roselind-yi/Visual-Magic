/**
 * 键盘映射模块
 * 负责绘制键盘可视化效果
 */

export class KeyboardMapper {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.keyboardKeys = [];
    this.keyboardLayout = [
      [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ];
    this.initKeyboard();
  }

  /**
   * 初始化键盘
   */
  initKeyboard() {
    this.keyboardKeys = [];
    const canvas = this.canvas;
    const keyWidth = canvas.width / 16;
    const keyHeight = canvas.height / 4;
    for(let i = 0; i < 16; i++) {
      this.keyboardKeys.push({
        x: i * keyWidth,
        y: canvas.height/2 - keyHeight/2,
        width: keyWidth * 0.9,
        height: keyHeight,
        pressed: false
      });
    }
  }

  /**
   * 绘制键盘
   * @param {Uint8Array} dataArray - 频域数据
   */
  draw(dataArray) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(this.keyboardKeys.length === 0) {
      this.initKeyboard();
    }
    
    this.keyboardKeys.forEach((key, index) => {
      const freqIndex = Math.floor(index * (dataArray.length/this.keyboardKeys.length));
      const intensity = Math.min(dataArray[freqIndex]/255 * 1.5, 1);
      const wavePhase = Math.sin(Date.now()/200 + index*0.3);
      key.pressed = intensity > 0.6;
      const pressDepth = key.pressed ? 4 : 0;
      const keyScale = 1 + intensity * 0.2;
      const colorHue = 220 + wavePhase * 30 + intensity * 40;
      
      ctx.save();
      ctx.translate(key.x + key.width/2, key.y + key.height/2);
      ctx.scale(keyScale, keyScale);
      
      // 绘制按键阴影
      ctx.beginPath();
      ctx.roundRect(
        -key.width/2 - 2,
        -key.height/2 - 2,
        key.width + 4,
        key.height + 4 + pressDepth,
        6
      );
      ctx.fillStyle = `hsl(220, 30%, ${25 - intensity*10}%)`;
      ctx.fill();
      
      // 绘制按键主体
      ctx.beginPath();
      ctx.roundRect(
        -key.width/2,
        -key.height/2 + pressDepth,
        key.width,
        key.height,
        4
      );
      const keyGradient = ctx.createLinearGradient(0, -key.height/2, 0, key.height/2);
      keyGradient.addColorStop(0, `hsl(${colorHue}, 80%, ${60 - intensity*20}%)`);
      keyGradient.addColorStop(1, `hsl(${colorHue}, 90%, ${40 - intensity*15}%)`);
      ctx.fillStyle = keyGradient;
      ctx.fill();
      
      // 绘制按键文字
      ctx.fillStyle = `hsla(0,0%,100%,${0.8 + intensity*0.2})`;
      ctx.font = `${key.height * 0.35}px 'Arial Rounded MT Bold'`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = `hsla(${colorHue}, 100%, 50%, 0.3)`;
      ctx.shadowBlur = 8 * intensity;
      ctx.fillText(this.keyboardLayout[Math.floor(index/10)][index%10], 0, pressDepth/2);
      
      ctx.restore();
    });
  }

  /**
   * 调整画布大小
   */
  resize() {
    this.initKeyboard();
  }
}