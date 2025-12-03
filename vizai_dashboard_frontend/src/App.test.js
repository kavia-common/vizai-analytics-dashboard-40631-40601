import { render, screen } from '@testing-library/react';
import App from './App';

test('renders animals navigation', () => {
  render(<App />);
  const nav = screen.getAllByText(/Animals/i)[0];
  expect(nav).toBeInTheDocument();
});
