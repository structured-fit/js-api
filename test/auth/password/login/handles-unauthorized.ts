import test from "ava";
import * as express from "express";
import * as supertest from "supertest";
import { SuperAgentRequest, SuperAgent } from "superagent";
import { PasswordAuthLogin } from "../../../../src/auth/password/login";
import { transformAndValidateSync } from "class-transformer-validator";
import { PasswordLoginRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/login/PasswordLoginRequest";
import { PostOptions } from "../../../../src/util/PostOptions";
import Future, { map, promise, chainRej } from "fluture";
import { UnauthorizedResponse, isWrappedUnauthorizedResponse } from "../../../../src/util/UnauthorizedResponse";

class MockPasswordAuthLogin extends PasswordAuthLogin {

    public prefix() {
        return "";
    }

    protected getRequest(): SuperAgent<SuperAgentRequest> {
        const app = express();
        app.post("/api/auth/password/login/", (req, res) => {
            const unauthorized = transformAndValidateSync(UnauthorizedResponse, {
                statusCode: 401,
                error: "Unauthorized",
            });
            res.status(401).json(unauthorized);
        });
        return supertest(app);
    }

}

test("returns UnauthorizedResponse", async t => {
    t.plan(1);
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
            t.fail("Request should fail")
        }))
        .pipe (chainRej (e => {
            if(!isWrappedUnauthorizedResponse(e)) {
                t.fail("Got error other than UnauthorizedResponse");
            } else {
                t.is(e.child.statusCode, 401);
            }
            return Future((reject, resolve) => resolve());
        }))
        .pipe (promise);
});
