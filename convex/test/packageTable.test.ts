import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

interface PackageData {
    _id?: string;
    _creationTime?: string;
    metadata?: {
        Name: string;
        Version: string;
        ID: string;
        Secret: boolean;
    };
    data?: {
        Content: string;
        URL: string;
        JSProgram: string;
    };
}


let packageDataAfterUpload: PackageData = {};


test("Upload Handler Sucessful Upload", async () => {
    const t = convexTest(schema);

    const eceUser = t.withIdentity({ name: "ECE Default", isAdmin: true, email:"ece30861defaultadminuser@purdue.edu" });

    const response = await eceUser.fetch("/package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "URL": "https://github.com/lodash/lodash",
            "JSProgram": "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n",
            "Secret": false,
        })
    });
    console.log('Response:', response);
    const body = await response.json();
    console.log('Body:', body);
    packageDataAfterUpload = body;
    expect(response.status).toBe(201);
  });
  

test("Update Handler", async () => {
    const t = convexTest(schema);

    const eceUser = t.withIdentity({ name: "ECE Default", isAdmin: true, email:"ece30861defaultadminuser@purdue.edu" });

    const response = await eceUser.fetch("/package/" + packageDataAfterUpload._id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "metadata": {
          "Name": "lodash",
          "Version": "16.4.8",
          "ID": "jn7ebvs9bby98d9w647gsfpdh575yj6w",
          "Secret": false
        },
        "data": {
          "Name": "dotenv",
          "Content": "kg2ef42mx9xrds97j6zs6cy9j575yzvh",
          "URL": "https://github.com/motdotla/dotenv/",
          "JSProgram": "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n"
        }
      }),
    })
    console.log("Response: " + response);
    const body = await response.json();
    console.log("Body: " + body);
    //expect the body to be available
    expect(body).toBeDefined();
});  




 


            