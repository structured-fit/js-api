import test from "ava";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";
import { WrappedValidationErrors } from "../../../../../src/util/validate";

test("returns ErrorResponse", t => {
    const err = new WrappedValidationErrors([]);
    t.true(err.describe().severity instanceof Severity);
});
