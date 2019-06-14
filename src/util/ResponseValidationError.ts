import "reflect-metadata";
import { ValidationError } from "class-validator";
import { transformAndValidateSync } from "class-transformer-validator";
import { ErrorResponse } from "@structured-fit/js-api-definitions/dist/src/ErrorResponse";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";

/**
 * Used to mark validation errors when the server response doesn't match the expected body.
 */
export class ResponseValidationError extends Error {

    constructor(
        public readonly classification: "data" | "error",
        public readonly errors: ValidationError[]
    ) {
        super();
        Object.setPrototypeOf(this, new.target.prototype);
    }

    describe(supportPortal?: string): ErrorResponse {
        return transformAndValidateSync(ErrorResponse, {
            severity: Severity.ERROR,
            title: "Invalid Response",
            message: "The site responded with an invalid "
                + (this.classification === "data" ? "response" : "error message")
                + " please report this error if the problem continues.",
            supportPortal,
        });
    }

}
