import React, { useState as useStateMock } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserInput from './UserInput';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));
describe('UserInput', () => {
  let props, setStateMock;
  beforeEach(() => {
    props = {
      tickerSymbols: {'WMT': true},
      isTickerComparisonChartEnabled: false,
      setTickerData: jest.fn(),
      setTickerSymbols: jest.fn(),
      setIsTickerComparisonChartEnabled: jest.fn()
    };
    process.env.REACT_APP_API = 'mock';
    setStateMock = jest.fn();
    useStateMock.mockImplementation(state => [state, setStateMock]);
  });

  it('renders', () => {
    render(<UserInput {...props} />);

    expect(screen.queryByText('Choose ticker:')).not.toBeNull();
    expect(screen.queryByText('Add')).not.toBeNull();
    expect(screen.queryByText('Remove')).not.toBeNull();
    expect(screen.queryByText('SYMBOLS ADDED')).not.toBeNull();
    expect(screen.queryByText('FROM')).not.toBeNull();
    expect(screen.queryByText('TO')).not.toBeNull();
    expect(screen.queryByText('Generate Charts')).not.toBeNull();
  });

  it('adds a ticker symbol', () => {
    render(<UserInput {...props} />);

    const addButton = screen.queryByText('Add');
    addButton.click();
    expect(props.setTickerSymbols).toHaveBeenCalledTimes(1);
  });

  it('removes a ticker symbol', () => {
    render(<UserInput {...props} />);

    const removeButton = screen.queryByText('Remove');
    removeButton.click();
    expect(props.setTickerSymbols).toHaveBeenCalledTimes(1);
  });

  it('toggles the ticker comparison chart', () => {
    render(<UserInput {...props} />);

    const generateChartsButton = screen.queryByTestId('comparisonChartToggleButton');
    generateChartsButton.click();
    expect(props.setIsTickerComparisonChartEnabled).toHaveBeenCalledTimes(1);
  });

  it('updates from date', () => {
    render(<UserInput {...props} />);

    const fromDateButton = screen.queryAllByText('15')[0];
    fromDateButton.click();
    expect(setStateMock).toHaveBeenCalledTimes(1);
  });

  it('updates to date', () => {
    render(<UserInput {...props} />);

    const toDateButton = screen.queryAllByText('15')[1];
    toDateButton.click();
    expect(setStateMock).toHaveBeenCalledTimes(1);
  });

  it('sets ticker data when at least one ticker symbol has already been selected and the Generate Charts buton has been clicked', async () => {
    render(<UserInput {...props} />);

    const generateChartsButton = screen.queryByText('Generate Charts');
    generateChartsButton.click();
    await waitFor(() => expect(setStateMock).toHaveBeenCalledWith(false));
  });

  it('displays an error message when no ticker symbols have been selected and the Generate Charts buton has been clicked', () => {
    props.tickerSymbols = {};
    render(<UserInput {...props} />);

    const generateChartsButton = screen.queryByText('Generate Charts');
    generateChartsButton.click();
    expect(setStateMock).toHaveBeenCalledWith(true);
  });
});