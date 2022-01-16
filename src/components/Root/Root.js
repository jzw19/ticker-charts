import React, { useState } from 'react';
import UserInput from '../UserInput/UserInput';

export const Root = () => {
  const [tickerData, setTickerData] = useState(null);
  // console.log(setTickerData);
  return (
    <div className='Root'>
      <UserInput setTickerData={setTickerData} />
      <br/>
      <div>
        {tickerData ? JSON.stringify(tickerData) : 'no data to show here'}
      </div>
    </div>
  );
};

export default Root;