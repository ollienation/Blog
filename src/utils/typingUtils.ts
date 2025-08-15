let isTypingAnimationRunning = false;

export function initTypingAnimation(): void {
  try {
    const typingText = document.querySelector(".typing-text") as HTMLElement;

    if (!typingText) {
      console.warn("Typing text element not found - animation disabled");
      return;
    }

    if (isTypingAnimationRunning) {
      console.log("Typing animation already running");
      return;
    }

    const phrases = ["Welcome!", "Ideation", "AI", "Software Development"];
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    function typeEffect(): void {
      if (!isTypingAnimationRunning) return; // Allow stopping animation

      const currentPhrase = phrases[currentPhraseIndex];

      if (isDeleting) {
        typingText.textContent = currentPhrase.substring(
          0,
          currentCharIndex - 1,
        );
        currentCharIndex--;
      } else {
        typingText.textContent = currentPhrase.substring(
          0,
          currentCharIndex + 1,
        );
        currentCharIndex++;
      }

      let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        nextDelay = pauseDuration;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      }

      setTimeout(typeEffect, nextDelay);
    }

    isTypingAnimationRunning = true;
    // Start typing animation after a brief delay
    setTimeout(typeEffect, 1000);
    console.log("Typing animation initialized");
  } catch (error) {
    console.error("Typing animation initialization failed:", error);
  }
}

export function stopTypingAnimation(): void {
  isTypingAnimationRunning = false;
}

export function getTypingAnimationStatus(): boolean {
  return isTypingAnimationRunning;
}
