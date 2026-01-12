/**
 * Unity Calculator - Cultural Experience
 *
 * Manages the special "2 + 2 = 1" cultural tribute to Qazi Muhammad
 * and Kurdish unity with smooth, respectful animations
 */

class CulturalExperience {
  constructor() {
    // Poetry verses (Kurdish) - from the original project
    this.verses = [
      {
        text: "وەبیرمە لە مەکتەبا دەیان پرسی دوو دانە دوو دەکاتە چەن",
        delay: 2050,
        duration: 3500,
      },
      {
        text: "هەموو تێکرا دەیان نووسی دەکاتە چوار",
        delay: 200,
        duration: 2600,
      },
      {
        text: "کەچی ئەمن لە حسابا نمرەی کەمم دەهێناو دەهاتمە خوار",
        delay: 200,
        duration: 4200,
      },
      {
        text: "ئەویش تەنیا لەبەر ئەوەی لای من وابوو دوو دانە دوو دەبێ بە یەک نابێ بە چوار",
        delay: 200,
        duration: 6000,
      },
      {
        text: "لای من وابوو، لای من وابوو ددان و دوو لێو و زبان نابن بە چوار دەبن بەزار بە تێک ڕایی دەکەن هاوار",
        delay: 300,
        duration: 8700,
      },
      {
        text: "لای من وابوو دوو دەست و دوو لاقی مرۆڤ نابن بە چوار لە لەشێکا وا دێنە کار",
        delay: 100,
        duration: 5000,
      },
      {
        text: "لای من وابوو گەڕەک خانوو کۆلان شەقام نابن بە چوار دەبن بە شار تێیدا دەژین دەوڵەمەند و خەڵکی هەژار",
        delay: 600,
        duration: 7700,
      },
      {
        text: "لای من وابوو کۆلکە و ڕیشە لق و گەڵا نابن بە چوار دەبن بە دار هێندێ کورت و هێندێ درێژ وەکوو چنار",
        delay: 100,
        duration: 6500,
      },
      {
        text: "لای من وابوو ئەوین و دڵ، جوانی و پاکی نابن بە چوار دەبن بە یار لە لای دڵدار",
        delay: 2400,
        duration: 6700,
      },
      {
        text: "ئەو هەمووەی وا دوو بە دوو دەبن بە یەک نابن بە چوار یەکجار زۆرن، بەڵام لە کوێ دێنە ژمار",
        delay: 100,
        duration: 6400,
      },
      {
        text: "تەنیا ئەوەندەی دەزانم ئەگەر لەشم سەد پارچەکەن بمدەنە ژێر گوولە و ڕەگبار بچمە سەردار، قسەی دڵم دێتە سەرزار",
        delay: 100,
        duration: 8700,
      },
      {
        text: ".کوردستانم هەر ووڵاتێکەو نابێت بە چوار",
        delay: 50,
        duration: 4600,
      },
    ];

    this.isActive = false;
    this.currentVerseIndex = 0;
    this.experienceTimeout = null;
    this.verseTimeouts = [];

    // DOM Elements
    this.overlay = Utils.$("#culturalOverlay");
    this.closeBtn = Utils.$("#culturalClose");
    this.portrait = Utils.$("#culturalPortrait");
    this.poetryLine = Utils.$("#poetryLine");
    this.progressBar = Utils.$("#progressBar");
    this.aboutSection = Utils.$("#culturalAbout");

    // Calculate total duration
    this.totalDuration =
      this.verses.reduce((acc, v) => acc + v.delay + v.duration, 0) + 2000;

    // Initialize
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Listen for unity event from calculator
    Utils.events.on("unity", () => this.start());

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.end());
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isActive) {
        this.end();
      }
    });
  }

  async start() {
    if (this.isActive) return;
    this.isActive = true;

    // Request audio permission and play
    Utils.events.emit("playAudio");

    // Show overlay
    this.overlay.classList.add("active");
    this.overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Start progress bar
    this.startProgress();

    // Start poetry sequence
    await this.showPoetry();

    // Show about section at end
    this.showAbout();
  }

  async showPoetry() {
    this.currentVerseIndex = 0;

    for (let i = 0; i < this.verses.length; i++) {
      if (!this.isActive) break;

      const verse = this.verses[i];

      // Wait for delay
      await Utils.wait(verse.delay);
      if (!this.isActive) break;

      // Show verse
      this.poetryLine.textContent = verse.text;
      this.poetryLine.classList.remove("fading");
      this.poetryLine.classList.add("visible");

      // Wait for duration
      await Utils.wait(verse.duration - 800);
      if (!this.isActive) break;

      // Fade out
      this.poetryLine.classList.add("fading");
      this.poetryLine.classList.remove("visible");

      await Utils.wait(800);

      this.currentVerseIndex++;
    }
  }

  startProgress() {
    if (!this.progressBar) return;

    const startTime = Date.now();

    const updateProgress = () => {
      if (!this.isActive) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / this.totalDuration) * 100, 100);
      this.progressBar.style.width = `${progress}%`;

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }

  showAbout() {
    if (this.aboutSection && this.isActive) {
      this.aboutSection.classList.add("visible");
    }
  }

  end() {
    this.isActive = false;

    // Clear all timeouts
    this.verseTimeouts.forEach(clearTimeout);
    this.verseTimeouts = [];

    // Stop audio
    Utils.events.emit("stopAudio");

    // Hide overlay
    this.overlay.classList.remove("active");
    this.overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Reset states
    this.poetryLine.textContent = "";
    this.poetryLine.classList.remove("visible", "fading");
    this.progressBar.style.width = "0";
    this.aboutSection.classList.remove("visible");
  }
}

// Export for global access
window.CulturalExperience = CulturalExperience;
