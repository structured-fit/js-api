import "reflect-metadata";
import { Equals } from "class-validator";
import { HttpResponse } from "./HttpResponse";
import { transformAndValidateSync } from "class-transformer-validator";
import { ErrorResponse } from "@structured-fit/js-api-definitions/dist/src/ErrorResponse";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";
import { WrappedError } from "./WrappedError";

export class UnauthorizedResponse extends HttpResponse {

    @Equals(401)
    statusCode: 401;

    @Equals("Unauthorized")
    error: "Unauthorized";

    public describe(supportPortal: string, message: string): ErrorResponse {
        return transformAndValidateSync(ErrorResponse, {
            severity: Severity.ERROR,
            title: "Invalid Authentication",
            message,
            supportPortal,
        });
    }

}

export function isUnauthorizedResponse(obj: any): obj is UnauthorizedResponse {
    return obj
        && typeof obj === "object"
        && typeof obj.statusCode === "number"
        && obj.statusCode === 401
        && typeof obj.error === "string"
        && obj.error === "Unauthorized";
}

export function isWrappedUnauthorizedResponse(obj: any): obj is WrappedError<UnauthorizedResponse> {
    return obj
        && obj instanceof WrappedError
        && isUnauthorizedResponse(obj.child);
}
