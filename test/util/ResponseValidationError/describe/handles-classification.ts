import test from "ava";
import { ResponseValidationError } from "../../../../src/util/ResponseValidationError";

test("reports 'response' if in 'data'", t => {
    const err = new ResponseValidationError("data", []);
    t.is(err.classification, "data");
    t.regex(err.describe().message, /invalid response/g);
});

test("reports 'error message' if in 'error'", t => {
    const err = new ResponseValidationError("error", []);
    t.is(err.classification, "error");
    t.regex(err.describe().message, /invalid error message/g);
});
