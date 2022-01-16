import React, { useState } from 'react';
import UserInput from '../UserInput/UserInput';
import Charts from '../Charts/Charts';
import { usePrevious } from '../../util/customHooks';

export const Root = () => {
  const [tickerData, setTickerData] = useState({});
  const [tickerSymbols, setTickerSymbols] = useState([]);
  const [isTickerComparisonChartEnabled, setIsTickerComparisonChartEnabled] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
  const prevShouldRerender = usePrevious(shouldRerender);

  return (
    <div className='Root'>
      <UserInput
        tickerSymbols={tickerSymbols}
        isTickerComparisonChartEnabled={isTickerComparisonChartEnabled}
        setTickerSymbols={setTickerSymbols}
        setTickerData={setTickerData}
        setIsTickerComparisonChartEnabled={setIsTickerComparisonChartEnabled}
        setShouldRerender={setShouldRerender}
      />
      <br/>
      <Charts
        tickerData={tickerData}
        tickerSymbols={tickerSymbols}
        isTickerComparisonChartEnabled={isTickerComparisonChartEnabled}
        shouldRerender={shouldRerender}
        prevShouldRerender={prevShouldRerender}
        setShouldRerender={setShouldRerender}
      />
    </div>
  );
};

export default Root;