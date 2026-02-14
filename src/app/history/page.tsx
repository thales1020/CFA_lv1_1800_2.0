'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface AttemptWithExam {
  id: string;
  created_at: string;
  score: number;
  time_spent_seconds: number;
  exams: {
    title: string;
    total_questions: number;
  } | null;
}

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<AttemptWithExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data, error } = await supabase
          .from('attempts')
          .select('id, created_at, score, time_spent_seconds, exam_id')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map attempts with exam details
        const attemptsWithExams = (data || []).map((attempt: any) => {
          return {
            id: attempt.id,
            created_at: attempt.created_at,
            score: attempt.score,
            time_spent_seconds: attempt.time_spent_seconds,
            exams: {
              title: 'CFA Level 1 Mock Exam',
              total_questions: 20
            }
          };
        });
        
        setAttempts(attemptsWithExams);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#DFE7EB] flex flex-col">
        <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <div className="text-xl font-bold text-[#4D4C4D]">Exam History</div>
          <Link
            href="/"
            className="bg-[#749B44] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded shadow-sm p-8 text-center">
              <p className="text-[#4D4C4D]">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#DFE7EB] flex flex-col">
      <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-8">
        <div className="text-xl font-bold text-[#4D4C4D]">Exam History</div>
        <Link
          href="/"
          className="bg-[#749B44] text-white px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {attempts.length === 0 ? (
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded shadow-sm p-8 text-center">
              <p className="text-[#4D4C4D]">No records found</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto overflow-x-auto bg-white shadow-sm rounded">
            <table className="w-full">
              <thead className="bg-[#4D4C4D] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Exam</th>
                  <th className="px-6 py-4 text-left font-semibold">Score/Total</th>
                  <th className="px-6 py-4 text-left font-semibold">Time Spent</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-[#4D4C4D]">
                      {formatDate(attempt.created_at)}
                    </td>
                    <td className="px-6 py-4 text-[#4D4C4D]">
                      {attempt.exams?.title || 'Unknown Exam'}
                    </td>
                    <td className="px-6 py-4 text-[#4D4C4D]">
                      {attempt.score}/{attempt.exams?.total_questions || 0}
                    </td>
                    <td className="px-6 py-4 text-[#4D4C4D]">
                      {formatTime(attempt.time_spent_seconds)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/result/${attempt.id}`}
                        className="inline-block px-4 py-2 bg-[#749B44] text-white rounded hover:bg-[#5D7A35] transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
