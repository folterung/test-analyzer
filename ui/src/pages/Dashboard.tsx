import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface TestRecord {
  name: string;
  statusHistory: ('pass' | 'fail')[];
  passCount: number;
  failCount: number;
  flakeScore: number;
  isFlaky: boolean;
}

interface Results {
  command: string;
  repeat: number;
  tests: TestRecord[];
}

export default function Dashboard() {
  const [results, setResults] = useState<Results | null>(null);
  const [showOnlyFlaky, setShowOnlyFlaky] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'flake'>('flake');

  useEffect(() => {
    fetch('/results.json')
      .then((r) => r.json())
      .then(setResults)
      .catch(() => {});
  }, []);

  const tests = results?.tests || [];
  const filtered = tests.filter((t) => (showOnlyFlaky ? t.isFlaky : true));
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'flake') return b.flakeScore - a.flakeScore;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flake Dashboard</h1>
      <div className="mb-2 space-x-4">
        <label>
          <input type="checkbox" checked={showOnlyFlaky} onChange={(e) => setShowOnlyFlaky(e.target.checked)} /> Show only flaky
        </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="border p-1">
          <option value="flake">Sort by flake score</option>
          <option value="name">Sort by name</option>
        </select>
      </div>
      <table className="table-auto w-full text-left border">
        <thead>
          <tr>
            <th className="border px-2">Test Name</th>
            <th className="border px-2">Flake %</th>
            <th className="border px-2">Fails</th>
            <th className="border px-2">History</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => (
            <tr key={t.name} className="border-b hover:bg-gray-50">
              <td className="px-2 py-1 text-blue-600 underline">
                <Link to={`/test/${encodeURIComponent(t.name)}`}>{t.name}</Link>
              </td>
              <td className="px-2 py-1">{t.flakeScore.toFixed(0)}%</td>
              <td className="px-2 py-1">{t.failCount}</td>
              <td className="px-2 py-1">
                {t.statusHistory.map((s, idx) => (
                  <span key={idx}>{s === 'pass' ? '✅' : '❌'}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
