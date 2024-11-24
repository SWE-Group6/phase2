import { httpRouter } from "convex/server";
import { helloHandler } from "./handlers/trial";
import { getPackageByIdHTTPHandler } from "./handlers/packageIdHandlers";
import { getPackagesHTTPHandler } from "./handlers/packageHandlers";

const http = httpRouter();


http.route({
    path: "/hello",
    method: "GET",
    handler: helloHandler,
});

http.route({
    path: "/packages", // Dynamic path parameter for package ID
    method: "GET",
    handler: getPackagesHTTPHandler,
});

http.route({
    pathPrefix: "/packages/", // Dynamic path parameter for package ID
    method: "GET",
    handler: getPackageByIdHTTPHandler,
});

http.route({
    path: "/package/upload", 
    method: "POST",
    handler: uploadPackageHandler,
});

export default http;
