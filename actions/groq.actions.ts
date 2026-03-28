"use server";

import Groq from "groq-sdk";

type ConversationMessage = { role: "user" | "ai"; content: string };

const INTERVIEW_SYSTEM_PROMPT = (domain: string) =>
  `You are an AI interviewer conducting a technical interview in the ${domain} domain.
You provide concise, constructive feedback on the candidate's latest answer and then ask exactly one clear follow-up question.
Keep the tone helpful and professional.`;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getTextResponseAndFeedback(
  textInput: string,
  domain: string,
  conversationHistory: ConversationMessage[] = []
): Promise<{ feedback: string }> {
  try {
    if (!textInput.trim()) {
      throw new Error("Text input is empty");
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ client is not configured (missing GROQ_API_KEY).");
    }

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "system",
        content: INTERVIEW_SYSTEM_PROMPT(domain || "general software engineering"),
      },
    ];

    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content,
      });
    });

    messages.push({
      role: "user",
      content: textInput,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("AI feedback response is empty");
    }

    return { feedback: content };
  } catch (error) {
    console.error("Error processing text and getting feedback (Groq):", error);
    throw new Error(
      (error as Error).message || "Failed to process text and get feedback. Please try again."
    );
  }
}

export async function transcribeAudioAndGetFeedback(
  audioBase64: string,
  domain: string,
  conversationHistory: ConversationMessage[] = []
): Promise<{ transcript: string; feedback: string }> {
  try {
    if (!audioBase64) {
      throw new Error("Audio content is empty");
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ client is not configured (missing GROQ_API_KEY).");
    }

    // Convert base64 audio to buffer and then to File for Groq whisper
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const audioFile = new File([audioBuffer], "audio.webm", { type: "audio/webm" });

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile as any,
      model: "whisper-large-v3",
      response_format: "json",
      language: "en",
      temperature: 0.0,
    });

    const transcriptText = (transcription as any).text;

    if (!transcriptText) {
      throw new Error("Transcription result is empty");
    }

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "system",
        content: INTERVIEW_SYSTEM_PROMPT(domain || "general software engineering"),
      },
    ];

    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content,
      });
    });

    messages.push({
      role: "user",
      content: transcriptText,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const feedback = completion.choices[0]?.message?.content?.trim();

    if (!feedback) {
      throw new Error("AI feedback response is empty");
    }

    return {
      transcript: transcriptText,
      feedback,
    };
  } catch (error) {
    console.error("Error processing audio and getting feedback (Groq):", error);
    throw new Error(
      (error as Error).message || "Failed to process audio and get feedback. Please try again."
    );
  }
}

