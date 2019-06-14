import { PostRequest } from "../../util/PostRequest";
import { PostOptions } from "../../util/PostOptions";
import { ClassType } from "class-transformer/ClassTransformer";
import { PasswordLoginRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/login/PasswordLoginRequest";
import { PasswordLoginResponse } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/login/PasswordLoginResponse";
import { ValidationBadRequest } from "../../util/ValidationBadRequest";
import { UnauthorizedResponse } from "../../util/UnauthorizedResponse";

/**
 * Attempts to login to Structured Fitness using a username and password.
 * 
 * This is not the recommended method of login for third party applications,
 * and should only be used for internal Structured Fitness sites and user's personal scripts.
 *
 * Web, server, and mobile applications are not allowed to use password authentication on behalf of their users,
 * as per the Structured Fitness Developer Terms of Service.
 */
export class PasswordAuthLogin extends PostRequest<PostOptions, PasswordLoginRequest, PasswordLoginResponse, ValidationBadRequest | UnauthorizedResponse> {

    protected getURL(): string {
        return `${this.prefix()}/api/auth/password/login/`;
    }
    
    protected getResponseBodyClass(): ClassType<PasswordLoginResponse> {
        return PasswordLoginResponse;
    }

    protected getErrorBodyClass(): [ClassType<ValidationBadRequest>, ClassType<UnauthorizedResponse>] {
        return [ ValidationBadRequest, UnauthorizedResponse ];
    }

}
