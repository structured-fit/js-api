import test from "ava";
import * as express from "express";
import * as supertest from "supertest";
import { SuperAgentRequest, SuperAgent } from "superagent";
import { transformAndValidateSync } from "class-transformer-validator";
import { PasswordForgotRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/forgot/PasswordForgotRequest";
import { PasswordForgotResponse } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/forgot/PasswordForgotResponse";
import { PostOptions } from "../../../../src/util/PostOptions";
import { promise, map } from "fluture";
import { PasswordAuthForgot } from "../../../../src/auth/password/forgot";

class MockPasswordAuthForgot extends PasswordAuthForgot {

    public prefix() {
        return "";
    }

    protected getRequest(): SuperAgent<SuperAgentRequest> {
        const app = express();
        app.post("/api/auth/password/forgot/", (req, res) => {
            res.json(transformAndValidateSync(PasswordForgotResponse, {
                request: "PPBqWA9",
            }));
        });
        return supertest(app);
    }

}

test("returns token", async t => {
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
            if(Array.isArray(res)) {
                t.fail("Response should be a single object.");
                return;
            }
            t.true(res.request.length > 2);
        }))
        .pipe (promise);
});
