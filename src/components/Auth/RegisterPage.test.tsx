import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import RegisterPage from './RegisterPage';
import {register} from '../../services/auth/authService';
import {AxiosError, AxiosResponse, AxiosResponseHeaders} from 'axios';

// Mock the authService functions
jest.mock('../../services/authService', () => ({
    register: jest.fn(),
}));

const mockNavigate = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('RegisterPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        );
    };

    it('renders the registration form', () => {
        renderWithProviders(<RegisterPage/>);

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /sign up/i})).toBeInTheDocument();
    });

    it('displays error messages when fields are empty', async () => {
        renderWithProviders(<RegisterPage/>);

        fireEvent.click(screen.getByRole('button', {name: /sign up/i}));

        expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password confirmation is required/i)).toBeInTheDocument();
    });

    it('displays error when passwords do not match', async () => {
        renderWithProviders(<RegisterPage/>);

        fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'testuser'}});
        fireEvent.change(screen.getByLabelText(/^password$/i), {target: {value: 'password123'}});
        fireEvent.change(screen.getByLabelText(/confirm password/i), {target: {value: 'password456'}});
        fireEvent.click(screen.getByRole('button', {name: /sign up/i}));

        expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('navigates to the login page on successful registration', async () => {
        const mockRegister = jest.fn().mockResolvedValue({});
        (register as jest.Mock).mockImplementation(mockRegister);

        renderWithProviders(<RegisterPage/>);

        fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'testuser'}});
        fireEvent.change(screen.getByLabelText(/^password$/i), {target: {value: 'password123'}});
        fireEvent.change(screen.getByLabelText(/confirm password/i), {target: {value: 'password123'}});
        fireEvent.click(screen.getByRole('button', {name: /sign up/i}));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
    });

    it('displays general error message on registration failure', async () => {
        const errorResponse: AxiosResponse = {
            data: 'Invalid credentials',
            status: 400,
            statusText: 'Bad Request',
            config: {
                headers: {} as AxiosResponseHeaders,
            },
            headers: {},
        };

        const error = new AxiosError('Registration failed', '400', {headers: {} as AxiosResponseHeaders}, errorResponse);
        const mockRegister = jest.fn().mockRejectedValue(error);
        (register as jest.Mock).mockImplementation(mockRegister);

        renderWithProviders(<RegisterPage/>);

        fireEvent.change(screen.getByLabelText(/username/i), {target: {value: 'testuser'}});
        fireEvent.change(screen.getByLabelText(/^password$/i), {target: {value: 'password123'}});
        fireEvent.change(screen.getByLabelText(/confirm password/i), {target: {value: 'password123'}});
        fireEvent.click(screen.getByRole('button', {name: /sign up/i}));

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });
});

