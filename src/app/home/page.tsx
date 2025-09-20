
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPoop, getLastPoop, updatePoop } from '@/requests/fetchPoopCalendar';
import { PoopCalendar } from '@/types/PoopCalendar';
import { fetchGemini } from '@/requests/fetchGemini';

const MAX_SECONDS_ALLOWED = 60 * 60 * 5;   // 5 hours

export default function Home() {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [poop, setPoop] = useState<PoopCalendar | null>(null);
    const [joke, setJoke] = useState<string | null>(null);

    useEffect(() => {
        generateJoke();
        getLast();
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const generateJoke = async () => {
        const joke = await fetchGemini();
        console.log(joke);
        setJoke(joke);
    }

    const toggleTimer = () => {
        if (isRunning) {
            stopPoop();
        } else {
            startPoop();
        }
    };

    const getLast = async () => {
        const lastPoop = await getLastPoop();
        console.log(lastPoop);
        if (lastPoop && !lastPoop.ended_at) {
            const diference = new Date().getTime() - new Date(lastPoop.started_at).getTime();
            const seconds = diference / 1000;
            if (seconds < MAX_SECONDS_ALLOWED) {
                setPoop(lastPoop);
                setIsRunning(true);
                setTime(parseInt(seconds.toString()))
                intervalRef.current = setInterval(intervalAction, 1000);
            } else {
                updatePoop(lastPoop.id);
            }
        }
    }

    const startPoop = async () => {
        setIsRunning(true);
        intervalRef.current = setInterval(intervalAction, 1000);
        const poop = await createPoop();
        setPoop(poop);
    };

    const stopPoop = async () => {
        setIsRunning(false);
        const upPoop = await updatePoop(poop?.id ?? "");
        setPoop(upPoop);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const intervalAction = () => {
        setTime(prevTime => {
            return prevTime + 1;
        });
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                {/* Timer Display */}
                <div className="text-8xl font-mono font-light text-white mb-12">
                    {formatTime(time)}
                </div>

                {/* Control Buttons */}
                <div className="space-y-6">
                    { !poop?.ended_at ? <button
                        onClick={toggleTimer}
                        className={`w-32 h-32 !rounded-full text-white font-medium text-lg transition-all duration-200 ${
                            isRunning 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isRunning ? 'Done' : 'Start'}
                    </button> :

                    <div className="text-center">
                        <div className="text-4xl mb-4">🎉</div>
                        <div className="text-white text-2xl font-medium mb-2">
                            Great job!
                        </div>
                        <div className="text-gray-400 text-l ml-10 mr-10">
                            {joke}
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}