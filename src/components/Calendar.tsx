'use client';

import { useEffect, useState } from 'react';
import { Calendar as RSuiteCalendar } from 'rsuite';
import { PoopCalendar } from "@/types/PoopCalendar";
import Image from 'next/image';
import 'rsuite/dist/rsuite.min.css';
import { fetchPoopCalendar } from "@/requests/fetchPoopCalendar";


export default function Calendar() {
    const [calendar, setCalendar] = useState<PoopCalendar[]>();
    const [loading, setLoading] = useState(false);

    const onLoadCalendar = async () => {
        try {
            const initialData = await fetchPoopCalendar();
            setCalendar(initialData);
        } catch (error) {
            console.error('Error fetching initial calendar data:', error);
        }
    }

    useEffect(() => {
        onLoadCalendar();
    }, []);

    // Create a map of dates that have poop entries
    const poopDates = new Set(
        calendar?.map(item => {
            const date = new Date(item.started_at);
            return date.toDateString();
        })
    );

    // Custom cell renderer to show indicators for dates with entries
    const renderCell = (date: Date) => {
        const dateString = date.toDateString();
        const hasEntry = poopDates.has(dateString);
        
        // Count entries for this date
        const entriesCount = calendar?.filter(item => {
            const itemDate = new Date(item.started_at);
            return itemDate.toDateString() === dateString;
        }).length;

        return (
            <div className="relative w-full h-full">
                {hasEntry && (
                    <div className="flex items-center justify-center space-x-1">
                        <Image src="/favicon.png" alt="Poop" width={15} height={15} />
                        {entriesCount && entriesCount > 1 && (
                            <span className="text-xs text-amber-600 font-semibold">
                                {entriesCount}
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const countBestDayStrake = () => {
        const dateCount: { [key: string]: number } = {};
        calendar?.forEach(item => {
            const dateString = new Date(item.started_at).toDateString();
            dateCount[dateString] = (dateCount[dateString] || 0) + 1;
        });

        const maxCount = Math.max(...Object.values(dateCount));
        return maxCount;
    }

    const bestDayStrake = () => {
        // Find the date with most entries
        const dateCount: { [key: string]: number } = {};
        calendar?.forEach(item => {
            const dateString = new Date(item.started_at).toDateString();
            dateCount[dateString] = (dateCount[dateString] || 0) + 1;
        });

        const maxCount = Math.max(...Object.values(dateCount));
        const bestDate = Object.keys(dateCount).find(date => dateCount[date] === maxCount);
        return bestDate ? new Date(bestDate).toLocaleDateString() : '';
    }

    const bestContinuousStreak = () => {
        // Get unique dates with entries
        const uniqueDates = Array.from(new Set(
            calendar?.map(item => new Date(item.started_at).toDateString())
        )).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        if (uniqueDates.length === 0) return 0;

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i - 1]);
            const currentDate = new Date(uniqueDates[i]);
            const daysDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

            if (daysDiff === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        return maxStreak;
    }
    

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold !text-white flex items-center">
                        Calendar
                    </h1>
                    <div className="text-sm text-gray-400">
                        Total entries: <span className="text-amber-500 font-semibold">{calendar?.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="calendar-container">
                        <style jsx global>{`
                            .rs-calendar {
                                background-color: transparent !important;
                                color: white !important;
                                margin-bottom: 2rem !important;
                            }
                            .rs-calendar-table-cell {
                                background-color: #374151 !important;
                                border: 1px solid #4b5563 !important;
                                color: #e5e7eb !important;
                            }
                            .rs-calendar-table-cell:hover {
                                background-color: #4b5563 !important;
                            }
                            .rs-calendar-table-cell-selected {
                                background-color: #3b82f6 !important;
                                color: white !important;
                            }
                            .rs-calendar-table-cell-disabled {
                                background-color: #1f2937 !important;
                                color: #6b7280 !important;
                            }
                            .rs-calendar-header {
                                background-color: #1f2937 !important;
                                color: white !important;
                                border-bottom: 1px solid #4b5563 !important;
                                margin-bottom: 1.5rem !important;
                                padding: 1rem !important;
                            }
                            .rs-calendar-header-title {
                                color: white !important;
                                font-size: 1.25rem !important;
                                font-weight: 600 !important;
                                margin: 0 1rem !important;
                            }
                            .rs-calendar-header-backward,
                            .rs-calendar-header-forward {
                                color: #9ca3af !important;
                                padding: 0.5rem !important;
                                border-radius: 0.375rem !important;
                            }
                            .rs-calendar-header-backward:hover,
                            .rs-calendar-header-forward:hover {
                                color: white !important;
                                background-color: #4b5563 !important;
                            }
                            .rs-calendar-table-header-cell {
                                background-color: #1f2937 !important;
                                color: #9ca3af !important;
                                border: 1px solid #4b5563 !important;
                            }
                            .rs-calendar-header-month-toolbar {
                                margin-bottom: 1rem !important;
                            }
                            .rs-calendar-header-title-date {
                                color: white !important;
                                font-weight: 600 !important;
                            }
                            .rs-calendar-header-title-month {
                                color: white !important;
                                font-weight: 600 !important;
                                font-size: 1.1rem !important;
                            }
                            .rs-calendar-header-title-year {
                                color: #d1d5db !important;
                                font-weight: 500 !important;
                            }
                            .rs-btn-today {
                                background-color: #f59e0b !important;
                                border-color: #f59e0b !important;
                                color: white !important;
                                font-weight: 500 !important;
                                margin-left: 1rem !important;
                                padding: 0.5rem 1rem !important;
                                border-radius: 0.375rem !important;
                            }
                            .rs-btn-today:hover {
                                background-color: #d97706 !important;
                                border-color: #d97706 !important;
                                color: white !important;
                            }
                            .rs-calendar-month-dropdown-toggle,
                            .rs-calendar-month-dropdown-toggle:hover,
                            .rs-calendar-month-dropdown-toggle:focus {
                                color: white !important;
                                background-color: transparent !important;
                                border: none !important;
                                font-weight: 600 !important;
                            }
                        `}</style>
                        
                        <RSuiteCalendar
                            compact
                            renderCell={renderCell}
                            className="w-full"
                        />
                    </div>
                )}

                {/* Statistics */}
                {calendar && calendar?.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h3 className="text-lg font-semibold !text-white !mb-4">Statistics</h3>
                        <div className="space-y-4">
                            {/* Best streak of continuous days */}
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <span className="text-gray-300 font-medium">Best Streak</span>
                                        <p className="text-xs text-gray-400 mt-1">Longest consecutive days with entries</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-amber-500 font-bold text-lg">
                                            {bestContinuousStreak()} days
                                        </span>
                                    </div>
                                </div>
                                
                            </div>

                            {/* Best day with most entries */}
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <span className="text-gray-300 font-medium">Best Day</span>
                                        <p className="text-xs text-gray-400 mt-1">Day with the most entries</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex flex-col items-center">
                                            <span className="text-amber-500 font-bold text-lg">{countBestDayStrake()} entries</span>
                                            <span className="text-xs text-gray-400 ml-2">{bestDayStrake()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}