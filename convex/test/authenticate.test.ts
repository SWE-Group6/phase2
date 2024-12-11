import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";

test("Authenticate Handler - Successful Authentication", async () => {
    const t = convexTest(schema);

    const adminUsername = process.env.AdminUsername;
    const adminPassword = process.env.AdminPassword;

    const response = await t.fetch("/authenticate", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            User: { name: adminUsername },
            Secret: { password: adminPassword },
        }),
    });

    const body = await response.json();
    console.log("Response:", response);
    console.log("Body:", body);

    expect(response.status).toBe(200);
    expect(body).toMatch(/^Bearer /); // Check if the response body starts with "Bearer "
});

test("Authenticate Handler - Invalid Credentials", async () => {
    const t = convexTest(schema);
    const adminUsername = process.env.AdminUsername;
    const response = await t.fetch("/authenticate", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            User: { name: adminUsername },
            Secret: { password: "invalidPassword" },
        }),
    });

    expect(response.status).toBe(401);
});
