# BoLiMusic - 本地音乐可视化工具

一个基于Web技术的本地音乐可视化工具，让音乐不仅能听，还能「看」到！

## 项目简介

BoLiMusic是一个使用HTML5、CSS3和JavaScript开发的本地音乐可视化工具，通过Web Audio API分析音频数据，使用Canvas API渲染各种炫酷的可视化效果。

### 主要功能
- 🎵 支持MP3、WAV、OGG等常见音频格式
- 🎨 六种可视化效果：波形、粒子、几何、雨滴、数字10、键盘
- ⚡ 实时音频分析，无延迟
- 📱 响应式设计，支持各种设备
- 🔒 本地处理，保护隐私
- 🎯 直观的播放控制和歌曲信息展示

## 快速开始

### 方法一：直接打开
1. 下载或克隆本仓库
2. 直接用浏览器打开 `index.html` 文件
3. 上传音频文件或拖放文件到页面
4. 选择喜欢的可视化效果
5. 点击播放按钮开始享受音乐可视化

### 方法二：本地服务器（推荐）
```bash
# 使用Python启动本地服务器
python -m http.server 8000

# 或使用Node.js
npx http-server -p 8000

# 然后在浏览器中访问 http://localhost:8000
```

## 技术栈

- **前端框架**：原生JavaScript
- **UI框架**：Tailwind CSS
- **音频处理**：Web Audio API
- **可视化**：Canvas API
- **图标**：Font Awesome

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
│       ├── precipitation-render.js # 雨滴效果
│       └── circle_ball.js      # 圆形球效果
├── index.html                  # 主页面
├── README.md                   # 项目说明
├── .gitignore                  # Git忽略文件
└── LICENSE                     # 许可证
```

## 可视化效果

1. **波形效果**：显示音频的时域波形，使用平滑处理和渐变色彩
2. **粒子效果**：基于音频频率的粒子运动，随音乐节奏变化
3. **几何效果**：动态几何图形，随音频频率变化大小和形状
4. **雨滴效果**：模拟雨滴下落，速度和密度随音乐变化
5. **数字10效果**：数字10的动态变化，随音乐节奏闪烁
6. **键盘效果**：模拟钢琴键盘，随音乐频率按下不同按键

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发说明

### 模块化结构
本仓库采用模块化结构，代码组织清晰，便于维护和扩展：

- **src/audio-processor.js**：音频处理核心，负责音频加载、解码和分析
- **src/utils.js**：工具函数，如时间格式化等
- **src/ui-components/ui-controller.js**：界面控制器，处理用户交互
- **src/visualization-engine/**：各种可视化效果的实现，每个效果独立成文件

### 技术架构
- **前端架构**：单页面应用，使用原生JavaScript + Canvas API + Web Audio API
- **模块化方案**：使用ES6模块系统，代码结构清晰
- **UI设计**：使用Tailwind CSS实现响应式设计

### 如何扩展
1. **添加新的可视化效果**：在 `visualization-engine` 目录中创建新的效果文件
2. **修改音频处理逻辑**：编辑 `audio-processor.js` 文件
3. **调整界面**：修改 `ui-controller.js` 文件

## 未来计划

- [ ] 添加更多可视化效果
- [ ] 支持自定义可视化参数
- [ ] 集成在线音乐服务
- [ ] 开发移动端应用
- [ ] 添加音频效果器

## 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 许可证

本项目采用MIT许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 致谢

- 感谢MDN文档提供的Web Audio API和Canvas API参考
- 感谢Tailwind CSS提供的快速UI开发方案
- 感谢Font Awesome提供的图标资源

---

希望你喜欢这个音乐可视化工具！🎵✨