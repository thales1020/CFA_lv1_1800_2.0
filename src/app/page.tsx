'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { Exam } from '@/types';

export default function HomePage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExams() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('exams')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setExams(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exams');
        setIsLoading(false);
      }
    }

    fetchExams();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#DFE7EB] flex items-center justify-center">
        <div className="text-[#4D4C4D] text-xl">Loading exams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#DFE7EB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading exams</div>
          <div className="text-[#4D4C4D]">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DFE7EB] text-[#4D4C4D]">
      <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 w-full mb-8">
        <div className="text-xl font-bold text-[#4D4C4D]">
          CFA Mock Exam Simulator
        </div>
        <Link
          href="/history"
          className="bg-[#4D4C4D] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#3D3C3D] transition-colors"
        >
          View History
        </Link>
      </header>

      <div className="px-8 pb-8">
        <h1 className="text-2xl font-bold text-center mb-8">Available Exams</h1>

        {exams.length === 0 ? (
          <div className="text-center text-[#4D4C4D]">
            <p className="mb-4">No exams available yet.</p>
            <p className="text-sm text-gray-600">Please run the insert-sample-questions.sql script to add sample exams.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border border-[#CCCCCC] rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-bold mb-2">{exam.title}</h2>
                
                <p className="text-sm mb-4 line-clamp-2 text-gray-600">
                  {exam.description || 'No description available'}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{exam.duration_minutes} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{exam.total_questions} questions</span>
                  </div>
                </div>

                <Link
                  href={`/exam/${exam.id}`}
                  className="block w-full text-center bg-[#749B44] text-white font-bold py-3 rounded hover:bg-[#5A7A30] transition-colors"
                >
                  Start Exam
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
