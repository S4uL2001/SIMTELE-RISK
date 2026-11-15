import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { Data, Layout } from 'plotly.js';

interface PlotlyChartProps {
  data: Data[];
  layout?: Partial<Layout>;
  className?: string;
}

export default function PlotlyChart({ data, layout, className = '' }: PlotlyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const defaultLayout: Partial<Layout> = {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { t: 40, r: 20, l: 50, b: 40 },
      xaxis: { gridcolor: '#1e293b', zerolinecolor: '#1e293b' },
      yaxis: { gridcolor: '#1e293b', zerolinecolor: '#1e293b' },
      legend: { orientation: 'h', y: 1.1 },
      ...layout,
    };

    Plotly.newPlot(chartRef.current, data, defaultLayout, { responsive: true, displayModeBar: false });

    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [data, layout]);

  return <div ref={chartRef} className={`w-full h-full min-h-[400px] ${className}`} />;
}