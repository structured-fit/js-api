import { PostRequest } from "../util/PostRequest";
import { PostOptions } from "../util/PostOptions";
import { ClassType } from "class-transformer/ClassTransformer";
import { AuthConfirmationRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/confirmation/AuthConfirmationRequest";
import { AuthConfirmationResponse } from "@structured-fit/js-api-definitions/dist/src/api/auth/confirmation/AuthConfirmationResponse";
import { ValidationBadRequest } from "../util/ValidationBadRequest";
import { NotFoundResponseError } from "../util/NotFoundResponseError";

/**
 * Attempts to confirm an authentication code provided by Structured Fitness.
 */
export class ConfirmAuthentication extends PostRequest<PostOptions, AuthConfirmationRequest, AuthConfirmationResponse, ValidationBadRequest | NotFoundResponseError> {

    protected getURL(): string {
        return `${this.prefix()}/api/auth/confirmation/`;
    }
    
    protected getResponseBodyClass(): ClassType<AuthConfirmationResponse> {
        return AuthConfirmationResponse;
    }

    protected getErrorBodyClass(): [ClassType<ValidationBadRequest>, ClassType<NotFoundResponseError>] {
        return [ ValidationBadRequest, NotFoundResponseError ];
    }

}
