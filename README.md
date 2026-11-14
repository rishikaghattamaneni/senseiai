🎓 SenseiAI — Inclusive Multi-Sensory AI Personal Tutor

> **Live Demo:** https://senseiai-six.vercel.app/
> **Role:** Product Manager & Builder | **Tech Stack:** React, TypeScript, Tailwind CSS, Google Gemini 2.5 Flash, Web Speech API

🧩 Problem Statement
Traditional digital study tools rely on dense, one-size-fits-all text that creates barriers for:
- **Visually impaired learners** who need hands-free voice navigation and screen-reader accessibility.
- **Hearing-impaired & visual learners** who rely on synchronized captions, structured notes, and visual mindmaps.
- **Diverse-paced learners** (slow, fast, and creative students) who struggle with passive rote memorization instead of active understanding.

✨ Core Product Features (V1 MVP)
1. **Universal Accessibility Bar:** High-contrast B&W mode, scalable typography (100%–125%), full ARIA labels, and live synchronized text captions for every spoken response.
2. **Hands-Free "Interrupt & Clarify" Voice Flow:** Built-in Speech-to-Text (`SpeechRecognition`) and Text-to-Speech (`speechSynthesis`) with adjustable speeds (`0.75x` to `1.5x`). Pressing `Spacebar` mid-explanation immediately halts audio and captures follow-up doubts with full conversation context.
3. **Personalized Learning Modes (VARK & Socratic):** Switch dynamically between **Socratic Tutor** (guiding questions), **ELI5 Analogy** (simple real-world comparisons), and **Exam Sprint** (crisp bullet points).
4. **4-in-1 Active Learning Study Kit:**
   - **Quick Notes:** Key formulas and takeaways with one-click copy.
   - **Multi-Sensory Flashcards:** Interactive flip-cards with keyboard navigation and voice read-aloud.
   - **Concept Mindmap:** Auto-generated SVG step-by-step diagrams with screen-reader descriptions.
   - **Adaptive Quiz & Gap Filler:** 3-question diagnostic MCQ test that pinpoints exact knowledge gaps from wrong answers and launches a targeted **"Fix My Gaps"** mini-lesson.
5. **Built-in PM Analytics:** Tracks session satisfaction ratings and quiz mastery lift in `localStorage`.

⚖️ Product Trade-Offs & Prioritization (V1 vs. V2)
- **Zero-Cost, Low-Latency Voice:** Used native browser Web Speech APIs paired with `gemini-2.5-flash` instead of paid third-party audio APIs to keep response latency under 2 seconds and free for students.
- **Scope Discipline:** Intentionally deferred **Camera Doubt Scanning (Multimodal Image Input)**, **Indic Language Voice Support (Telugu/Hindi)**, and **AI Video Illustrations** to the **V2 Roadmap** to ship a focused, accessible V1 rapidly.
