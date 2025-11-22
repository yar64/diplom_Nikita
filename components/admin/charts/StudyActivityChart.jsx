// components/admin/charts/StudyActivityChart.jsx
'use client';

import { Line } from 'react-chartjs-2';
import { chartOptions } from '../../../chart.config';

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Study Hours',
      data: [4, 6, 3, 7, 5, 8, 6],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: {
        target: 'origin',
        above: 'rgba(59, 130, 246, 0.1)',
      },
      tension: 0.4,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const options = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: true,
      text: 'Weekly Study Activity',
      font: {
        size: 14,
        weight: 'bold'
      }
    },
  },
};

export function StudyActivityChart() {
  return <Line data={data} options={options} />;
}