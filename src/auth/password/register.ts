import { PostRequest } from "../../util/PostRequest";
import { PostOptions } from "../../util/PostOptions";
import { ClassType } from "class-transformer/ClassTransformer";
import { PasswordRegisterRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/register/PasswordRegisterRequest";
import { PasswordRegisterResponse } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/register/PasswordRegisterResponse";
import { ValidationBadRequest } from "../../util/ValidationBadRequest";

/**
 * Attempts to register on Structured Fitness using a username and password.
 * 
 * This is not the recommended method of registration for third party applications,
 * and should only be used for internal Structured Fitness sites and user's personal scripts.
 *
 * Web, server, and mobile applications are not allowed to use password authentication on behalf of their users,
 * as per the Structured Fitness Developer Terms of Service.
 */
export class PasswordAuthRegister extends PostRequest<PostOptions, PasswordRegisterRequest, PasswordRegisterResponse, ValidationBadRequest> {

    protected getURL(): string {
        return `${this.prefix()}/api/auth/password/register/`;
    }
    
    protected getResponseBodyClass(): ClassType<PasswordRegisterResponse> {
        return PasswordRegisterResponse;
    }

    protected getErrorBodyClass(): [ClassType<ValidationBadRequest>] {
        return [ ValidationBadRequest ];
    }

}
