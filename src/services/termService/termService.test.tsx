import {api} from "../api";
import {addTerm, getAllTerms, getApprovedTerms,} from "./termService";
import {AxiosError} from "axios";
import {handleAuthError} from "../../utils/handleAuthError";

// Mock the api module
jest.mock("./api");
jest.mock("../utils/handleAuthError");

describe("Term Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should add a term", async () => {
        const mockTermData = {
            term: "test term",
            definition: "test definition",
            grammaticalCategory: "noun",
            theme: "test theme",
        };
        const mockResponse = {data: {id: 1, ...mockTermData}};
        (api.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await addTerm(mockTermData);

        expect(api.post).toHaveBeenCalledWith("/terms", mockTermData);
        expect(result).toEqual(mockResponse.data);
    });

    it("should handle error when adding a term", async () => {
        const mockTermData = {
            term: "test term",
            definition: "test definition",
            grammaticalCategory: "noun",
            theme: "test theme",
        };
        const mockError = new AxiosError("Request failed", "400");
        (api.post as jest.Mock).mockRejectedValue(mockError);

        await addTerm(mockTermData);

        expect(handleAuthError).toHaveBeenCalledWith(mockError);
    });

    it("should get all terms", async () => {
        const mockResponse = {data: {terms: [], totalTerms: 0}};
        (api.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getAllTerms(1, 10);

        expect(api.get).toHaveBeenCalledWith("/terms", {params: {page: 1, limit: 10}});
        expect(result).toEqual(mockResponse.data);
    });

    it("should get approved terms", async () => {
        const mockResponse = {data: {terms: [], totalTerms: 0}};
        (api.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getApprovedTerms();

        expect(api.get).toHaveBeenCalledWith("/terms/approved", {params: undefined});
        expect(result).toEqual(mockResponse.data);
    });

    it("should handle error when getting approved terms", async () => {
        const mockError = new AxiosError("Request failed", "400");
        (api.get as jest.Mock).mockRejectedValue(mockError);

        await getApprovedTerms();

        expect(handleAuthError).toHaveBeenCalledWith(mockError);
    });

    // Continue writing tests for other service functions similarly...

});
