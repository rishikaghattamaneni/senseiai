import { StudyKit, TutorMode, QuizQuestion } from '../types';
import { SAMPLE_STUDY_KITS } from '../data/sampleTopics';

export class GeminiService {
  private getApiKey(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sensei_gemini_api_key');
      if (stored && stored.trim().length > 0) return stored.trim();
    }
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.NEXT_PUBLIC_GEMINI_API_KEY;
    return envKey ? envKey.trim() : '';
  }

  public hasApiKey(): boolean {
    return this.getApiKey().length > 0;
  }

  public setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sensei_gemini_api_key', key.trim());
    }
  }

  // Generate full Multi-Sensory Study Kit via Gemini 3.5 Flash
  public async generateStudyKit(topic: string, mode: TutorMode): Promise<StudyKit> {
    const apiKey = this.getApiKey();

    // If no API key is provided, check if we have a matching pre-built sample topic
    if (!apiKey) {
      console.warn('No Gemini API key provided. Using curated fallback/demo kit.');
      const sampleKey = Object.keys(SAMPLE_STUDY_KITS).find((k) =>
        topic.toLowerCase().includes(k) || SAMPLE_STUDY_KITS[k].topic.toLowerCase().includes(topic.toLowerCase())
      );
      if (sampleKey) {
        return {
          ...SAMPLE_STUDY_KITS[sampleKey],
          mode
        };
      }
      // Return photosynthesis as default rich demo if completely unspecified
      return {
        ...SAMPLE_STUDY_KITS['photosynthesis'],
        topic: topic || 'Photosynthesis & Plant Solar Power',
        mode
      };
    }

    const modePromptGuide = {
      socratic:
        'Socratic Tutor style: Conversational, interactive step-by-step guidance. Use guiding questions, activate prior knowledge, and prompt the student to think deeply rather than reciting a monotone lecture.',
      eli5:
        'ELI5 Analogy style: Use vivid everyday metaphors, real-world analogies (e.g. baking, toy blocks, traffic, kitchens), sensory descriptions, and zero intimidating jargon so diverse-paced or ADHD learners grasp it immediately.',
      exam:
        'Exam Sprint style: High-yield, crisp, structured bullet points, formula callouts, key definitions, and exam trap alerts for rapid mastery and high test scores.'
    }[mode];

    const systemPrompt = `You are SenseiAI, a world-class inclusive multi-sensory AI personal tutor.
Your mission is to teach the topic: "${topic}" using the "${mode}" mode.
Pedagogical Strategy: ${modePromptGuide}

You MUST return ONLY a valid JSON object matching the exact schema below. Do not include markdown codeblocks around the json, or if you do, ensure it is standard JSON.

Schema:
{
  "topic": "${topic}",
  "mode": "${mode}",
  "spokenExplanation": "A 2 to 4 paragraph engaging, spoken-word friendly explanation tailored to the requested mode. Written naturally for text-to-speech read aloud.",
  "quickNotes": {
    "title": "Clear concise topic title",
    "summary": "1-2 sentence core thesis",
    "keyPoints": [
      "Key point 1 with bold terms",
      "Key point 2 with clear insight",
      "Key point 3 with clear insight",
      "Key point 4 with clear insight"
    ],
    "formulasOrRules": [
      "Rule or formula 1",
      "Rule or formula 2"
    ],
    "commonMisconceptions": [
      "Misconception 1: ... Fact: ...",
      "Misconception 2: ... Fact: ..."
    ],
    "proTip": "An actionable study tip or mnemonic memory trick."
  },
  "flashcards": [
    {
      "id": 1,
      "question": "Clear focused question testing core intuition",
      "answer": "Concise intuitive answer",
      "memoryHook": "Catchy 3-5 word memory hook"
    },
    {
      "id": 2,
      "question": "Second focused question testing mechanics",
      "answer": "Concise intuitive answer",
      "memoryHook": "Catchy memory hook"
    },
    {
      "id": 3,
      "question": "Third focused question testing application",
      "answer": "Concise intuitive answer",
      "memoryHook": "Catchy memory hook"
    }
  ],
  "conceptMindmap": {
    "title": "Descriptive title of the flowchart/process",
    "diagramSummary": "A 1-sentence summary of the visual flow",
    "steps": [
      {
        "stepNumber": 1,
        "label": "Short Stage Name (e.g. Input/Trigger)",
        "detail": "15-20 word description of what occurs in this step",
        "iconType": "start"
      },
      {
        "stepNumber": 2,
        "label": "Mechanism / Process",
        "detail": "15-20 word description of the core reaction or change",
        "iconType": "process"
      },
      {
        "stepNumber": 3,
        "label": "Critical Conversion / Gate",
        "detail": "15-20 word description of energy transfer or calculation",
        "iconType": "decision"
      },
      {
        "stepNumber": 4,
        "label": "Final Output / Equilibrium",
        "detail": "15-20 word description of the outcome",
        "iconType": "outcome"
      }
    ],
    "accessibleDescription": "A complete screen-reader accessible paragraph explaining the visual flowchart step by step."
  },
  "adaptiveQuiz": [
    {
      "id": 1,
      "question": "Multiple choice question testing fundamental concept",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "conceptTag": "Specific Sub-concept Tag",
      "explanation": "Clear explanation of why this answer is correct",
      "optionExplanations": [
        "Why Option A is correct/incorrect",
        "Why Option B is incorrect",
        "Why Option C is incorrect",
        "Why Option D is incorrect"
      ]
    },
    {
      "id": 2,
      "question": "Multiple choice question testing mechanism or cause-and-effect",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "conceptTag": "Specific Sub-concept Tag",
      "explanation": "Clear explanation of why this answer is correct",
      "optionExplanations": [
        "Why Option A is incorrect",
        "Why Option B is correct",
        "Why Option C is incorrect",
        "Why Option D is incorrect"
      ]
    },
    {
      "id": 3,
      "question": "Multiple choice question testing application or common misconception",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "conceptTag": "Specific Sub-concept Tag",
      "explanation": "Clear explanation of why this answer is correct",
      "optionExplanations": [
        "Why Option A is incorrect",
        "Why Option B is incorrect",
        "Why Option C is correct",
        "Why Option D is incorrect"
      ]
    }
  ]
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 2500,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Empty response from Gemini API');
      }

      const parsed: StudyKit = this.parseJsonSafely(rawText);
      return parsed;
    } catch (err: any) {
      console.error('Error in generateStudyKit:', err);
      // Fallback to sample kit or enriched mock
      const sampleKey = Object.keys(SAMPLE_STUDY_KITS).find((k) =>
        topic.toLowerCase().includes(k) || SAMPLE_STUDY_KITS[k].topic.toLowerCase().includes(topic.toLowerCase())
      );
      if (sampleKey) {
        return { ...SAMPLE_STUDY_KITS[sampleKey], mode };
      }
      throw err;
    }
  }

  // Live 'Interrupt & Clarify' endpoint: Responds directly to student's voice doubt
  public async clarifyInterruption(
    doubt: string,
    topic: string,
    interruptedSnippet: string,
    historyContext: string,
    mode: TutorMode
  ): Promise<string> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return `SenseiAI here! You interrupted me when I mentioned "${interruptedSnippet}". Great question: "${doubt}". Here is the quick clarification: Whenever you observe this in practice, think of it as a balancing act where each component adjusts in real time. Does that make this piece clearer, or shall we dive deeper before continuing?`;
    }

    const prompt = `You are SenseiAI, a warm, patient, and highly accessible AI personal tutor.
The student is studying the topic: "${topic}" in "${mode}" mode.
While you were speaking aloud, the student clicked 'Interrupt & Ask Doubt' (or pressed Spacebar) because they were confused by this exact statement you were uttering:
"${interruptedSnippet}"

The student asked this specific doubt question:
"${doubt}"

Context from earlier in the session:
${historyContext}

Instructions:
1. Immediately acknowledge and validate their doubt warmly in 1 sentence.
2. Provide a crystal-clear, direct 2-3 sentence explanation addressing their exact doubt with a simple visual or intuitive analogy.
3. Conclude by asking if they feel comfortable moving forward or want another example.
Keep the entire response under 100 words so it can be cleanly read aloud without overwhelming the student.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I understood your doubt! Let us continue step by step.';
    } catch (e: any) {
      console.error('Clarify error:', e);
      return `I hear you! When we talk about "${interruptedSnippet}", the key idea behind your question "${doubt}" is that causes directly trigger observable reactions. You are right on track! Ready to resume the main lesson?`;
    }
  }

  // 'Fix My Gaps' Targeted Mini-Lesson generator for missed quiz questions
  public async generateRemedialMiniLesson(
    topic: string,
    missedQuestions: QuizQuestion[],
    missedConcepts: string[]
  ): Promise<string> {
    const apiKey = this.getApiKey();

    const missedDetails = missedQuestions
      .map(
        (q) =>
          `- Question: "${q.question}"\n  Missed Concept: ${q.conceptTag}\n  Correct Takeaway: ${q.explanation}`
      )
      .join('\n');

    if (!apiKey) {
      return `### 🎯 Targeted Mini-Lesson: Closing Your Learning Gaps\n\nGreat effort on the quiz! Let's break down where things got tricky:\n\n${missedQuestions
        .map(
          (q, i) =>
            `**${i + 1}. ${q.conceptTag}**\n- **The Trap:** It's easy to mix up inputs and outputs here.\n- **The Key Insight:** Remember that ${q.explanation}\n`
        )
        .join('\n')}\n\n**Quick Mental Model:** Review the mindmap diagram in Tab 3 to see the visual flow from start to finish. Now try the quiz again to lock in your 100%!`;
    }

    const prompt = `You are SenseiAI, diagnosing a student's exact knowledge gaps after they completed a quiz on "${topic}".
