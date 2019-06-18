import { PostRequest } from "../../util/PostRequest";
import { PostOptions } from "../../util/PostOptions";
import { ClassType } from "class-transformer/ClassTransformer";
import { PasswordForgotRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/forgot/PasswordForgotRequest";
import { PasswordForgotResponse } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/forgot/PasswordForgotResponse";
import { ValidationBadRequest } from "../../util/ValidationBadRequest";
import { UnauthorizedResponse } from "../../util/UnauthorizedResponse";

/**
 * Attempts to reset a Structured Fitness password.
 * 
 * This is not the recommended method of login for third party applications,
 * and should only be used for internal Structured Fitness sites and user's personal scripts.
 *
 * Web, server, and mobile applications are not allowed to use password authentication on behalf of their users,
 * as per the Structured Fitness Developer Terms of Service.
 */
export class PasswordAuthForgot extends PostRequest<PostOptions, PasswordForgotRequest, PasswordForgotResponse, ValidationBadRequest | UnauthorizedResponse> {

    protected getURL(): string {
        return `${this.prefix()}/api/auth/password/forgot/`;
    }
    
    protected getResponseBodyClass(): ClassType<PasswordForgotResponse> {
        return PasswordForgotResponse;
    }

    protected getErrorBodyClass(): [ClassType<ValidationBadRequest>, ClassType<UnauthorizedResponse>] {
        return [ ValidationBadRequest, UnauthorizedResponse ];
    }

}
