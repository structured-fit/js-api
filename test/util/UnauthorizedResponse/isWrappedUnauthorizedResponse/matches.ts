import test from "ava";
import { UnauthorizedResponse, isWrappedUnauthorizedResponse } from "../../../../src/util/UnauthorizedResponse";
import { WrappedError } from "../../../../src/util/WrappedError";

test("matches UnauthorizedResponse", t => {
    const response = new WrappedError(new UnauthorizedResponse(401, "Unauthorized"));
    t.true(isWrappedUnauthorizedResponse(response));
});

test("doesn't match UnauthorizedResponse", t => {
    const response = new UnauthorizedResponse(401, "Unauthorized");
    t.false(isWrappedUnauthorizedResponse(response));
});

test("doesn't match other WrappedError", t => {
    const response = new WrappedError(new ReferenceError());
    t.false(isWrappedUnauthorizedResponse(response));
});

test("doesn't match number", t => {
    t.false(isWrappedUnauthorizedResponse(1));
});
