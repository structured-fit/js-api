import "reflect-metadata";
import { transformAndValidateSync } from "class-transformer-validator";
import { ErrorResponse } from "@structured-fit/js-api-definitions/dist/src/ErrorResponse";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";

export class TimeoutError extends Error {

    timeout: true;

    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    describe(supportPortal?: string): ErrorResponse {
        return transformAndValidateSync(ErrorResponse, {
            severity: Severity.ERROR,
            title: "Request Timed Out",
            message: "The site took too long to respond.  Please make sure you are connected to the internet, and try again.",
            supportPortal,
        });
    }
}
