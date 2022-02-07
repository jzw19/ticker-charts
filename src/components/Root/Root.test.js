import { render, screen } from '@testing-library/react';
import Root from './Root';

describe('Root', () => {
  it('renders', () => {
    render(<Root />);
    
    expect(screen.queryByText('INSTRUCTIONS')).not.toBeNull();
    expect(screen.queryByText('Add')).not.toBeNull();
    expect(screen.queryByText('Remove')).not.toBeNull();
    expect(screen.queryByText('SYMBOLS ADDED')).not.toBeNull();
    expect(screen.queryByText('FROM')).not.toBeNull();
    expect(screen.queryByText('TO')).not.toBeNull();
    expect(screen.queryByText('Generate Charts')).not.toBeNull();
  });
});