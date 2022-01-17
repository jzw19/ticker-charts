import React, { useState } from 'react';
import UserInput from '../UserInput/UserInput';
import Charts from '../Charts/Charts';

import './Root.scss';
export const Root = () => {
  const [tickerData, setTickerData] = useState({});
  const [tickerSymbols, setTickerSymbols] = useState({});
  const [isTickerComparisonChartEnabled, setIsTickerComparisonChartEnabled] = useState(false);

  return (
    <div className='root'>
      <div className='instructionsContainer'>
        <div className='instructionsLabel'>INSTRUCTIONS</div>
        <div className='instructionsContent'>
          &nbsp;&nbsp;&nbsp;&nbsp;Add stock ticker symbols by selecting them from the dropdown and clicking the "Add" button.
          When you have selected all the ticker symbols for which you want to generate price history
          charts for, then select the date range you would like to inquire about from the calendars.
          When you are ready, click the "Generate Charts" button to generate line charts for each ticker
          selected. This will display data for each individual ticker. After individual charts have been
          generated, you may then toggle showing the ticker comparison chart, which displays the data
          for each ticker on a single chart.
          <br/><br/>
          <strong>IMPORTANT:</strong> this application is currently using mock data because the response from hitting the actual
          API is returning an empty array for the data.
        </div>
      </div>
      <UserInput
        tickerSymbols={tickerSymbols}
        isTickerComparisonChartEnabled={isTickerComparisonChartEnabled}
        setTickerSymbols={setTickerSymbols}
        setTickerData={setTickerData}
        setIsTickerComparisonChartEnabled={setIsTickerComparisonChartEnabled}
      />
      <br/>
      <Charts
        tickerData={tickerData}
        tickerSymbols={tickerSymbols}
        isTickerComparisonChartEnabled={isTickerComparisonChartEnabled}
      />
    </div>
  );
};

export default Root;