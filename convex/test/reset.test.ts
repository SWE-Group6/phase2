import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("Reset Handler", async () => {
    const t = convexTest(schema);

    const eceUser = t.withIdentity({ name: "ECE Default", isAdmin: true, email:"ece30861defaultadminuser@purdue.edu" });

    const response = await eceUser.fetch("/reset", {
        method: "DELETE",
    });

    console.log("Response: ", response);
    expect(response.status).toBe(200); // Expecting a successful response
    const body = await response.json();
    console.log("Body: ", body);
    expect(body).toEqual("Registry is reset"); // Expecting an empty object in response
});