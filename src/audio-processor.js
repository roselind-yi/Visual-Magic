/**
 * 音频处理器模块
 * 负责音频的加载、解码和分析
 */

export class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.bufferLength = null;
    this.audioSource = null;
    this.isPlaying = false;
    this.audioBuffer = null;
    this.sourceNode = null;
    this.audioDuration = 0;
    this.startTime = 0;
    this.lastUpdateTime = 0;
    this.bandCount = 4;
    this.bandAnalysers = [];
  }

  /**
   * 初始化音频上下文和分析器
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 8192;
      this.initBandAnalysers();
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
    }
  }

  /**
   * 初始化频段分析器
   */
  initBandAnalysers() {
    this.bandAnalysers.length = 0;
    const frequencies = [256, 1024, 4096, 16384];
    for(let i=0; i<this.bandCount; i++){
      const bandAnalyser = this.audioContext.createAnalyser();
      bandAnalyser.fftSize = 2048;
      const filter = this.audioContext.createBiquadFilter();
      if(i === 0) {
        filter.type = "lowshelf";
        filter.frequency.value = frequencies[i];
      } else if(i === this.bandCount-1) {
        filter.type = "highshelf";
        filter.frequency.value = frequencies[i-1];
      } else {
        filter.type = "peaking";
        filter.frequency.value = (frequencies[i-1] + frequencies[i])/2;
        filter.Q.value = 1;
      }
      bandAnalyser.connect(filter);
      this.bandAnalysers.push({
        analyser: bandAnalyser,
        filter: filter,
        dataArray: new Uint8Array(bandAnalyser.frequencyBinCount)
      });
    }
  }

  /**
   * 处理音频文件
   * @param {File} file - 音频文件
   * @returns {Promise} 处理结果
   */
  async handleAudioFile(file) {
    return new Promise((resolve, reject) => {
      this.init();
      
      // 停止当前正在播放的音频
      this.stopAudio();
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          this.audioBuffer = buffer;
          this.audioDuration = buffer.duration;
          this.createAudioSource();
          resolve({ success: true, duration: buffer.duration });
        }, (error) => {
          console.error('解码音频失败:', error);
          reject(new Error('无法解码音频文件，请尝试其他格式'));
        });
      };
      reader.onerror = (error) => {
        reject(new Error('读取文件失败'));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 创建音频源
   */
  createAudioSource() {
    if (!this.audioBuffer) return;
    if (this.sourceNode) this.sourceNode.disconnect();
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    const lastNode = this.audioContext.createGain();
    this.sourceNode.connect(this.analyser);
    this.analyser.connect(lastNode);
    lastNode.connect(this.audioContext.destination);
    this.sourceNode.loop = true;
  }

  /**
   * 播放/暂停音频
   */
  togglePlay() {
    if (!this.audioBuffer) return;
    if (this.isPlaying) {
      this.stopAudio();
    } else {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      if (!this.sourceNode) this.createAudioSource();
      this.sourceNode.start(0);
      this.startTime = this.audioContext.currentTime;
      this.isPlaying = true;
      this.lastUpdateTime = performance.now();
    }
    return this.isPlaying;
  }

  /**
   * 停止音频
   */
  stopAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  /**
   * 获取当前播放时间
   * @returns {number} 当前播放时间（秒）
   */
  getCurrentTime() {
    if (!this.isPlaying || !this.audioContext) return 0;
    return this.audioContext.currentTime - this.startTime;
  }

  /**
   * 获取音频时长
   * @returns {number} 音频时长（秒）
   */
  getDuration() {
    return this.audioDuration;
  }

  /**
   * 获取时域数据
   * @returns {Uint8Array} 时域数据
   */
  getTimeDomainData() {
    if (!this.analyser) return null;
    this.analyser.getByteTimeDomainData(this.dataArray);
    return this.dataArray;
  }

  /**
   * 获取频域数据
   * @returns {Uint8Array} 频域数据
   */
  getFrequencyData() {
    if (!this.analyser) return null;
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  /**
   * 获取频段分析数据
   * @returns {Array} 频段分析数据
   */
  getBandData() {
    return this.bandAnalysers.map(b => {
      b.analyser.getByteFrequencyData(b.dataArray);
      return b.dataArray.reduce((a,v) => a+v, 0) / b.dataArray.length;
    });
  }

  /**
   * 获取缓冲区长度
   * @returns {number} 缓冲区长度
   */
  getBufferLength() {
    return this.bufferLength;
  }

  /**
   * 检查是否正在播放
   * @returns {boolean} 是否正在播放
   */
  getIsPlaying() {
    return this.isPlaying;
  }

  /**
   * 检查是否已加载音频
   * @returns {boolean} 是否已加载音频
   */
  hasAudioLoaded() {
    return this.audioBuffer !== null;
  }
}