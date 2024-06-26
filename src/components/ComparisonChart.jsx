'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ databases, selectedDbs, width = 500, height = 500 }) {
  const categories = ['deployment', 'scalability', 'data_management', 'vector_similarity_search', 'security'];

  const calculateScore = (db, category) => {
    const categoryData = db[category];
    if (typeof categoryData === 'object') {
      return Object.values(categoryData).filter(Boolean).length;
    }
    return categoryData ? 1 : 0;
  };

  const data = {
    labels: categories.map(c => c.replace('_', ' ')),
    datasets: selectedDbs.map(dbName => {
      const db = databases.find(d => d.name === dbName);
      return {
        label: db.name,
        data: categories.map(category => calculateScore(db, category)),
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        borderWidth: 1,
      };
    }),
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 5
      }
    }
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Radar data={data} options={options} />
    </div>
  );
}