The student missed the following questions:
${missedDetails}

Unique knowledge gaps identified: ${missedConcepts.join(', ')}

Please generate a compassionate, high-yield "Targeted Gap-Filler Mini-Lesson":
1. Pinpoint the exact psychological trap or misconception that caused them to pick the wrong option.
2. Provide a vivid 2-sentence analogy to make the correct mechanism click forever.
3. Give them 1 memorable rule of thumb to remember for future tests.
Format using clean Markdown with bold keywords and bullet points.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) throw new Error('Remedial lesson API error');
      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Here is your targeted review to master these missed concepts.'
      );
    } catch (e) {
      console.error('Gap filler error:', e);
      return `### 🎯 Targeted Gap-Filler Mini-Lesson\n\nYou are so close! The main concept to review is **${missedConcepts.join(', ')}**.\n\nKeep in mind: ${missedQuestions[0]?.explanation || 'Review the core definitions and try again!'}`;
    }
  }

  private parseJsonSafely(raw: string): any {
    // Strip markdown code fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    }

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // Try finding the first '{' and last '}'
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const sub = cleaned.substring(firstBrace, lastBrace + 1);
        return JSON.parse(sub);
      }
      throw new Error('Failed to parse Gemini response as JSON: ' + raw.substring(0, 200));
    }
  }
}

export const geminiService = new GeminiService();






