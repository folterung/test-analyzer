import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

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

export default function TestDetail() {
  const { name } = useParams();
  const [record, setRecord] = useState<TestRecord | null>(null);

  useEffect(() => {
    fetch('/results.json')
      .then((r) => r.json())
      .then((res: Results) => {
        const found = res.tests.find((t) => t.name === name);
        setRecord(found || null);
      });
  }, [name]);

  useEffect(() => {
    if (!record) return;
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = {
      labels: record.statusHistory.map((_, i) => `${i + 1}`),
      datasets: [
        {
          label: 'Status',
          data: record.statusHistory.map((s) => (s === 'fail' ? 1 : 0)),
          backgroundColor: record.statusHistory.map((s) => (s === 'fail' ? 'red' : 'green')),
        },
      ],
    };
    new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 1 } },
      },
    });
  }, [record]);

  if (!record) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-600 underline">Back</Link>
      <h2 className="text-xl font-bold mb-4">{record.name}</h2>
      <canvas id="chart" height="100"></canvas>
    </div>
  );
}
