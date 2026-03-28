"use client";

import { fetchLeetcodeQuestion } from '@/actions/leetcode.actions';
import React, { useState } from 'react';
import { useToast } from './ui/use-toast';

type InterviewType = 'dsa' | 'webdev' | 'consulting';

interface QuestionType {
  link: string;
  questionTitle: string;
  difficulty: string;
  question: string;
  exampleTestcases: string;
  topicTags: string[];
  similarQuestions: {
    title: string;
    titleSlug: string;
    difficulty: string;
  }[];
}

const DSARecommendedQuestions = ({ type }: { type: InterviewType }) => {
  const [question, setQuestion] = useState<QuestionType | undefined>();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGetAnotherQuestion = async () => {
    setLoading(true);
    try {
      const newQuestion = await fetchLeetcodeQuestion();
      // @ts-ignore
      setQuestion(newQuestion);
      setIsFirstTime(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred, please try again later.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const buttonText = loading ? 'Loading...' : isFirstTime ? 'Get a New Question' : 'Get Another Question';
  const buttonClass = `w-full mb-5 flex items-center justify-center cursor-pointer rounded-2xl ${loading ? 'bg-gray-400' : 'bg-[#19232d] hover:bg-[#4c535b]'} text-white px-4 py-2 transition-all mt-4`;

  return (
    <div className="container w-full">
      <button
        onClick={loading ? undefined : handleGetAnotherQuestion}
        disabled={loading}
        className={buttonClass}
      >
        {buttonText}
      </button>
      <div className="w-full rounded-lg h-96 overflow-y-auto custom-scrollbar pb-10">
        {question ? (
          <div>
            <h1 className="text-xl font-bold mb-4">{question.questionTitle}</h1>
            <div className="mb-4 text-sm" dangerouslySetInnerHTML={{ __html: question.question }} />
            <div className="mb-4">
              <h2 className="text-md font-semibold">Difficulty: {question.difficulty}</h2>
            </div>
            <div className="mb-4">
              <h2 className="text-md font-semibold">Example Test Cases:</h2>
              <pre className="bg-gray-600 p-2 rounded text-sm">{question.exampleTestcases}</pre>
            </div>
            <div className="mb-4">
              <h2 className="text-md font-semibold">Topic Tags:</h2>
              <ul className="flex flex-wrap gap-2">
                {question.topicTags?.map(tag => (
                  <li key={tag} className="bg-blue-200 cursor-pointer text-blue-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h2 className="text-md font-semibold">Similar Questions:</h2>
              <ul className="list-disc pl-5 text-sm">
                {question.similarQuestions?.map(similar => (
                  <li key={similar.titleSlug}>
                    <a
                      href={`https://leetcode.com/problems/${similar.titleSlug}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {similar.title} - {similar.difficulty}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <a
                href={question.link}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on LeetCode
              </a>
            </div>
          </div>
        ) : (
          isFirstTime && (
            <div className="text-center text-gray-400 p-4">
              Practice questions with your peers.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DSARecommendedQuestions;
