import "reflect-metadata";
import { IsDefined, ValidateNested, Equals } from "class-validator";
import { Type } from "class-transformer";
import { HttpResponse } from "./HttpResponse";
import { transformAndValidateSync } from "class-transformer-validator";
import { ErrorResponse } from "@structured-fit/js-api-definitions/dist/src/ErrorResponse";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";
import { WrappedError } from "./WrappedError";
import { WrappedValidationErrors } from "./validate";

export class NotFoundResponseError extends HttpResponse {

    /**
     * The HTTP status code of the error.
     */
    @Equals(404)
    statusCode: 404;

    /**
     * The name of the error code.
     */
    @Equals("Not Found")
    error: "Not Found";

    constructor(statusCode: number, error: string) {
        super(statusCode, error);
    }

    public describe(supportPortal?: string, message?: string): ErrorResponse {
        return transformAndValidateSync(ErrorResponse, {
            severity: Severity.ERROR,
            title: "Invalid Request",
            message: message || this.error,
            supportPortal,
        });
    }

}

export function isNotFoundResponseError(obj: any): obj is NotFoundResponseError {
    return obj
        && typeof obj === "object"
        && !Array.isArray(obj)
        && typeof obj.statusCode === "number"
        && obj.statusCode === 404;
}

export function isWrappedNotFoundResponseError(obj: any): obj is WrappedError<NotFoundResponseError> {
    return obj
        && obj instanceof WrappedError
        && isNotFoundResponseError(obj.child);
}
