import "reflect-metadata";
import { IsDefined, ValidateNested, Equals } from "class-validator";
import { Type } from "class-transformer";
import { HttpResponse } from "./HttpResponse";
import { transformAndValidateSync } from "class-transformer-validator";
import { ErrorResponse } from "@structured-fit/js-api-definitions/dist/src/ErrorResponse";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";
import { WrappedError } from "./WrappedError";
import { WrappedValidationErrors } from "./validate";

export class ValidationBadRequest extends HttpResponse {

    /**
     * The HTTP status code of the error.
     */
    @Equals(400)
    statusCode: 400;

    /**
     * The name of the error code.
     */
    @Equals("Bad Request")
    error: "Bad Request";

    @IsDefined()
    @ValidateNested()
    @Type(type => WrappedValidationErrors)
    message: WrappedValidationErrors;

    constructor(statusCode: number, error: string, message?: WrappedValidationErrors) {
        super(statusCode, error);
        this.message = message;
    }

    public getParagraph(): string {
        return this.message.getParagraph();
    }

    public describe(supportPortal?: string): ErrorResponse {
        return transformAndValidateSync(ErrorResponse, {
            severity: Severity.ERROR,
            title: "Invalid Request",
            message: this.getParagraph(),
            supportPortal,
        });
    }

}

export function isValidationBadRequest(obj: any): obj is ValidationBadRequest {
    return obj
        && typeof obj === "object"
        && !Array.isArray(obj)
        && typeof obj.statusCode === "number"
        && obj.statusCode === 400
        && typeof obj.message === "object"
        && obj.message instanceof WrappedValidationErrors;
}

export function isWrappedValidationBadRequest(obj: any): obj is WrappedError<ValidationBadRequest> {
    return obj
        && obj instanceof WrappedError
        && isValidationBadRequest(obj.child);
}
