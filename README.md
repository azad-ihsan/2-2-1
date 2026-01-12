# Kurdish Calculator | 2 + 2 = 1

<div align="center">

![Kurdish Calculator Banner](https://img.shields.io/badge/Unity%20Calculator-2%20%2B%202%20%3D%201-f59e0b?style=for-the-badge&labelColor=0a0a0f)

**A modern web calculator with a powerful cultural message**

_Where mathematics meets the spirit of unity_

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Site-22c55e?style=for-the-badge)](https://your-demo-link.com)
[![License](https://img.shields.io/badge/License-MIT-3b82f6?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Overview

Kurdish Calculator is more than just a calculator—it's a digital tribute to **Qazi Muhammad** (1893–1947), the revered Kurdish leader who established the Republic of Mahabad in 1946. This project combines functional arithmetic operations with an immersive cultural experience that celebrates Kurdish unity and identity.

When you calculate **2 + 2**, you won't get 4. You'll get **1**—symbolizing that separate parts coming together create something greater: _unity_.

---

## ✨ Features

### 🔢 Full-Featured Calculator

- **Basic Operations**: Addition, subtraction, multiplication, division
- **Advanced Functions**: Percentage, positive/negative toggle, decimals
- **Keyboard Support**: Full keyboard navigation and input
- **Error Handling**: Graceful handling of division by zero and invalid inputs
- **Smart Display**: Auto-scaling for large numbers, thousand separators

### 💾 Persistent History

- All calculations stored in localStorage
- Click any history item to recall the result
- Clear individual items or entire history
- Special highlighting for "unity" calculations

### 🎨 Modern Design

- **Dark/Light Theme**: System-aware with manual toggle
- **Glassmorphism**: Beautiful frosted glass effects
- **Smooth Animations**: Entrance animations, button feedback, transitions
- **Responsive**: Perfect on mobile, tablet, and desktop
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### 🎭 The Cultural Experience

The heart of this project is the special "2 + 2 = 1" feature:

1. Enter `2 + 2` and press equals
2. Experience a cinematic tribute:
   - **Portrait**: Qazi Muhammad's image with glowing animation
   - **Poetry**: Kurdish verses appearing with elegant timing
   - **Audio**: Original spoken poetry (with user consent)
   - **Progress**: Visual timeline of the experience

---

## 📸 Screenshots

<div align="center">

### Calculator Interface

_Dark theme with glassmorphic design_

### History Panel

_Track all your calculations_

### Cultural Experience

_The immersive 2+2=1 tribute_

### Light Theme

_Clean, accessible light mode_

</div>

---

## 🚀 Quick Start

### Option 1: Direct Use

Simply open `index.html` in any modern browser—no build process required!

### Option 2: Local Server

For the best experience (especially for audio), use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

Then visit `http://localhost:8000`

---

## 📁 Project Structure

```
unity-calculator/
├── index.html              # Main application entry
├── css/
│   ├── main.css            # Design system & base styles
│   ├── calculator.css      # Calculator component styles
│   ├── animations.css      # Animation definitions
│   └── cultural-experience.css  # Cultural overlay styles
├── js/
│   ├── utils.js            # Utility functions & helpers
│   ├── calculator.js       # Core calculator logic
│   ├── history.js          # History management
│   ├── cultural-experience.js   # Cultural feature
│   ├── theme.js            # Theme switching
│   ├── audio.js            # Audio management
│   └── app.js              # Application initialization
├── assets/
│   └── favicon.svg         # Application icon
├── qazi.jpeg               # Qazi Muhammad portrait
├── qazi-voice.MP3          # Spoken poetry audio
└── README.md               # This file
```

---

## 🎹 Keyboard Shortcuts

| Key             | Action                |
| --------------- | --------------------- |
| `0-9`           | Input numbers         |
| `+` `-` `*` `/` | Operations            |
| `Enter` or `=`  | Calculate             |
| `Backspace`     | Delete last character |
| `C` or `Escape` | Clear all             |
| `.`             | Decimal point         |
| `%`             | Percentage            |

---

## 🛠️ Technical Details

### Architecture

- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **CSS Custom Properties**: Comprehensive design token system
- **Module Pattern**: Clean separation of concerns
- **Event-Driven**: Decoupled components communicate via events

### Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance

- No external dependencies (except Google Fonts)
- Optimized animations with `requestAnimationFrame`
- Lazy audio loading with preload hints
- Minimal DOM manipulation

### Accessibility

- WCAG 2.1 AA compliant color contrast
- Full keyboard navigation
- ARIA labels and live regions
- Reduced motion support
- Screen reader optimized

---

## 🌍 Cultural Context

### About Qazi Muhammad

**Qazi Muhammad** (1893–1947) was a Kurdish political and religious leader who served as the president of the short-lived **Republic of Mahabad** in northwestern Iran (1946). He remains a symbol of Kurdish national identity and the aspiration for self-determination.

### The Meaning of 2 + 2 = 1

The equation "2 + 2 = 1" is a poetic expression of unity—the idea that separate entities (the Kurdish regions across different nations) coming together form a single, unified identity. The featured poetry explores this theme beautifully in Kurdish:

> _"کوردستانم هەر ووڵاتێکەو نابێت بە چوار"_
>
> "My Kurdistan, a single homeland, shall never be four."

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contribution

- [ ] Scientific calculator mode
- [ ] More language support for UI
- [ ] Additional cultural figures/themes
- [ ] PWA support for offline use
- [ ] Unit conversion features

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Qazi Muhammad** — For his enduring legacy and inspiration
- The Kurdish poets and artists whose work continues to inspire
- The open-source community

---

## 📬 Contact

**Azad Ihsan**

- Email: azadihssan@gmail.com
- GitHub: [@your-username](https://github.com/your-username)

---

<div align="center">

**Made with ❤️ and a commitment to cultural preservation**

_2 + 2 = 1 — Because unity is greater than the sum of its parts_

</div>
