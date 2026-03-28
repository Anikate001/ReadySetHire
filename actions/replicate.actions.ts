"use server";

import Replicate from "replicate";

const replicate = new Replicate();

export const fetchWebdevQuestionReplicate = async () => {

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
        const input = {
            prompt: `ask me a theoretical question about web development. keep the question length brief your response should be of the format : 'Question: your question Hint: brief hint'`,
            system_prompt: "The interview syllabus includes JavaScript, React, Next.js, SQL, MongoDB, HTML, and CSS. do not keep the question too long. this is how your ideal response should be 'Suppose you are tasked with building a highly available and scalable web application that requires low latency and high throughput. Your team is considering using a distributed architecture, but you're not sure which one would be best suited for the job. Question: Compare and contrast a microservices architecture with a service mesh architecture, and discuss the trade-offs and benefits of each approach in terms of scalability, availability, and performance. Which one would you choose and why?",
            max_tokens: 10000,
            temperature: 0.5,
        };


        let questionAnswer = '';

        for await (const event of replicate.stream(
            "meta/meta-llama-3-70b-instruct:6b4da803a2382c08868c5af10a523892f38e2de1aafb2ee55b020d9efef2fdb8",
            { input }
        )) {
            if (event.event === "output" && event.data.length > 0) {
                questionAnswer += event.data;
            }
        }

        // console.log(questionAnswer);
        return questionAnswer;
    } catch (error) {
        console.error("AI question generation failed:", error);
    }
};


export const fetchConsultingQuestionReplicate = async () => {

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
        const input = {
            prompt: `ask me a random market case study question with sample company names from the real world. Make up detailed background information about the company in the question. keep the question length brief your response should be of the format : 'Question: your question Hint: brief hint'`,
            system_prompt: "The consulting interview syllabus includes case studies about the market. keep the interview questions relevant to India only. do not keep the question too long. example areas of case study: Example 1: Market Entry Case - Should Company A enter Market X? Example 2: Profitability Case - What is causing Company A to lose profits? What can be done to address this issue? Example 3: Merger & Acquisition Case - Should Company A acquire Company B? ",
            max_tokens: 10000,
            temperature: 0.5,
        };


        let questionAnswer = '';

        for await (const event of replicate.stream(
            "meta/meta-llama-3-70b-instruct:6b4da803a2382c08868c5af10a523892f38e2de1aafb2ee55b020d9efef2fdb8",
            { input }
        )) {
            if (event.event === "output" && event.data.length > 0) {
                questionAnswer += event.data;
            }
        }

        // console.log(questionAnswer);
        return questionAnswer;
    } catch (error) {
        console.error("AI question generation failed:", error);
    }
};