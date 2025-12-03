import { render, screen } from '@testing-library/react';
import App from './App';

test('renders top navigation', () => {
  render(<App />);
  const nav = screen.getAllByText(/Dashboard/i)[0];
  expect(nav).toBeInTheDocument();
});
