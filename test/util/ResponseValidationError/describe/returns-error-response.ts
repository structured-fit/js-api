import test from "ava";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";
import { ResponseValidationError } from "../../../../src/util/ResponseValidationError";

test("returns ErrorResponse", t => {
    const err = new ResponseValidationError("data", []);
    t.true(err.describe().severity instanceof Severity);
});
