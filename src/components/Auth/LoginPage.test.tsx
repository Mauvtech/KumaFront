import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../../contexts/authContext';
import { login as loginService, getCurrentUser, logout, isTokenExpired } from '../../services/authService';
import { AxiosError } from 'axios';

// Mock the authService functions
jest.mock('../../services/authService', () => ({
    login: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
    isTokenExpired: jest.fn(),
}));

const mockNavigate = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock window.alert
window.alert = jest.fn();

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock implementations for authService functions
        (getCurrentUser as jest.Mock).mockReturnValue(null);
        (logout as jest.Mock).mockImplementation(() => { });
        (isTokenExpired as jest.Mock).mockReturnValue(false);
    });

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    {ui}
                </AuthProvider>
            </BrowserRouter>
        );
    };

    it('renders the login form', () => {
        renderWithProviders(<LoginPage />);

        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('displays error messages when fields are empty', async () => {
        renderWithProviders(<LoginPage />);

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it('navigates to the homepage on successful login', async () => {
        const mockUserData = { username: 'testuser', token: 'fake-token', role: 'user', _id: '1' };
        const mockLogin = jest.fn().mockResolvedValue(mockUserData);
        (loginService as jest.Mock).mockImplementation(mockLogin);

        renderWithProviders(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'testpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument());
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
