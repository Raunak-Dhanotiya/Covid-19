import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8', // slate-400
        font: { family: "'Inter', sans-serif", size: 12 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(2, 6, 23, 0.9)', // slate-950
      titleColor: '#e2e8f0', // slate-200
      bodyColor: '#cbd5e1', // slate-300
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 10,
      boxPadding: 4,
      usePointStyle: true
    }
  }
}

export function GlobalTrendChart({ dayWiseData }) {
  if (!dayWiseData || dayWiseData.length === 0) return null

  // Reverse to show oldest to newest if the API returns newest first
  const sortedData = [...dayWiseData].sort((a, b) => new Date(a.date) - new Date(b.date))

  const data = {
    labels: sortedData.map((d) => d.date),
    datasets: [
      {
        label: 'Confirmed',
        data: sortedData.map((d) => d.confirmed),
        borderColor: '#67e8f9', // cyan-300
        backgroundColor: 'rgba(103, 232, 249, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4
      },
      {
        label: 'Deaths',
        data: sortedData.map((d) => d.deaths),
        borderColor: '#f43f5e', // rose-500
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4
      },
      {
        label: 'Recovered',
        data: sortedData.map((d) => d.recovered),
        borderColor: '#10b981', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        hidden: true
      },
      {
        label: 'Active',
        data: sortedData.map((d) => d.active),
        borderColor: '#f59e0b', // amber-500
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        hidden: true
      }
    ]
  }

  const options = {
    ...commonOptions,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', maxTicksLimit: 8 } // slate-500
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#64748b',
          callback: (value) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
            if (value >= 1000) return (value / 1000).toFixed(0) + 'k'
            return value
          }
        }
      }
    }
  }

  return <Line data={data} options={options} />
}

export function RegionalDistributionChart({ regionData, metricLabel = 'Value' }) {
  if (!regionData || regionData.length === 0) return null

  const labels = regionData.map(r => r.region)
  const dataValues = regionData.map(r => r.value)

  const data = {
    labels,
    datasets: [
      {
        label: metricLabel,
        data: dataValues,
        backgroundColor: [
          '#67e8f9', // cyan-300
          '#3b82f6', // blue-500
          '#8b5cf6', // violet-500
          '#f43f5e', // rose-500
          '#f59e0b', // amber-500
          '#10b981', // emerald-500
          '#64748b'  // slate-500
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  }

  const options = {
    ...commonOptions,
    cutout: '70%',
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          boxWidth: 8
        }
      }
    }
  }

  return <Doughnut data={data} options={options} />
}

export function TopCountriesChart({ countries, metric, metricLabel }) {
  if (!countries || countries.length === 0) return null

  const getMetricValue = (country) => {
    if (metric === 'active') {
      return Math.max((country.confirmed || 0) - (country.recovered || 0) - (country.deaths || 0), 0)
    }
    return country?.[metric] || 0
  }

  const data = {
    labels: countries.map(c => c.countryRegion),
    datasets: [
      {
        label: metricLabel,
        data: countries.map(c => getMetricValue(c)),
        backgroundColor: '#67e8f9', // cyan-300
        borderRadius: 4
      }
    ]
  }

  const options = {
    ...commonOptions,
    indexAxis: 'y',
    plugins: {
      ...commonOptions.plugins,
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#64748b',
          callback: (value) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
            if (value >= 1000) return (value / 1000).toFixed(0) + 'k'
            return value
          }
        }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  }

  return <Bar data={data} options={options} />
}
