import test from "ava";
import * as express from "express";
import * as supertest from "supertest";
import { SuperAgentRequest, SuperAgent } from "superagent";
import { PasswordAuthLogin } from "../../../../../src/auth/password/login";
import { transformAndValidateSync } from "class-transformer-validator";
import { PasswordLoginRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/login/PasswordLoginRequest";
import { PostOptions } from "../../../../../src/util/PostOptions";
import { promise } from "fluture";
import { ResponseValidationError } from "../../../../../src/util/ResponseValidationError";

class MockPasswordAuthLogin extends PasswordAuthLogin {

    public prefix() {
        return "";
    }

    protected getRequest(): SuperAgent<SuperAgentRequest> {
        const app = express();
        app.post("/api/auth/password/login/", (req, res) => {
            res.status(500).send("doesn't match");
        });
        return supertest(app);
    }

}


test("throws ResponseValidationError", async t => {
    t.plan(2);
    const options = PostOptions.create({
        deadlineTimeout: 300,
        responseTimeout: 300,
    });
    const body: PasswordLoginRequest = transformAndValidateSync(PasswordLoginRequest, {
        email: "foo@example.com",
        password: "bar",
    });
    const err: ResponseValidationError = await t.throwsAsync(new MockPasswordAuthLogin(options).post(body).request().pipe (promise), ResponseValidationError);
    t.is(err.classification, "error");
});
