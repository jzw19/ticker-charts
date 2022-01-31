import React, {useEffect, useState} from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import PropTypes from 'prop-types';

import './Charts.scss';
export const Charts = ({
  tickerData,
  tickerSymbols,
  isTickerComparisonChartEnabled
}) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    formatDataByTicker()
  }, [tickerData]);

  const formatDataByTicker = () => {
    let formattedData = {};
    for(const ticker of Object.keys(tickerSymbols)) {
      formattedData[ticker] = {};
    }
    for(const dateKey of Object.keys(tickerData)) {
      for(const ticker of Object.keys(tickerData[dateKey])) {
        const dayData = {
          date: new Date(dateKey),
          open: tickerData[dateKey][ticker].open,
          close: tickerData[dateKey][ticker].close,
          day_range: tickerData[dateKey][ticker].day_range
        };
        if(!formattedData[ticker]) {
          formattedData[ticker] = {};
        }
        formattedData[ticker][dateKey] = dayData;
      }
    }
    setChartData(formattedData);
  }

  const generateCharts = () => {
    const stockCharts = [];
    let consolidatedDataPoints = {};

    for(const tickerSymbol of Object.keys(chartData)) {
      let dataPoints = [];
      for(const dateKey of Object.keys(chartData[tickerSymbol])) {
        dataPoints.push({
          x: new Date(chartData[tickerSymbol][dateKey].date),
          y: Number.parseFloat(chartData[tickerSymbol][dateKey].close)
        });
      }
      const options = {
        theme: 'light2',
        title: {
          text: tickerSymbol
        },
        axisY: {
          prefix: '$',
          title: 'Price',
          includeZero: false
        },
        axisX: {
          title: 'Date'
        },
        data: [{
          type: 'spline',
          xValueFormatString: 'DD MMM YYYY',
          yValueFormatString: '$#,###.##',
          dataPoints
        }]
      };
      stockCharts.push(
        <div key={tickerSymbol} className='stockChart'>
          <CanvasJSChart options={options} />
        </div>
      );
      if(isTickerComparisonChartEnabled) {
        consolidatedDataPoints[tickerSymbol] = dataPoints;
      }
    }

    if(isTickerComparisonChartEnabled && Object.keys(chartData).length) {
      const consolidatedOptionsData = [];
      for(const tickerSymbol of Object.keys(consolidatedDataPoints)) {
        consolidatedOptionsData.push({
          type: 'spline',
          name: tickerSymbol,
          showInLegend: true,
          dataPoints: consolidatedDataPoints[tickerSymbol]
        });
      }

      const consolidatedOptions = {
        theme: 'light2',
        animationEnabled: true,
        toolTip: {
          shared: true
        },
        title: {
          text: 'Multiple Tickers'
        },
        axisY: {
          prefix: '$',
          title: 'Price',
          includeZero: false
        },
        axisX: {
          title: 'Date'
        },
        data: consolidatedOptionsData
      }
      stockCharts.push(
        <div key='comparisonChart' className='stockChart'>
          <CanvasJSChart options={consolidatedOptions} />
        </div>
      );
    }

    return stockCharts;
  }

  const exportCharts = () => {
    const pdf = new jsPDF();
    const title = 'Stock Charts';
    const canvasHalfWidth = pdf.internal.pageSize.width / 2;
    const spaceBetweenCanvases = 20;
    const xOffsetForImage = (pdf.internal.pageSize.width - canvasHalfWidth) / 2;
    const allStockCharts = Array.from(document.getElementsByClassName('canvasjs-chart-canvas'));
    const tableColumnHeaders = [
      { header: 'Date' },
      { header: 'Open' },
      { header: 'Close' },
      { header: 'Day Range' }
    ];
    const tickerSymbolsArray = Object.keys(tickerSymbols);

    let yOffset = 10;
    pdf.text(title, canvasHalfWidth, yOffset, 'center');
    // CanvasJS adds 2 <canvas> elements with the same className to the DOM per chart. The one that display the data is always the first. 
    for(let i = 0; i < allStockCharts.length && i/2 <= Object.keys(tickerSymbols).length; i+=2) {
      yOffset = 30;
      pdf.addImage(allStockCharts[i].toDataURL(), 'JPEG', xOffsetForImage, yOffset, canvasHalfWidth, canvasHalfWidth);
      yOffset += canvasHalfWidth + spaceBetweenCanvases;
      const rows = generateTableRows(tickerSymbolsArray[i/2]);
      pdf.autoTable({
        columns: tableColumnHeaders,
        body: rows, 
        startY: yOffset
      });
      pdf.addPage();
    }
    // delete extra blank page
    pdf.deletePage(pdf.internal.getNumberOfPages());
    pdf.save('stock-charts.pdf');
  }

  const generateTableRows = (tickerSymbol) => {
    const tableRow = [];
    const dates = chartData[tickerSymbol] ? Object.keys(chartData[tickerSymbol]) : [];
    for(const date of dates) {
      tableRow.push([date, chartData[tickerSymbol][date].open, chartData[tickerSymbol][date].close, chartData[tickerSymbol][date].day_range]);
    }
    return tableRow;
  }
  
  return(
    <div className='stockChartsContainer'>
      {Object.keys(tickerData).length ? null : <span>'No data available yet. Please click the "Generate Charts" button to fetch data.'</span>}
      <br/>
      {generateCharts()}
      <br/>
      <button className='interactiveButton exportChartsButton' onClick={exportCharts} disabled={!Object.keys(tickerData).length}>Export as PDF</button>
    </div>
  );
}

Charts.propTypes = {
  tickerData: PropTypes.object,
  tickerSymbols: PropTypes.object,
  isTickerComparisonChartEnabled: PropTypes.bool
}

export default Charts;