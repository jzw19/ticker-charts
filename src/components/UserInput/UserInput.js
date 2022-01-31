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
  setIsTickerComparisonChartEnabled
}) => {
  const [tickerSymbolOptions, setTickerSymbolOptions] = useState([]);
  const [selectedTickerSymbol, setSelectedTickerSymbol] = useState('');
  const [fromDate, setFromDate] = useState({ year: '2020', month: '01', day: '01' });
  const [toDate, setToDate] = useState({ year: '2020', month: '02', day: '01' });
  const [shouldShowErrorMessageForTickers, setShouldShowErrorMessageForTickers] = useState(false);
  const [shouldShowErrorMessageForData, setShouldShowErrorMessageForData] = useState(false);
  const apiInUse = process.env.REACT_APP_API === 'mock' ? mockApi : api;

  useEffect(async () => {
    await apiInUse.getTickerList().then(
      (response) => {
        response.data.length ? setShouldShowErrorMessageForTickers(false) : setShouldShowErrorMessageForTickers(true);
        setTickerSymbolOptions(response.data);
      },
      (err) => {
        setShouldShowErrorMessageForTickers(true);
        console.error(err);
      }
    );
  }, []);

  const getTickerDataInRange = async () => {
    if(!Object.keys(tickerSymbols).length) {
      setShouldShowErrorMessageForData(true);
      return;
    }
    const formattedTickerSymbols = Object.keys(tickerSymbols).join(',');
    const formattedFromDate = `${fromDate.year}-${fromDate.month}-${fromDate.day}`;
    const formattedToDate = `${toDate.year}-${toDate.month}-${toDate.day}`;

    await apiInUse.getTickerData(formattedTickerSymbols, formattedFromDate, formattedToDate).then(
      (response) => {
        setShouldShowErrorMessageForData(false);
        setTickerData(response.data)
      }, 
      (err) => {
        setShouldShowErrorMessageForData(true);
        console.error(err)
      }
    );
  }

  const addTickerSymbol = () => {
    const nextTickerSymbols = {...tickerSymbols};
    nextTickerSymbols[selectedTickerSymbol] = true;
    setTickerSymbols(nextTickerSymbols);
  }

  const removeTickerSymbol = () => {
    const nextTickerSymbols = {...tickerSymbols};
    delete nextTickerSymbols[selectedTickerSymbol];
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
      <select className='tickerSelect' value={selectedTickerSymbol} onChange={handleSelectTickerSymbol}>
        {options}
      </select>
    );
  }

  const toggleTickerComparisonChart = () => {
    setIsTickerComparisonChartEnabled(!isTickerComparisonChartEnabled);
  }

  const renderTickersErrorMessage = () => {
    const errorMessage = 'Oops! Looks like there was a problem getting the ticker symbols.\nPlease refresh the page or opt to use the mock data.';
    return shouldShowErrorMessageForTickers ?
      <div className='errorMessage'>
        <span>{errorMessage}</span><br/>
      </div>
      : null;
  }

  const renderDataErrorMessage = () => {
    const errorMessage = 'There was a problem with fetching the data. Please make sure you have selected at least one ticker symbol and a valid date range.';
    const tickerSymbolsSelected = Object.keys(tickerSymbols).length ? Object.keys(tickerSymbols) : 'None';
    const formattedFromDate = `${fromDate.month}-${fromDate.day}-${fromDate.year}`;
    const formattedToDate = `${toDate.month}-${toDate.day}-${toDate.year}`;
    return shouldShowErrorMessageForData ?
      <div className='errorMessage'>
        <span>{errorMessage}</span><br/><br/>
        <span>Ticker symbols selected: {tickerSymbolsSelected}</span><br/>
        <span>From date (mm-dd-yyyy): {formattedFromDate}</span><br/>
        <span>To date (mm-dd-yyyy): {formattedToDate}</span><br/>
      </div>
      : null;
  }

  return(
    <div className='userInputContainer'>
      <span>Choose ticker: </span>
      {generateTickerOptions()}
      <button className='interactiveButton' onClick={addTickerSymbol}>Add</button>
      <button className='interactiveButton' onClick={removeTickerSymbol}>Remove</button>
      <br/>
      {renderTickersErrorMessage()}
      <br/>
      <div className='symbolsAddedContainer'>
        <div className='symbolsAddedLabel'>
          SYMBOLS ADDED
        </div>
        <div className='symbolsAddedContent'>
          {Object.keys(tickerSymbols).length ? Object.keys(tickerSymbols).join(', ') : 'No symbols added yet'}
        </div>
      </div>

      <div className='allCalendarsContainer'>
        <div className='calendarContainer'>
          <br/>FROM<br/>
          <Calendar className='calendar from' calendarType='US' onChange={handleUpdateFrom}/>
        </div>
        <div className='calendarContainer'>
          <br/>TO<br/>
          <Calendar className='calendar to' calendarType='US' onChange={handleUpdateTo}/>
        </div>
      </div>

      <br/>
      <input type='checkbox' onClick={toggleTickerComparisonChart} value={isTickerComparisonChartEnabled}/> Toggle ticker comparison chart
      <br/>
      <button className='interactiveButton generateChartsButton' onClick={getTickerDataInRange}>Generate Charts</button>
      <br/>
      {renderDataErrorMessage()}
    </div>
  )
}

UserInput.propTypes = {
  tickerSymbols: PropTypes.object,
  isTickerComparisonChartEnabled: PropTypes.bool,
  setTickerData: PropTypes.func,
  setTickerSymbols: PropTypes.func,
  setIsTickerComparisonChartEnabled: PropTypes.func
}

export default UserInput;