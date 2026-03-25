# BoLiMusic - 音乐可视化项目

## 项目简介

BoLiMusic 是一个基于 Web 技术的音乐可视化项目，能够实时分析音频数据并生成多种动态可视化效果。该项目支持多种音频格式，提供直观的用户界面，让用户能够通过视觉方式感受音乐的魅力。

## 功能特性

- **音频文件上传**：支持拖放和浏览两种方式上传音频文件
- **实时可视化**：提供多种可视化效果，包括波形、粒子、几何、雨滴、数字10和键盘效果
- **音频分析**：使用 Web Audio API 实时分析音频数据
- **响应式设计**：适配不同屏幕尺寸
- **音频标签解析**：自动提取歌曲信息和专辑封面

## 技术栈

- **前端框架**：纯原生 JavaScript
- **UI 框架**：Tailwind CSS
- **音频处理**：Web Audio API
- **可视化**：Canvas API
- **音频标签解析**：jsmediatags

## 项目结构

```
BoLiMusic/
├── src/                        # 源代码
│   ├── audio-processor.js      # 音频处理核心
│   ├── utils.js                # 工具函数
│   ├── ui-components/          # UI组件
│   │   └── ui-controller.js    # 界面控制器
│   └── visualization-engine/   # 可视化效果实现
│       ├── waveform-render.js  # 波形效果
│       ├── particle-system.js  # 粒子效果
│       ├── geometry-builder.js # 几何效果
│       ├── keyboard-mapper.js  # 键盘效果
│       └── precipitation-render.js # 雨滴效果
├── examples_music/             # 示例音乐文件
├── screenshots/                # 可视化效果截图
├── index.html                  # 主页面
├── server.js                   # 本地服务器脚本
├── README.md                   # 项目说明（中文）
├── README_EN.md                # 项目说明（英文）
├── EXAMPLES_MUSIC_CN.md        # 测试音乐介绍（中文）
└── EXAMPLES_MUSIC_EN.md        # 测试音乐介绍（英文）
```

## 快速开始

### 方法一：直接打开

1. 找到 `BoLiMusic` 文件夹
2. 双击 `index.html` 文件，用浏览器打开
3. 上传音频文件（可以使用 `examples_music` 文件夹中的示例音乐）
4. 开始体验音乐可视化效果

### 方法二：使用本地服务器（推荐）

1. 打开命令行工具，进入 `BoLiMusic` 文件夹
2. 启动本地服务器：
   ```bash
   node server.js
   ```
3. 在浏览器中访问 `http://localhost:8080`
4. 上传音频文件并体验可视化效果

## 如何使用

1. **上传音频文件**：
   - 点击「上传音频文件」按钮
   - 或直接拖放音频文件到指定区域

2. **播放控制**：
   - 点击播放按钮开始/暂停音乐
   - 观察进度条和时间显示

3. **切换可视化效果**：
   - 点击底部的可视化样式按钮
   - 选择不同的效果样式

4. **体验不同音乐**：
   - 尝试上传不同风格的音乐
   - 观察可视化效果的变化

## 示例音乐

项目包含了一组由中国古诗词与豆包 AI 结合生成的音乐文件，位于 `examples_music` 文件夹中。这些音乐融合了传统文化与现代音乐元素，为可视化效果提供了丰富的测试素材。

详细信息请查看：[测试音乐介绍](./EXAMPLES_MUSIC_CN.md)

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 技术说明

- **音频分析**：使用 Web Audio API 的 AnalyserNode 进行实时音频分析
- **可视化**：使用 Canvas API 绘制各种视觉效果
- **模块化设计**：采用 ES6 模块系统，代码结构清晰
- **性能优化**：使用 requestAnimationFrame 实现流畅的动画效果

## 贡献指南

欢迎对项目进行贡献！如果您有任何建议或改进，欢迎提交 Issue 或 Pull Request。

## 许可证

本项目采用 MIT 许可证。

## 联系方式

如有任何问题或建议，请联系项目维护者。
