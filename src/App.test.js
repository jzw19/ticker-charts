import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders', () => {
    render(<App />);

    expect(screen.queryByText('INSTRUCTIONS')).not.toBeNull();
    expect(screen.queryByText('Add')).not.toBeNull();
    expect(screen.queryByText('Remove')).not.toBeNull();
    expect(screen.queryByText('SYMBOLS ADDED')).not.toBeNull();
    expect(screen.queryByText('FROM')).not.toBeNull();
    expect(screen.queryByText('TO')).not.toBeNull();
    expect(screen.queryByText('Generate Charts')).not.toBeNull();
  });
});
