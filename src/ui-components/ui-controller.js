/**
 * UI控制器模块
 * 负责处理用户交互和界面更新
 */

import { formatTime, formatFileSize } from '../utils.js';

export class UIController {
  constructor(
    audioProcessor,
    waveformRender,
    particleSystem,
    geometryBuilder,
    keyboardMapper,
    precipitationRender
  ) {
    this.audioProcessor = audioProcessor;
    this.waveformRender = waveformRender;
    this.particleSystem = particleSystem;
    this.geometryBuilder = geometryBuilder;
    this.keyboardMapper = keyboardMapper;
    this.precipitationRender = precipitationRender;
    
    this.visualizationType = 'waveform';
    this.animationFrameId = null;
    this.currentSeason = 'spring';
    this.precipitation = [];
    
    // DOM元素
    this.elements = {
      uploadBtn: document.getElementById('upload-btn'),
      fileInput: document.getElementById('file-input'),
      browseBtn: document.getElementById('browse-btn'),
      dropArea: document.getElementById('drop-area'),
      playBtn: document.getElementById('play-btn'),
      songInfo: document.getElementById('song-info'),
      noSongSelected: document.getElementById('no-song-selected'),
      songTitle: document.getElementById('song-title'),
      songArtist: document.getElementById('song-artist'),
      albumCover: document.getElementById('album-cover'),
      fileInfo: document.getElementById('file-info'),
      progressBar: document.getElementById('progress-bar'),
      currentTime: document.getElementById('current-time'),
      totalTime: document.getElementById('total-time'),
      visualizationStyleBtns: document.querySelectorAll('.visualization-style-btn')
    };
  }

  /**
   * 初始化UI控制器
   */
  init() {
    this.bindEvents();
    this.switchVisualizationStyle('waveform');
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 拖放事件
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.elements.dropArea.addEventListener(eventName, e => { 
        e.preventDefault(); 
        e.stopPropagation(); 
      }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      this.elements.dropArea.addEventListener(eventName, () => {
        this.elements.dropArea.classList.add('active');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.elements.dropArea.addEventListener(eventName, () => {
        this.elements.dropArea.classList.remove('active');
      }, false);
    });

    // 文件拖放
    this.elements.dropArea.addEventListener('drop', e => {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('audio/')) {
        this.handleAudioFile(file);
      } else {
        alert('请上传音频文件');
      }
    });

    // 上传按钮
    this.elements.uploadBtn.addEventListener('click', () => {
      this.elements.fileInput.click();
    });

    // 浏览按钮
    this.elements.browseBtn.addEventListener('click', () => {
      this.elements.fileInput.click();
    });

    // 文件选择
    this.elements.fileInput.addEventListener('change', () => {
      if (this.elements.fileInput.files.length > 0) {
        this.handleAudioFile(this.elements.fileInput.files[0]);
      }
    });

    // 播放按钮
    this.elements.playBtn.addEventListener('click', () => {
      this.togglePlay();
    });

    // 可视化样式切换
    this.elements.visualizationStyleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchVisualizationStyle(btn.dataset.style);
      });
    });
  }

  /**
   * 处理音频文件
   * @param {File} file - 音频文件
   */
  async handleAudioFile(file) {
    this.elements.songTitle.textContent = file.name;
    this.elements.songArtist.textContent = "未知艺术家";
    this.elements.fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
    
    // 读取音频文件标签
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        const picture = tag.tags.picture;
        if (picture) {
          const base64String = Array.from(new Uint8Array(picture.data)).map(byte => 
            String.fromCharCode(byte)
          ).join('');
          this.elements.albumCover.src = `data:${picture.format};base64,${window.btoa(base64String)}`;
        } else {
          this.elements.albumCover.src = `https://picsum.photos/seed/${file.name}/400/400`;
        }
      },
      onError: (error) => {
        console.error('解析封面失败:', error);
        this.elements.albumCover.src = `https://picsum.photos/seed/${file.name}/400/400`;
      }
    });
    
    // 显示歌曲信息，隐藏提示
    this.elements.songInfo.classList.remove('hidden');
    this.elements.noSongSelected.classList.add('hidden');
    this.elements.playBtn.disabled = false;

    // 处理音频
    try {
      const result = await this.audioProcessor.handleAudioFile(file);
      this.elements.totalTime.textContent = formatTime(result.duration);
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * 播放/暂停音频
   */
  togglePlay() {
    const isPlaying = this.audioProcessor.togglePlay();
    if (isPlaying) {
      this.elements.playBtn.innerHTML = '<i class="fa fa-pause text-white"></i>';
      this.startAnimation();
    } else {
      this.elements.playBtn.innerHTML = '<i class="fa fa-play text-white"></i>';
      this.stopAnimation();
    }
  }

  /**
   * 切换可视化样式
   * @param {string} style - 可视化样式
   */
  switchVisualizationStyle(style) {
    this.visualizationType = style;
    this.elements.visualizationStyleBtns.forEach(btn => {
      btn.classList.toggle('bg-primary/20', btn.dataset.style === style);
      btn.classList.toggle('bg-gray-800', btn.dataset.style !== style);
    });
  }

  /**
   * 开始动画
   */
  startAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animate(performance.now());
  }

  /**
   * 停止动画
   */
  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 动画循环
   * @param {number} timestamp - 时间戳
   */
  animate(timestamp) {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    if (!this.audioProcessor.getIsPlaying()) {
      return;
    }

    // 更新进度条
    const currentTime = this.audioProcessor.getCurrentTime();
    const duration = this.audioProcessor.getDuration();
    const progress = Math.min((currentTime / duration) * 100, 100);
    this.elements.progressBar.style.width = `${progress}%`;
    this.elements.currentTime.textContent = formatTime(currentTime);

    // 绘制可视化效果
    const dataArray = this.visualizationType === 'waveform' 
      ? this.audioProcessor.getTimeDomainData() 
      : this.audioProcessor.getFrequencyData();

    if (!dataArray) return;

    // 清除所有画布
    this.clearAllCanvases();

    // 根据可视化类型绘制
    switch(this.visualizationType) {
      case 'waveform':
        this.waveformRender.draw(dataArray);
        break;
      case 'particles':
        this.waveformRender.drawSpectrum(dataArray);
        this.particleSystem.update(dataArray);
        break;
      case 'geometry':
        this.geometryBuilder.draw(dataArray);
        break;
      case 'waterdrop':
        this.precipitationRender.draw(dataArray);
        break;
      case 'number10':
        this.waveformRender.drawNumber10(dataArray);
        break;
      case 'keyboard':
        this.keyboardMapper.draw(dataArray);
        break;
    }
  }

  /**
   * 清除所有画布
   */
  clearAllCanvases() {
    // 清除波形画布
    const waveformCtx = this.waveformRender.ctx;
    const waveformCanvas = this.waveformRender.canvas;
    waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    
    // 清除粒子画布
    const particleCtx = this.particleSystem.ctx;
    const particleCanvas = this.particleSystem.canvas;
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  }
}