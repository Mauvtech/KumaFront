import { api, publicApi } from './api';
import { AxiosError } from 'axios';
import { handleAuthError } from '../utils/handleAuthError';
import { addTerm, getAllTerms, getApprovedTerms, getPendingTerms, getTermById, updateTerm, deleteTerm, approveTerm, rejectTerm, upvoteTerm, downvoteTerm, addComment, addTag } from './termService';

// Mock the api and publicApi objects
jest.mock('./api', () => ({
    api: {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    },
    publicApi: {
        get: jest.fn()
    }
}));

// Mock the handleAuthError function
jest.mock('../utils/handleAuthError', () => ({
    handleAuthError: jest.fn()
}));

const mockNavigate = jest.fn();

describe('termService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addTerm', () => {
        it('should add a term successfully', async () => {
            const termData = { term: 'Test', definition: 'Test Definition', grammaticalCategory: 'Noun', theme: 'Test Theme' };
            (api.post as jest.Mock).mockResolvedValue({ data: termData });

            const result = await addTerm(termData, mockNavigate);

            expect(api.post).toHaveBeenCalledWith('/terms', termData);
            expect(result).toEqual(termData);
        });

        it('should handle error when adding a term fails', async () => {
            const termData = { term: 'Test', definition: 'Test Definition', grammaticalCategory: 'Noun', theme: 'Test Theme' };
            const error = new AxiosError('Error');
            (api.post as jest.Mock).mockRejectedValue(error);

            await addTerm(termData, mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('getAllTerms', () => {
        it('should get all terms successfully', async () => {
            const terms = [{ term: 'Test', definition: 'Test Definition' }];
            (api.get as jest.Mock).mockResolvedValue({ data: terms });

            const result = await getAllTerms(mockNavigate);

            expect(api.get).toHaveBeenCalledWith('/terms');
            expect(result).toEqual(terms);
        });

        it('should handle error when getting all terms fails', async () => {
            const error = new AxiosError('Error');
            (api.get as jest.Mock).mockRejectedValue(error);

            await getAllTerms(mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    // // Similarly, add tests for other service functions
    // describe('getApprovedTerms', () => {
    //     it('should get approved terms successfully', async () => {
    //         const terms = [{ term: 'Test', definition: 'Test Definition' }];
    //         (publicApi.get as jest.Mock).mockResolvedValue({ data: terms });

    //         const result = await getApprovedTerms(mockNavigate);

    //         expect(publicApi.get).toHaveBeenCalledWith('/terms/approved');
    //         expect(result).toEqual(terms);
    //     });

    //     it('should handle error when getting approved terms fails', async () => {
    //         const error = new AxiosError('Error');
    //         (publicApi.get as jest.Mock).mockRejectedValue(error);

    //         await getApprovedTerms(mockNavigate);

    //         expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
    //     });
    // });

    describe('getPendingTerms', () => {
        it('should get pending terms successfully', async () => {
            const terms = [{ term: 'Test', definition: 'Test Definition' }];
            (api.get as jest.Mock).mockResolvedValue({ data: terms });

            const result = await getPendingTerms(mockNavigate);

            expect(api.get).toHaveBeenCalledWith('/terms/pending');
            expect(result).toEqual(terms);
        });

        it('should handle error when getting pending terms fails', async () => {
            const error = new AxiosError('Error');
            (api.get as jest.Mock).mockRejectedValue(error);

            await getPendingTerms(mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('getTermById', () => {
        it('should get a term by id successfully', async () => {
            const term = { term: 'Test', definition: 'Test Definition' };
            (publicApi.get as jest.Mock).mockResolvedValue({ data: term });

            const result = await getTermById('1', mockNavigate);

            expect(publicApi.get).toHaveBeenCalledWith('/terms/1');
            expect(result).toEqual(term);
        });

        it('should handle error when getting a term by id fails', async () => {
            const error = new AxiosError('Error');
            (publicApi.get as jest.Mock).mockRejectedValue(error);

            await getTermById('1', mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('updateTerm', () => {
        it('should update a term successfully', async () => {
            const termData = { term: 'Test', definition: 'Test Definition', grammaticalCategory: 'Noun', theme: 'Test Theme' };
            (api.put as jest.Mock).mockResolvedValue({ data: termData });

            const result = await updateTerm('1', termData, mockNavigate);

            expect(api.put).toHaveBeenCalledWith('/terms/1', termData);
            expect(result).toEqual(termData);
        });

        it('should handle error when updating a term fails', async () => {
            const termData = { term: 'Test', definition: 'Test Definition', grammaticalCategory: 'Noun', theme: 'Test Theme' };
            const error = new AxiosError('Error');
            (api.put as jest.Mock).mockRejectedValue(error);

            await updateTerm('1', termData, mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('deleteTerm', () => {
        it('should delete a term successfully', async () => {
            const response = { message: 'Deleted successfully' };
            (api.delete as jest.Mock).mockResolvedValue({ data: response });

            const result = await deleteTerm('1', mockNavigate);

            expect(api.delete).toHaveBeenCalledWith('/terms/1');
            expect(result).toEqual(response);
        });

        it('should handle error when deleting a term fails', async () => {
            const error = new AxiosError('Error');
            (api.delete as jest.Mock).mockRejectedValue(error);

            await deleteTerm('1', mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('approveTerm', () => {
        it('should approve a term successfully', async () => {
            const approveData = { grammaticalCategory: 'Noun', theme: 'Test Theme', language: 'English', languageCode: 'en' };
            const response = { message: 'Approved successfully' };
            (api.post as jest.Mock).mockResolvedValue({ data: response });

            const result = await approveTerm('1', approveData, mockNavigate);

            expect(api.post).toHaveBeenCalledWith('/terms/1/approve', approveData);
            expect(result).toEqual(response);
        });

        it('should handle error when approving a term fails', async () => {
            const approveData = { grammaticalCategory: 'Noun', theme: 'Test Theme', language: 'English', languageCode: 'en' };
            const error = new AxiosError('Error');
            (api.post as jest.Mock).mockRejectedValue(error);

            await approveTerm('1', approveData, mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('rejectTerm', () => {
        it('should reject a term successfully', async () => {
            const response = { message: 'Rejected successfully' };
            (api.post as jest.Mock).mockResolvedValue({ data: response });

            const result = await rejectTerm('1', mockNavigate);

            expect(api.post).toHaveBeenCalledWith('/terms/1/reject');
            expect(result).toEqual(response);
        });

        it('should handle error when rejecting a term fails', async () => {
            const error = new AxiosError('Error');
            (api.post as jest.Mock).mockRejectedValue(error);

            await rejectTerm('1', mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('upvoteTerm', () => {
        it('should upvote a term successfully', async () => {
            const response = { message: 'Upvoted successfully' };
            (api.post as jest.Mock).mockResolvedValue({ data: response });

            const result = await upvoteTerm('1', mockNavigate);

            expect(api.post).toHaveBeenCalledWith('/terms/1/upvote');
            expect(result).toEqual(response);
        });

        it('should handle error when upvoting a term fails', async () => {
            const error = new AxiosError('Error');
            (api.post as jest.Mock).mockRejectedValue(error);

            await upvoteTerm('1', mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('downvoteTerm', () => {
        it('should downvote a term successfully', async () => {
            const response = { message: 'Downvoted successfully' };
            (api.post as jest.Mock).mockResolvedValue({ data: response });

            const result = await downvoteTerm('1', mockNavigate);

            expect(api.post).toHaveBeenCalledWith('/terms/1/downvote');
            expect(result).toEqual(response);
        });

        it('should handle error when downvoting a term fails', async () => {
            const error = new AxiosError('Error');
            (api.post as jest.Mock).mockRejectedValue(error);

            await downvoteTerm('1', mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('addComment', () => {
        it('should add a comment successfully', async () => {
            const commentData = { text: 'Test Comment', createdAt: new Date() };
            const response = { message: 'Comment added successfully' };
            (api.post as jest.Mock).mockResolvedValue({ data: response });

            const result = await addComment('1', commentData, mockNavigate);

            expect(api.post).toHaveBeenCalledWith('/terms/1/comment', commentData);
            expect(result).toEqual(response);
        });

        it('should handle error when adding a comment fails', async () => {
            const commentData = { text: 'Test Comment', createdAt: new Date() };
            const error = new AxiosError('Error');
            (api.post as jest.Mock).mockRejectedValue(error);

            await addComment('1', commentData, mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });

    describe('addTag', () => {
        it('should add a tag successfully', async () => {
            const tagData = { tag: 'Test Tag' };
            const response = { message: 'Tag added successfully' };
            (api.post as jest.Mock).mockResolvedValue({ data: response });

            const result = await addTag('1', tagData, mockNavigate);

            expect(api.post).toHaveBeenCalledWith('/terms/1/tag', tagData);
            expect(result).toEqual(response);
        });

        it('should handle error when adding a tag fails', async () => {
            const tagData = { tag: 'Test Tag' };
            const error = new AxiosError('Error');
            (api.post as jest.Mock).mockRejectedValue(error);

            await addTag('1', tagData, mockNavigate);

            expect(handleAuthError).toHaveBeenCalledWith(error, mockNavigate);
        });
    });
});
