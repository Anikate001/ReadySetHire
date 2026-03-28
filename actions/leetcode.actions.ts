"use server";

import { slugs } from '@/constants';

export const fetchLeetcodeQuestion = async () => {

    try {
        // Get a random slug
        const randomSlugNumber = (Math.floor(Math.random() * Object.keys(slugs).length) + 1).toString(); // generates a random number based on the number of slugs

        const randomSlug: string = slugs[randomSlugNumber];

        const response = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${randomSlug}`);
        const question = await response.json();

        // Extract required fields
        const extractedData = {
            link: question.link,
            questionTitle: question.questionTitle,
            difficulty: question.difficulty,
            question: question.question,
            exampleTestcases: question.exampleTestcases,
            topicTags: question.topicTags?.map((tag: { name: any; }) => tag.name) ?? [], // Using optional chaining and nullish coalescing
            similarQuestions: JSON.parse(question.similarQuestions)?.map((similarQuestion: { title: any; titleSlug: any; difficulty: any; }) => ({
                title: similarQuestion.title,
                titleSlug: similarQuestion.titleSlug,
                difficulty: similarQuestion.difficulty
            })) ?? []
        };
        
        
        return extractedData;

    } catch (e) {
        console.log(e);
        return { error: 'Failed to fetch question' };
    }
}