import test from "ava";
import * as express from "express";
import * as supertest from "supertest";
import { SuperAgentRequest, SuperAgent } from "superagent";
import { PasswordAuthRegister } from "../../../../src/auth/password/register";
import { transformAndValidateSync } from "class-transformer-validator";
import { PasswordRegisterRequest } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/register/PasswordRegisterRequest";
import { PasswordRegisterResponse } from "@structured-fit/js-api-definitions/dist/src/api/auth/password/register/PasswordRegisterResponse";
import { PostOptions } from "../../../../src/util/PostOptions";
import { promise, map } from "fluture";

class MockPasswordAuthRegister extends PasswordAuthRegister {

    public prefix() {
        return "";
    }

    protected getRequest(): SuperAgent<SuperAgentRequest> {
        const app = express();
        app.post("/api/auth/password/register/", (req, res) => {
            res.json(transformAndValidateSync(PasswordRegisterResponse, {
                request: "PPBqWA9",
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
    const body: PasswordRegisterRequest = transformAndValidateSync(PasswordRegisterRequest, {
        name: "Bob",
        email: "foo@example.com",
        password: "bar",
    });
    const request = new MockPasswordAuthRegister(options).post(body).request();
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
