// ==============================|| DASHBOARD - BAJAJ AREA CHART ||============================== //
import { ApexOptions } from 'apexcharts';

interface ChartData {
  type: 'area' | 'line' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  height: number;
  options: ApexOptions;
  series: { data: number[] }[];
}

const chartData: ChartData = {
  type: 'area', // This is now restricted to valid chart types
  height: 95,
  options: {
    chart: {
      id: 'support-chart',
      sparkline: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'Ticket '
        }
      },
      marker: {
        show: false
      }
    }
  },
  series: [
    {
      data: [0, 15, 10, 50, 30, 40, 25]
    }
  ]
};

export default chartData;
