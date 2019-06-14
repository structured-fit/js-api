import test from "ava";
import * as express from "express";
import * as supertest from "supertest";
import { SuperAgentRequest, SuperAgent } from "superagent";
import { PasswordAuthLogin } from "../../../../src/auth/password/login";
import { transformAndValidateSync } from "class-transformer-validator";
import { PasswordLoginRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/login/PasswordLoginRequest";
import { PostOptions } from "../../../../src/util/PostOptions";
import { promise } from "fluture";
import { TimeoutError } from "../../../../src/util/TimeoutError";

class MockPasswordAuthLogin extends PasswordAuthLogin {

    public prefix() {
        return "";
    }

    protected getRequest(): SuperAgent<SuperAgentRequest> {
        const app = express();
        app.post("/api/auth/password/login/", (req, res) => {
            setTimeout(() => res.send("After timeout"), 200);
        });
        return supertest(app);
    }

}


test("throws TimeoutError", async t => {
    t.plan(1);
    const options = PostOptions.create({
        deadlineTimeout: 100,
        responseTimeout: 100,
    });
    const body: PasswordLoginRequest = transformAndValidateSync(PasswordLoginRequest, {
        email: "foo@example.com",
        password: "bar",
    });
    const err = await t.throwsAsync(new MockPasswordAuthLogin(options).post(body).request().pipe (promise), TimeoutError);
});
