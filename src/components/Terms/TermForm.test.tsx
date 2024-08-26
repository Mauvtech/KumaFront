import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import TermForm from './TermForm';
import {addTerm, updateTerm} from '../../services/termService/termService';
import {getCategories} from '../../services/categoryService';
import {getThemes} from '../../services/themeService';
import {getLanguages} from '../../services/languageService';
import {AuthProvider} from '../../contexts/authContext';

// Mock the service functions
jest.mock('../../services/termService', () => ({
    addTerm: jest.fn(),
    updateTerm: jest.fn(),
}));

jest.mock('../../services/categoryService', () => ({
    getCategories: jest.fn(),
}));

jest.mock('../../services/themeService', () => ({
    getThemes: jest.fn(),
}));

jest.mock('../../services/languageService', () => ({
    getLanguages: jest.fn(),
}));

const mockNavigate = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('TermForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock implementations for the services
        (getCategories as jest.Mock).mockResolvedValue([
            {_id: '1', name: 'Noun'},
            {_id: '2', name: 'Verb'},
        ]);
        (getThemes as jest.Mock).mockResolvedValue([
            {_id: '1', name: 'Nature'},
            {_id: '2', name: 'Technology'},
        ]);
        (getLanguages as jest.Mock).mockResolvedValue([
            {_id: '1', name: 'English', code: 'en'},
            {_id: '2', name: 'French', code: 'fr'},
        ]);
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

    it('renders the term form', async () => {
        renderWithProviders(<TermForm/>);

        expect(await screen.findByLabelText(/term/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/translation/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/definition/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/grammatical category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/theme/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /add/i})).toBeInTheDocument();
    });

    it('handles form submission for adding a term', async () => {
        (addTerm as jest.Mock).mockResolvedValue({});

        renderWithProviders(<TermForm/>);

        fireEvent.change(screen.getByLabelText(/term/i), {target: {value: 'Test Term'}});
        fireEvent.change(screen.getByLabelText(/translation/i), {target: {value: 'Test Translation'}});
        fireEvent.change(screen.getByLabelText(/definition/i), {target: {value: 'Test Definition'}});
        fireEvent.change(screen.getByLabelText(/grammatical category/i), {target: {value: 'Noun'}});
        fireEvent.change(screen.getByLabelText(/theme/i), {target: {value: 'Nature'}});
        fireEvent.change(screen.getByLabelText(/language/i), {target: {value: 'English'}});

        fireEvent.click(screen.getByRole('button', {name: /add/i}));

        await waitFor(() => expect(addTerm).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('handles form submission for updating a term', async () => {
        (updateTerm as jest.Mock).mockResolvedValue({});

        renderWithProviders(<TermForm termId="1" initialData={{
            term: 'Initial Term',
            translation: 'Initial Translation',
            definition: 'Initial Definition',
            grammaticalCategory: 'Noun',
            theme: 'Nature',
            language: 'English',
        }}/>);

        fireEvent.change(screen.getByLabelText(/term/i), {target: {value: 'Updated Term'}});
        fireEvent.change(screen.getByLabelText(/translation/i), {target: {value: 'Updated Translation'}});
        fireEvent.change(screen.getByLabelText(/definition/i), {target: {value: 'Updated Definition'}});

        fireEvent.click(screen.getByRole('button', {name: /edit/i}));

        await waitFor(() => expect(updateTerm).toHaveBeenCalled());
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('displays error message on form submission failure', async () => {
        (addTerm as jest.Mock).mockRejectedValue(new Error('Failed to add term'));

        renderWithProviders(<TermForm/>);

        fireEvent.change(screen.getByLabelText(/term/i), {target: {value: 'Test Term'}});
        fireEvent.change(screen.getByLabelText(/translation/i), {target: {value: 'Test Translation'}});
        fireEvent.change(screen.getByLabelText(/definition/i), {target: {value: 'Test Definition'}});
        fireEvent.change(screen.getByLabelText(/grammatical category/i), {target: {value: 'Noun'}});
        fireEvent.change(screen.getByLabelText(/theme/i), {target: {value: 'Nature'}});
        fireEvent.change(screen.getByLabelText(/language/i), {target: {value: 'English'}});

        fireEvent.click(screen.getByRole('button', {name: /add/i}));

        expect(await screen.findByText(/an error occurred while submitting the term./i)).toBeInTheDocument();
    });
});
