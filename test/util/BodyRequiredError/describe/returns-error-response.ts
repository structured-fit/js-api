import test from "ava";
import { BodyRequiredError } from "../../../../src/util/BodyRequiredError";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";

test("returns ErrorResponse", t => {
    const err = new BodyRequiredError();
    t.true(err.describe().severity instanceof Severity);
});
