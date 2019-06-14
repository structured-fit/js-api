import test from "ava";
import * as express from "express";
import * as supertest from "supertest";
import { SuperAgentRequest, SuperAgent } from "superagent";
import { PasswordAuthLogin } from "../../../../src/auth/password/login";
import { transformAndValidateSync } from "class-transformer-validator";
import { PasswordLoginRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/login/PasswordLoginRequest";
import { PasswordLoginResponse } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/login/PasswordLoginResponse";
import { PostOptions } from "../../../../src/util/PostOptions";
import { promise, map } from "fluture";

class MockPasswordAuthLogin extends PasswordAuthLogin {

    public prefix() {
        return "";
    }

    protected getRequest(): SuperAgent<SuperAgentRequest> {
        const app = express();
        app.post("/api/auth/password/login/", (req, res) => {
            res.json(transformAndValidateSync(PasswordLoginResponse, {
                jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            }));
        });
        return supertest(app);
    }

}

test("returns JWT", async t => {
    const options = PostOptions.create({
        responseTimeout: 500,
        deadlineTimeout: 750,
    });
    const body: PasswordLoginRequest = transformAndValidateSync(PasswordLoginRequest, {
        email: "foo@example.com",
        password: "bar",
    });
    const request = new MockPasswordAuthLogin(options).post(body).request();
    return request
        .pipe (map (res => {
            if(Array.isArray(res)) {
                t.fail("Response should be a single object.");
                return;
            }
            t.true(res.jwt.length > 10);
        }))
        .pipe (promise);
});
