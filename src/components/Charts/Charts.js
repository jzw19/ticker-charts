import React, {useEffect, useState} from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { jsPDF } from 'jspdf';
import PropTypes from 'prop-types';

import './Charts.scss';
export const Charts = ({
  tickerData,
  tickerSymbols,
  isTickerComparisonChartEnabled
}) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => formatDataByTicker(), [tickerData]);

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
          x: chartData[tickerSymbol][dateKey].date,
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

    let yOffset = 10;
    pdf.text(title, canvasHalfWidth, yOffset, 'center');
    yOffset += spaceBetweenCanvases;
    // CanvasJS adds 2 <canvas> elements with the same className to the DOM per chart. The one that display the data is always the first.    
    for(let i = 0; i < allStockCharts.length; i+=2) {
      pdf.addImage(allStockCharts[i].toDataURL(), 'JPEG', xOffsetForImage, yOffset, canvasHalfWidth, canvasHalfWidth);
      yOffset += canvasHalfWidth + spaceBetweenCanvases;
      // pdf.text('table goes here', canvasHalfWidth, yOffset, 'center');
      // yOffset += canvasHalfWidth + (spaceBetweenCanvases * 2); // this needs to be calculated to be the height of the table + space between
      if(yOffset > pdf.internal.pageSize.height - 130) {
        pdf.addPage();
        yOffset = 20;
      }
    }
    pdf.save('stock-charts.pdf');
  }
  
  return(
    <div className='stockChartsContainer'>
      {Object.keys(tickerData).length ? null : 'No data available yet. Please click the "Generate Charts" button to fetch data.'}
      <br/>
      {generateCharts()}
      <br/>
      <button className='exportChartsButton' onClick={exportCharts} /*disabled={Object.keys(tickerData).length === 0}*/>Export as PDF</button>
    </div>
  );
}

Charts.propTypes = {
  tickerData: PropTypes.object,
  tickerSymbols: PropTypes.object,
  isTickerComparisonChartEnabled: PropTypes.bool
}

export default Charts;