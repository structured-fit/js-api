import "reflect-metadata";
import { transformAndValidateSync } from "class-transformer-validator";
import { ErrorResponse } from "@structured-fit/js-api-definitions/dist/src/ErrorResponse";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";

export class BodyRequiredError extends Error {

    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    describe(supportPortal?: string): ErrorResponse {
        return transformAndValidateSync(ErrorResponse, {
            severity: Severity.ERROR,
            title: "Internal Formatting Error",
            message: "Unable to submit data to the server.  Please report this error if the problem continues.",
            supportPortal,
        });
    }

}
