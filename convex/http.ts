import { httpRouter } from "convex/server";
import { helloHandler } from "./handlers/trial";
import { getPackageByIdHTTPHandler } from "./handlers/packageIdHandlers";
import { getPackagesHTTPHandler } from "./handlers/packageHandlers";
import { getPackageByRegexHTTPHandler } from "./handlers/packageByRegexHandlers";
import { getTracksHTTPHandler } from "./handlers/trackHandlers";

const http = httpRouter();


http.route({
    path: "/hello",
    method: "GET",
    handler: helloHandler,
});

http.route({
    path: "/packages",
    method: "GET",
    handler: getPackagesHTTPHandler,
});

http.route({
    path: "/package/byRegEx",
    method: "POST",
    handler: getPackageByRegexHTTPHandler,
});


http.route({
    pathPrefix: "/packages/", // Dynamic path parameter for package ID
    method: "GET",
    handler: getPackageByIdHTTPHandler,
});

http.route({
    path: "/tracks",
    method: "GET",
    handler: getTracksHTTPHandler,
});


export default http;