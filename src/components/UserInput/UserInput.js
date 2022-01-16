import React, { useEffect, useState } from 'react';
import api from '../../util/api';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

export const UserInput = ({ setTickerData }) => {
  const [tickerSymbols, setTickerSymbols] = useState({});
  const [tickerSymbolOptions, setTickerSymbolOptions] = useState([]);
  const [selectedTickerSymbol, setSelectedTickerSymbol] = useState('');
  const [fromDate, setFromDate] = useState({ year: '2020', month: '01', day: '01' });
  const [toDate, setToDate] = useState({ year: '2020', month: '02', day: '01' });

  useEffect(async () => {
    await api.getMockTickerList().then(
      (response) => setTickerSymbolOptions(response),
      (err) => console.error(err)
    );
  }, []);

  const displayTickerData = async () => {
    const formattedTickerSymbols = Object.keys(tickerSymbols).join(',');
    const formattedFromDate = `${fromDate.year}-${fromDate.month}-${fromDate.day}`;
    const formattedToDate = `${toDate.year}-${toDate.month}-${toDate.day}`;

    console.log(formattedTickerSymbols);
    console.log(formattedFromDate);
    console.log(formattedToDate);
    await api.getMockTickerData(formattedTickerSymbols, formattedFromDate, formattedToDate).then(
      (response) => setTickerData(response), 
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
      options.push(<option value={tickerSymbol}>{tickerSymbol}</option>);
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

  return(
    <div className='userInputContainer'>
      <span>Add ticker: </span>
      {generateTickerOptions()}
      <button onClick={addTickerSymbol}>Add</button>
      <br/>
      <div>
        SYMBOLS ADDED: {Object.keys(tickerSymbols).join(',')}
      </div>

      <div>
        <div>
          <br/>FROM<br/>
          <Calendar className='calendar from' onChange={handleUpdateFrom}/>
        </div>
        <div>
          <br/>TO<br/>
          <Calendar className='calendar to' onChange={handleUpdateTo}/>
        </div>
      </div>

      <br/><button onClick={displayTickerData}>GET</button>
    </div>
  )
}

UserInput.propTypes = {
  setTickerData: PropTypes.func
}

export default UserInput;