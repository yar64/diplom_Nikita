// components/admin/charts/UserGrowthChart.jsx
'use client';

import { Line } from 'react-chartjs-2';
import { chartOptions } from '../../../chart.config';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'New Users',
      data: [65, 78, 90, 110, 95, 130],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: {
        target: 'origin',
        above: 'rgba(16, 185, 129, 0.1)',
      },
      tension: 0.4,
      pointBackgroundColor: 'rgb(16, 185, 129)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
    {
      label: 'Active Users',
      data: [45, 55, 65, 75, 85, 95],
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
    },
  ],
};

const options = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: true,
      text: 'User Growth',
      font: {
        size: 14,
        weight: 'bold'
      }
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    ...chartOptions.scales,
    y: {
      ...chartOptions.scales.y,
      title: {
        display: true,
        text: 'Number of Users'
      }
    },
    x: {
      ...chartOptions.scales.x,
      title: {
        display: true,
        text: 'Months'
      }
    }
  }
};

export function UserGrowthChart() {
  return <Line data={data} options={options} />;
}