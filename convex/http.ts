import { httpRouter } from "convex/server";
import { helloHandler } from "./handlers/trial";
import { packageRateHandler } from "./handlers/packageRateHandlers";
import { getPackageByIdHTTPHandler } from "./handlers/packageIdHandlers";

const http = httpRouter();


http.route({
    path: "/hello",
    method: "GET",
    handler: helloHandler,
});


http.route({
    path: "/package/rate",
    method: "GET",
    handler:packageRateHandler,
});

http.route({
    pathPrefix: "/packages/", // Dynamic path parameter for package ID
    method: "GET",
    handler: getPackageByIdHTTPHandler,
});

export default http;