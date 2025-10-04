import { render, screen } from '@testing-library/react';
import Login from './Login';


describe('Login Component', () => {
  test('renders login form correctly', () => {
    render(<Login />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });
});
