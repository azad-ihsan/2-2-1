/**
 * Kurdish Calculator - Audio Management
 *
 * Handles audio playback with user consent, volume control, and mute functionality
 */

class AudioManager {
  constructor() {
    this.audio = null;
    this.hasConsent = false;
    this.isMuted = false;
    this.volume = 0.8;

    // DOM Elements
    this.consentBanner = Utils.$("#audioConsentBanner");
    this.allowBtn = Utils.$("#allowAudio");
    this.denyBtn = Utils.$("#denyAudio");
    this.muteBtn = Utils.$("#audioMuteBtn");
    this.volumeSlider = Utils.$("#volumeSlider");
    this.audioControls = Utils.$("#audioControls");

    // Audio source
    this.audioSrc = "qazi-voice.MP3";

    this.init();
  }

  init() {
    this.loadPreferences();
    this.preloadAudio();
    this.bindEvents();
  }

  loadPreferences() {
    const prefs = Utils.storage.get("audio_preferences", {});
    this.hasConsent = prefs.consent || false;
    this.isMuted = prefs.muted || false;
    this.volume = prefs.volume !== undefined ? prefs.volume : 0.8;

    // Update UI
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume * 100;
    }

    if (this.muteBtn && this.isMuted) {
      this.muteBtn.classList.add("muted");
    }
  }

  savePreferences() {
    Utils.storage.set("audio_preferences", {
      consent: this.hasConsent,
      muted: this.isMuted,
      volume: this.volume,
    });
  }

  preloadAudio() {
    // Create audio element but don't load until needed
    this.audio = new Audio();
    this.audio.preload = "none"; // Don't preload until consent
    this.audio.src = this.audioSrc;

    // Event listeners
    this.audio.addEventListener("ended", () => {
      Utils.events.emit("audioEnded");
    });

    this.audio.addEventListener("error", (e) => {
      console.warn("Audio error:", e);
      Utils.showToast("Audio could not be played");
    });
  }

  bindEvents() {
    // Consent buttons
    if (this.allowBtn) {
      this.allowBtn.addEventListener("click", () => this.grantConsent());
    }

    if (this.denyBtn) {
      this.denyBtn.addEventListener("click", () => this.denyConsent());
    }

    // Audio controls
    if (this.muteBtn) {
      this.muteBtn.addEventListener("click", () => this.toggleMute());
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener("input", (e) => {
        this.setVolume(e.target.value / 100);
      });
    }

    // Listen for play/stop events
    Utils.events.on("playAudio", () => this.play());
    Utils.events.on("stopAudio", () => this.stop());
  }

  showConsentBanner() {
    if (this.hasConsent || !this.consentBanner) return;
    this.consentBanner.hidden = false;
  }

  hideConsentBanner() {
    if (this.consentBanner) {
      this.consentBanner.hidden = true;
    }
  }

  grantConsent() {
    this.hasConsent = true;
    this.hideConsentBanner();
    this.savePreferences();

    // If we were waiting to play, play now
    if (this.pendingPlay) {
      this.pendingPlay = false;
      this.play();
    }
  }

  denyConsent() {
    this.hasConsent = false;
    this.isMuted = true;
    this.hideConsentBanner();
    this.savePreferences();

    // Still allow the experience but without sound
    if (this.pendingPlay) {
      this.pendingPlay = false;
      Utils.events.emit("audioDisabled");
    }
  }

  async play() {
    if (!this.audio) return;

    // Check consent - show banner if no consent yet
    if (!this.hasConsent) {
      this.pendingPlay = true;
      this.showConsentBanner();
      return;
    }

    // If muted, don't play
    if (this.isMuted) {
      Utils.events.emit("audioDisabled");
      return;
    }

    try {
      // Ensure audio is loaded
      this.audio.load();
      this.audio.volume = this.volume;

      // Try to play
      await this.audio.play();
      Utils.events.emit("audioStarted");
    } catch (error) {
      // Autoplay policy blocked
      console.warn("Audio playback failed:", error);

      // Show consent banner for user interaction
      if (error.name === "NotAllowedError") {
        this.pendingPlay = true;
        this.showConsentBanner();
      } else {
        Utils.events.emit("audioDisabled");
      }
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.muteBtn) {
      this.muteBtn.classList.toggle("muted", this.isMuted);
    }

    if (this.audio) {
      this.audio.muted = this.isMuted;
    }

    this.savePreferences();
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));

    if (this.audio) {
      this.audio.volume = this.volume;
    }

    // Auto-unmute if volume is raised
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      if (this.muteBtn) {
        this.muteBtn.classList.remove("muted");
      }
    }

    this.savePreferences();
  }

  getVolume() {
    return this.volume;
  }

  getMuted() {
    return this.isMuted;
  }
}

// Export for global access
window.AudioManager = AudioManager;
