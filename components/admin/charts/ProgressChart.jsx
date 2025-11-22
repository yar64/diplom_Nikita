// components/admin/charts/ProgressChart.jsx
'use client';

import { Bar } from 'react-chartjs-2';
import { chartOptions } from '../../../chart.config'

const data = {
  labels: ['React', 'Node.js', 'TypeScript', 'UI/UX', 'Python'],
  datasets: [
    {
      label: 'Progress %',
      data: [85, 70, 60, 45, 55],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(139, 92, 246)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
      ],
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
};

const options = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: true,
      text: 'Skill Progress',
      font: {
        size: 14,
        weight: 'bold'
      }
    },
  },
};

export function ProgressChart() {
  return <Bar data={data} options={options} />;
}