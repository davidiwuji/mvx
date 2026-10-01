'use client';
import { useEffect, useState } from 'react';

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Only count once per session
    const alreadyCounted = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('boxo_visited_session');
    if (!alreadyCounted) {
      // POST to increment counter
      fetch('/api/counter/visit', { method: 'POST' })
        .then(r => r.json())
        .then(d => { setCount(d.count); try { sessionStorage.setItem('boxo_visited_session', '1'); } catch {} })
        .catch(() => {});
    } else {
      // Just GET current count
      fetch('/api/counter/visit')
        .then(r => r.json())
        .then(d => setCount(d.count))
        .catch(() => {});
    }
  }, []);

  if (count === null) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 text-[11px] text-gray-700/40 select-none pointer-events-none font-mono">
      {count.toLocaleString()} visits
    </div>
  );
}
