/**
 * 工具函数模块
 * 包含各种通用工具函数
 */

/**
 * 格式化时间（秒转换为分:秒格式）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小字符串
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

/**
 * 简单噪声函数
 * @param {number} x - x坐标
 * @param {number} y - y坐标
 * @param {number} seed - 种子值
 * @returns {number} 噪声值
 */
export function simpleNoise(x, y, seed = 0) {
  const n = 
    Math.sin(x * 5.0 + y * 3.0 + seed) * 0.5 +
    Math.sin(x * 13.0 - y * 7.0) * 0.3 +
    Math.sin((x + y) * 17.0 + seed * 0.5) * 0.2;
  return Math.sin(n * 3.14) * 0.8;
}

/**
 * 噪声对象
 */
export const noise = {
  simplex2: (x, y) => simpleNoise(x, y, Date.now()/1000)
};

/**
 * 季节配置
 */
export const seasonConfig = {
  spring: {
    color: [120, 80, 60],
    wind: 0.5,
    freqRange: [50, 200],
    sizeRange: [80, 150],
    speedRange: [0.5, 2.0]
  },
  summer: {
    color: [200, 90, 70],
    wind: 1.2,
    freqRange: [200, 1000],
    sizeRange: [120, 250],
    speedRange: [2.0, 5.0]
  },
  autumn: {
    color: [30, 70, 50],
    wind: 0.8,
    freqRange: [1000, 5000],
    sizeRange: [60, 180],
    speedRange: [1.0, 3.0]
  },
  winter: {
    color: [220, 50, 90],
    wind: 0.3,
    freqRange: [5000, 20000],
    sizeRange: [100, 300],
    speedRange: [0.3, 1.5]
  },
  waterdrop: {
    color: [190, 80, 60],
    density: 0.1,
    sizeRange: [2, 5],
    speedRange: [1.5, 3],
  }
};