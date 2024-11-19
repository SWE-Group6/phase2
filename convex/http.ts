import { httpRouter } from "convex/server";
import { helloHandler, packageRateHandler, getPackageByIdHTTPHandler } from "./api";
import { httpAction, ActionCtx } from "./_generated/server";


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