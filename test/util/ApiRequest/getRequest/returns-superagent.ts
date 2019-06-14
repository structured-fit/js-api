import test from "ava";
import { PasswordAuthLogin } from "../../../../src/auth/password/login";
import { PostOptions } from "../../../../src/util/PostOptions";

class MockPostRequest extends PasswordAuthLogin {

    getRequestPublic() {
        return this.getRequest();
    }

}

test("returns a SuperAgent instance", t => {
    const request = new MockPostRequest(PostOptions.create({
        deadlineTimeout: 0,
        responseTimeout: 0,
    }));
    t.is(typeof request.getRequestPublic(), "function");
});
