import { render, screen } from '@testing-library/react';
import Charts from './Charts';

// jest.mock('canvasjs-react-charts', () => ({
//   render: jest.fn((options) => (
//     <div>
//       {`Chart for ${options.title.text}`}
//     </div>
//   ))
// }));
// jest.mock('canvasjs-react-charts');
const canvasjsReactCharts = jest.createMockFromModule('canvasjs-react-charts');
describe('Charts', () => {
  let props;
  beforeEach(() => {
    props = {
      tickerData: {
        // '2020-01-02': {
        //   'WMT': {
        //     ticker: 'WMT',
        //     close: '118.94',
        //     day_range: '1.19',
        //     name: 'Walmart',
        //     open: '118.86'
        //   },
        //   'TGT': {
        //     ticker: 'TGT',
        //     close: '126.07',
        //     day_range: '3.64',
        //     name: 'Target',
        //     open: '128.74'
        //   }
        // },
        // '2020-01-03': {
        //   'WMT': {
        //     ticker: 'WMT',
        //     close: '117.89',
        //     day_range: '1.20',
        //     name: 'Walmart',
        //     open: '118.27'
        //   },
        //   'TGT': {
        //     ticker: 'TGT',
        //     close: '124.76',
        //     day_range: '1.60',
        //     name: 'Target',
        //     open: '124.66'
        //   }
        // }
      },
      tickerSymbols: {
        // 'WMT': true,
        // 'TGT': true
      },
      isTickerComparisonChartEnabled: false
    }
  });

  it('renders', () => {
    render(<Charts {...props} />);

    expect(screen.queryByText('Export as PDF')).not.toBeNull();
    expect(screen.queryByText(/No data available yet./)).not.toBeNull();
  });
});