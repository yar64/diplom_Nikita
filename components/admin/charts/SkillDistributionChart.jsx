// components/admin/charts/SkillDistributionChart.jsx
'use client';

import { Doughnut } from 'react-chartjs-2';
import { chartOptions } from '../../../chart.config';

const data = {
  labels: ['Frontend', 'Backend', 'Database', 'DevOps', 'Design'],
  datasets: [
    {
      label: 'Skill Distribution',
      data: [35, 25, 20, 12, 8],
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
      borderWidth: 2,
    },
  ],
};

const options = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: true,
      text: 'Skill Distribution',
    },
  },
};

export function SkillDistributionChart() {
  return <Doughnut data={data} options={options} />;
}