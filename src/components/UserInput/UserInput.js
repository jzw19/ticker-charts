import React, { useEffect, useState } from 'react';
import api from '../../util/api';
import mockApi from '../../util/mockApi';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import './UserInput.scss';

export const UserInput = ({
  tickerSymbols,
  isTickerComparisonChartEnabled,
  setTickerData,
  setTickerSymbols,
  setIsTickerComparisonChartEnabled,
  setShouldRerender
}) => {
  const [tickerSymbolOptions, setTickerSymbolOptions] = useState([]);
  const [selectedTickerSymbol, setSelectedTickerSymbol] = useState('');
  const [fromDate, setFromDate] = useState({ year: '2020', month: '01', day: '01' });
  const [toDate, setToDate] = useState({ year: '2020', month: '02', day: '01' });

  useEffect(async () => {
    await mockApi.getTickerList().then(
      (response) => setTickerSymbolOptions(response),
      (err) => console.error(err)
    );
  }, []);

  const getTickerDataInRange = async () => {
    const formattedTickerSymbols = Object.keys(tickerSymbols).join(',');
    const formattedFromDate = `${fromDate.year}-${fromDate.month}-${fromDate.day}`;
    const formattedToDate = `${toDate.year}-${toDate.month}-${toDate.day}`;
    setShouldRerender(true);

    await mockApi.getTickerData(formattedTickerSymbols, formattedFromDate, formattedToDate).then(
      (response) => {
        setTickerData(response);
        setShouldRerender(false);
      }, 
      (err) => console.error(err)
    );
  }

  const addTickerSymbol = () => {
    const nextTickerSymbols = {...tickerSymbols};
    nextTickerSymbols[selectedTickerSymbol] = true;
    setTickerSymbols(nextTickerSymbols);
  }

  const handleUpdateFrom = (value) => {
    const year = `${value.getFullYear()}`;
    const month = value.getMonth() + 1 < 10 ? `0${value.getMonth() + 1}` : `${value.getMonth() + 1}`;
    const day = value.getDate() < 10 ? `0${value.getDate()}` : `${value.getDate()}`;
    setFromDate({
      year,
      month,
      day
    });
  }
  
  const handleUpdateTo = (value) => {
    const year = `${value.getFullYear()}`;
    const month = value.getMonth() + 1 < 10 ? `0${value.getMonth() + 1}` : `${value.getMonth() + 1}`;
    const day = value.getDate() < 10 ? `0${value.getDate()}` : `${value.getDate()}`;
    setToDate({
      year,
      month,
      day
    });
  }

  const handleSelectTickerSymbol = (event) => {
    setSelectedTickerSymbol(event.target.value);
  }

  const generateTickerOptions = () => {
    const options = [];
    for(const tickerSymbol of tickerSymbolOptions) {
      options.push(<option key={tickerSymbol} value={tickerSymbol}>{tickerSymbol}</option>);
    }
    if(tickerSymbolOptions.length && !selectedTickerSymbol.length) {
      setSelectedTickerSymbol(tickerSymbolOptions[0]);
    }
    return(
      <select value={selectedTickerSymbol} onChange={handleSelectTickerSymbol}>
        {options}
      </select>
    );
  }

  const toggleTickerComparisonChart = () => {
    setIsTickerComparisonChartEnabled(!isTickerComparisonChartEnabled);
  }

  return(
    <div className='userInputContainer'>
      <span>Add ticker: </span>
      {generateTickerOptions()}
      <button onClick={addTickerSymbol}>Add</button>
      <br/>
      <div>
        SYMBOLS ADDED: {Object.keys(tickerSymbols).join(',')}
      </div>

      <div className='allCalendarsContainer'>
        <div className='fromCalendarContainer'>
          <br/>FROM<br/>
          <Calendar className='calendar from' onChange={handleUpdateFrom}/>
        </div>
        <div className='toCalendarContainer'>
          <br/>TO<br/>
          <Calendar className='calendar to' onChange={handleUpdateTo}/>
        </div>
      </div>

      <br/>
      <input type='checkbox' onClick={toggleTickerComparisonChart} value={isTickerComparisonChartEnabled}/> Toggle ticker comparison chart
      <br/>
      <button onClick={getTickerDataInRange}>Generate Charts</button>
    </div>
  )
}

UserInput.propTypes = {
  setTickerData: PropTypes.func
}

export default UserInput;