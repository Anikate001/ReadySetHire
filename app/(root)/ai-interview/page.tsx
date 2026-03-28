"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Camera, Send, Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
import { transcribeAudioAndGetFeedback, getTextResponseAndFeedback } from '@/actions/groq.actions';
import { motion, AnimatePresence } from 'framer-motion';

type Domain = 'DSA' | 'WebDev' | '';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

interface InterviewState {
    isRecording: boolean;
    transcript: string;
    interviewFeedback: string;
    selectedDomain: Domain;
    interviewStarted: boolean;
    isProcessing: boolean;
    error: string | null;
    conversationHistory: Message[];
}

const AiInterview: React.FC = () => {
    const [state, setState] = useState<InterviewState>({
        isRecording: false,
        transcript: '',
        interviewFeedback: '',
        selectedDomain: '',
        interviewStarted: false,
        isProcessing: false,
        error: null,
        conversationHistory: [],
    });

    const [textInput, setTextInput] = useState('');
    const [autoSpeak, setAutoSpeak] = useState(true);
    const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (state.interviewStarted) {
            initializeMediaDevices();
        }
        return () => {
            cleanupMediaDevices();
        };
    }, [state.interviewStarted]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [state.conversationHistory]);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Load voices when available
    useEffect(() => {
        const loadVoices = () => {
            // Voices might not be loaded immediately
            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
            }
        };
        loadVoices();
    }, []);

    // Auto-speak new AI responses
    useEffect(() => {
        if (autoSpeak && state.conversationHistory.length > 0 && !state.isProcessing) {
            const lastMessage = state.conversationHistory[state.conversationHistory.length - 1];
            // Only auto-speak if it's a new AI message (not the initial one on interview start)
            if (lastMessage.role === 'ai') {
                // Small delay to ensure the message is fully rendered
                const timeoutId = setTimeout(() => {
                    const lastIndex = state.conversationHistory.length - 1;
                    // Only speak if not already speaking this message
                    if (speakingIndex !== lastIndex) {
                        speakText(lastMessage.content, lastIndex);
                    }
                }, 100);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [state.conversationHistory.length, autoSpeak, state.isProcessing]);

    const initializeMediaDevices = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = handleAudioStop;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            setState(prev => ({ ...prev, error: 'Failed to access camera or microphone. Please check your permissions.' }));
        }
    };

    const cleanupMediaDevices = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const startInterview = () => {
        if (state.selectedDomain) {
            const initialMessage: Message = { role: 'ai', content: "Hello! Let's start the interview. Can you please introduce yourself?" };
            setState(prev => ({
                ...prev,
                interviewStarted: true,
                // interviewFeedback: ,
                error: null,
                conversationHistory: [initialMessage]
            }));
        } else {
            setState(prev => ({ ...prev, error: "Please select a domain before starting the interview." }));
        }
    };

    const startRecording = () => {
        if (mediaRecorderRef.current) {
            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
            setState(prev => ({ ...prev, isRecording: true, error: null }));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && state.isRecording) {
            mediaRecorderRef.current.stop();
            setState(prev => ({ ...prev, isRecording: false, isProcessing: true, error: null }));
        }
    };

    const handleAudioStop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async function () {
                const base64Audio = reader.result as string;
                const base64AudioContent = base64Audio.split(',')[1];

                const { transcript, feedback } = await transcribeAudioAndGetFeedback(
                    base64AudioContent, 
                    state.selectedDomain,
                    state.conversationHistory
                );

                setState(prev => {
                    const updatedHistory = [
                        ...prev.conversationHistory,
                        { role: 'user' as 'user', content: transcript },
                        { role: 'ai' as 'ai', content: feedback }
                    ];
                    return {
                        ...prev,
                        transcript,
                        // interviewFeedback: feedback,
                        isProcessing: false,
                        error: null,
                        conversationHistory: updatedHistory
                    };
                });
            }
        } catch (error) {
            console.error('Error processing interview response:', error);
            setState(prev => ({
                ...prev,
                isProcessing: false,
                error: (error as Error).message || 'An unexpected error occurred. Please try again.'
            }));
        }
    };

    const handleTextSubmit = async () => {
        if (!textInput.trim() || state.isProcessing) {
            return;
        }

        const userText = textInput.trim();
        setTextInput('');
        setState(prev => ({ ...prev, isProcessing: true, error: null }));

        try {
            const { feedback } = await getTextResponseAndFeedback(
                userText,
                state.selectedDomain,
                state.conversationHistory
            );

            setState(prev => {
                const updatedHistory = [
                    ...prev.conversationHistory,
                    { role: 'user' as 'user', content: userText },
                    { role: 'ai' as 'ai', content: feedback }
                ];
                return {
                    ...prev,
                    isProcessing: false,
                    error: null,
                    conversationHistory: updatedHistory
                };
            });
        } catch (error) {
            console.error('Error processing text response:', error);
            setState(prev => ({
                ...prev,
                isProcessing: false,
                error: (error as Error).message || 'An unexpected error occurred. Please try again.'
            }));
        }
    };

    const handleTextKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTextSubmit();
        }
    };

    const speakText = (text: string, messageIndex: number) => {
        if (!window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Stop any current speech
        window.speechSynthesis.cancel();
        setIsPaused(false);

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure speech settings
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 1.0; // Full volume

        // Try to use a natural-sounding voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.includes('en') && 
            (voice.name.includes('Natural') || voice.name.includes('Neural') || voice.name.includes('Premium'))
        ) || voices.find(voice => voice.lang.includes('en-US')) || voices[0];
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            setSpeakingIndex(messageIndex);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setSpeakingIndex(null);
            setIsPaused(false);
            speechSynthesisRef.current = null;
        };

        utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
            setSpeakingIndex(null);
            setIsPaused(false);
            speechSynthesisRef.current = null;
        };

        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const pauseSpeech = () => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeSpeech = () => {
        if (window.speechSynthesis && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const stopSpeech = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setSpeakingIndex(null);
            setIsPaused(false);
            speechSynthesisRef.current = null;
        }
    };

    const handleSpeakMessage = (text: string, messageIndex: number) => {
        if (speakingIndex === messageIndex && !isPaused) {
            pauseSpeech();
        } else if (speakingIndex === messageIndex && isPaused) {
            resumeSpeech();
        } else {
            stopSpeech();
            speakText(text, messageIndex);
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-100">
            <h1 className="text-2xl font-bold p-4">AI Interview</h1>
            <AnimatePresence>
                {state.error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4"
                        role="alert"
                    >
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{state.error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            {!state.interviewStarted ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-grow flex flex-col justify-center items-center p-4"
                >
                    <select
                        value={state.selectedDomain}
                        onChange={(e) => setState(prev => ({ ...prev, selectedDomain: e.target.value as Domain, error: null }))}
                        className="w-full max-w-md p-2 mb-4 border rounded"
                    >
                        <option value="">Select Domain</option>
                        <option value="DSA">Data Structures and Algorithms</option>
                        <option value="WebDev">Web Development</option>
                    </select>
                    <Button onClick={startInterview} className="w-full max-w-md">
                        Start Interview
                    </Button>
                </motion.div>
            ) : (
                <div className="flex-grow flex overflow-hidden">
                    <div className="w-1/2 flex flex-col p-4 overflow-hidden">
                        <div className="h-1/2 mb-2">
                            <video ref={videoRef} autoPlay muted className="w-full h-full bg-black rounded-lg object-cover"></video>
                        </div>
                        <div className="h-1/2 mt-2 bg-white rounded-lg p-4 shadow-inner overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-2">Feedback and Ratings</h2>
                            <p>{state.interviewFeedback || 'Feedback and ratings will be displayed here after the interview.'}</p>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col p-4 overflow-hidden">
                        <div ref={chatContainerRef} className="flex-grow bg-white rounded-lg p-4 shadow-inner overflow-y-auto">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-semibold">Conversation</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setAutoSpeak(!autoSpeak);
                                            if (!autoSpeak === false) {
                                                stopSpeech();
                                            }
                                        }}
                                        className={`p-2 rounded transition-colors ${
                                            autoSpeak 
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        title={autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
                                    >
                                        {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                    </button>
                                    {speakingIndex !== null && (
                                        <button
                                            onClick={stopSpeech}
                                            className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                            title="Stop speech"
                                        >
                                            <Square className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <AnimatePresence>
                                {state.conversationHistory.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`mb-2 p-2 rounded flex items-start justify-between gap-2 ${
                                            message.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
                                        } ${speakingIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="flex-1">
                                            <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> {message.content}
                                        </div>
                                        {message.role === 'ai' && (
                                            <button
                                                onClick={() => handleSpeakMessage(message.content, index)}
                                                className={`p-1.5 rounded transition-colors flex-shrink-0 ${
                                                    speakingIndex === index
                                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                                title={
                                                    speakingIndex === index && !isPaused
                                                        ? 'Pause speech'
                                                        : speakingIndex === index && isPaused
                                                        ? 'Resume speech'
                                                        : 'Play speech'
                                                }
                                            >
                                                {speakingIndex === index && !isPaused ? (
                                                    <Pause className="h-3 w-3" />
                                                ) : (
                                                    <Play className="h-3 w-3" />
                                                )}
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="mt-4 space-y-3">
                            <div className="flex gap-2">
                                <Textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyDown={handleTextKeyPress}
                                    placeholder="Type your response here... (Press Enter to send, Shift+Enter for new line)"
                                    disabled={state.isProcessing}
                                    className="flex-1 resize-none"
                                    rows={3}
                                />
                                <Button
                                    onClick={handleTextSubmit}
                                    disabled={state.isProcessing || !textInput.trim()}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or</span>
                                </div>
                            </div>
                            <Button
                                onClick={state.isRecording ? stopRecording : startRecording}
                                disabled={state.isProcessing}
                                className={`w-full transition-all text-white duration-300 ${state.isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {state.isRecording ? <Camera className="mr-2" /> : <Mic className="mr-2" />}
                                {state.isRecording ? 'Stop' : 'Start'} Recording
                            </Button>
                        </div>
                        {state.isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gray-600 mt-2"
                            >
                                Processing your response...
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiInterview;