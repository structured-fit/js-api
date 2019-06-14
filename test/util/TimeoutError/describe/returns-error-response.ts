import test from "ava";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";
import { TimeoutError } from "../../../../src/util/TimeoutError";

test("returns ErrorResponse", t => {
    const err = new TimeoutError();
    t.true(err.describe().severity instanceof Severity);
});
