import test from "ava";
import * as express from "express";
import * as supertest from "supertest";
import { SuperAgentRequest, SuperAgent } from "superagent";
import { transformAndValidateSync } from "class-transformer-validator";
import { PasswordForgotRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/forgot/PasswordForgotRequest";
import { PostOptions } from "../../../../src/util/PostOptions";
import { ValidationBadRequest, isWrappedValidationBadRequest } from "../../../../src/util/ValidationBadRequest";
import Future, { map, promise, chainRej } from "fluture";
import { WrappedValidationErrors } from "../../../../src/util/validate";
import { PasswordAuthForgot } from "../../../../src/auth/password/forgot";

class MockPasswordAuthForgot extends PasswordAuthForgot {

    public prefix() {
        return "";
    }

    protected getRequest(): SuperAgent<SuperAgentRequest> {
        const app = express();
        app.post("/api/auth/password/forgot/", (req, res) => {
            let message: WrappedValidationErrors;
            try {
                transformAndValidateSync(PasswordForgotRequest, {
                    email: "not-an-email",
                    password: "",
                });
            } catch(e) {
                message = new WrappedValidationErrors(e);
            }
            const validationBadRequest = transformAndValidateSync(ValidationBadRequest, {
                statusCode: 400,
                error: "Bad Request",
                message,
            });
            res.status(400).json(validationBadRequest);
        });
        return supertest(app);
    }

}

test("handles validation error", async t => {
    t.plan(2);
    const options = PostOptions.create({
        responseTimeout: 500,
        deadlineTimeout: 750,
    });
    const body: PasswordForgotRequest = transformAndValidateSync(PasswordForgotRequest, {
        email: "foo@example.com",
        password: "bar",
    });
    const request = new MockPasswordAuthForgot(options).post(body).request();
    return request
        .pipe (map (res => {
            t.fail("Request should fail")
        }))
        .pipe (chainRej (e => {
            if(!isWrappedValidationBadRequest(e)) {
                t.fail("Got error other than ValidationBadRequest");
            } else {
                t.is(e.child.statusCode, 400);
                t.is(e.child.message.validationErrors.length, 2);
            }
            return Future((reject, resolve) => resolve());
        }))
        .pipe (promise);
});
