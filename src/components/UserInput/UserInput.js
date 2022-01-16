import React, { useState } from 'react';
import api from '../../util/api';
import PropTypes from 'prop-types';

export const UserInput = ({ setTickerData }) => {
  const [tickerSymbols, setTickerSymbols] = useState({});
  const [tickerSymbolInput, setTickerSymbolInput] = useState('');
  const [fromDate, setFromDate] = useState({ year: '0000', month: '01', day: '01' });
  const [toDate, setToDate] = useState({ year: '0000', month: '01', day: '01' });

  const displayTickerData = async () => {
    const formattedTickerSymbols = Object.keys(tickerSymbols).join(',');
    const formattedFromDate = `${fromDate.year}-${fromDate.month}-${fromDate.day}`;
    const formattedToDate = `${toDate.year}-${toDate.month}-${toDate.day}`;

    await api.getMockTickerData(formattedTickerSymbols, formattedFromDate, formattedToDate).then(
      (response) => setTickerData(response), 
      (err) => console.error(err)
    );
  }

  const addTickerSymbol = () => {
    if(tickerSymbolInput.length) {
      const nextTickerSymbols = {...tickerSymbols};
      nextTickerSymbols[tickerSymbolInput] = true;
      setTickerSymbols(nextTickerSymbols);
    }
  }

  const updateTickerSymbolInputValue = (event) => {
    setTickerSymbolInput(event.target.value);
  }

  const setFromYear = (event) => {
    setFromDate({
      ...fromDate,
      year: event.target.value
    });
  }

  const setFromMonth = (event) => {
    setFromDate({
      ...fromDate,
      month: event.target.value
    });
  }

  const setFromDay = (event) => {
    setFromDate({
      ...fromDate,
      day: event.target.value
    });
  }

  const setToYear = (event) => {
    setToDate({
      ...toDate,
      year: event.target.value
    });
  }

  const setToMonth = (event) => {
    setToDate({
      ...toDate,
      month: event.target.value
    });
  }

  const setToDay = (event) => {
    setToDate({
      ...toDate,
      day: event.target.value
    });
  }

  return(
    <div className='userInputContainer'>
      <span>Add ticker: </span>
      <input className='tickerSymbolInput' onChange={updateTickerSymbolInputValue}/>
      <button onClick={addTickerSymbol}>Add</button>
      <br/>
      <div>
        SYMBOLS ADDED: {JSON.stringify(tickerSymbols)}
      </div>

      <div>
        <div>
          FROM<br/>
          Year: <input onChange={setFromYear}/>
          Month: <input onChange={setFromMonth}/>
          Day: <input onChange={setFromDay}/>
        </div>
        <div>
          TO<br/>
          Year: <input onChange={setToYear}/>
          Month: <input onChange={setToMonth}/>
          Day: <input onChange={setToDay}/>
        </div>
      </div>

      <button onClick={displayTickerData}>GET</button>
    </div>
  )
}

UserInput.propTypes = {
  setTickerData: PropTypes.func
}

export default UserInput;