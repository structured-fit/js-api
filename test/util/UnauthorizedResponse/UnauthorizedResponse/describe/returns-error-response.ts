import test from "ava";
import { Severity } from "@structured-fit/js-api-definitions/dist/src/Severity";
import { UnauthorizedResponse } from "../../../../../src/util/UnauthorizedResponse";

test("returns ErrorResponse", t => {
    const err = new UnauthorizedResponse(401, "Unauthorized");
    t.true(err.describe("http://support.structured.fit", "").severity instanceof Severity);
});

test("uses provided message", t => {
    const err = new UnauthorizedResponse(401, "Unauthorized");
    t.is(err.describe("http://support.structured.fit", "My Message").message, "My Message");
})
