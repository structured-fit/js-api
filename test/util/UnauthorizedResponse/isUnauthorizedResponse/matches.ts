import test from "ava";
import { UnauthorizedResponse, isUnauthorizedResponse } from "../../../../src/util/UnauthorizedResponse";

test("matches UnauthorizedResponse", t => {
    const response = new UnauthorizedResponse(401, "Unauthorized");
    t.true(isUnauthorizedResponse(response));
});

test("doesn't match number", t => {
    t.false(isUnauthorizedResponse(1));
});
