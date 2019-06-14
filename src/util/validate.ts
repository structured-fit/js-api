import "reflect-metadata";
import { validate as parent, ValidatorOptions, ValidationError, IsDefined, ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import Future, { FutureInstance } from "fluture";
import { transformAndValidateSync } from "class-transformer-validator";
import { ErrorResponse } from "@structured-fit/js-api-definitions/dist/src/ErrorResponse";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";

export class WrappedValidationErrors extends Error {

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested()
    @Type(type => ValidationError)
    public readonly validationErrors: ValidationError[];

    constructor(validationErrors: ValidationError[]) {
        super();
        this.validationErrors = validationErrors;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public getParagraph(): string {
        return this.validationErrors.map(error => error.toString()).join(".  ");
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

export function validate(object: Object, validatorOptions?: ValidatorOptions): FutureInstance<WrappedValidationErrors, void> {
    return Future((reject, resolve) => {
        parent(object, validatorOptions)
            .then(errors => {
                if(errors.length < 1) {
                    return resolve();
                }
                return reject(new WrappedValidationErrors(errors));
            })
    })
}
