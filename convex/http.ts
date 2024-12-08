import { httpRouter } from "convex/server";
import { helloHandler } from "./handlers/trial";
import { getPackageByIdHTTPHandler } from "./handlers/packageIdHandlers";
import { getPackagesHTTPHandler } from "./handlers/packageHandlers";
import { getPackageByRegexHTTPHandler } from "./handlers/packageByRegexHandlers";
import { getTracksHTTPHandler } from "./handlers/trackHandlers";
import { resetHandler } from "./handlers/resetHandler";
import { uploadPackageHandler } from "./handlers/uploadPackageHandler";
import { updatePackageHandler } from "./handlers/updatePackageHandler";
import { authenticateHandler } from "./handlers/authenticateHandler";

const http = httpRouter();


http.route({
    path: "/hello",
    method: "GET",
    handler: helloHandler,
});

http.route({
    path: "/packages",
    method: "POST",
    handler: getPackagesHTTPHandler,
});

http.route({
    path: "/package/byRegEx",
    method: "POST",
    handler: getPackageByRegexHTTPHandler,
});


http.route({
    pathPrefix: "/package/", // Dynamic path parameter for package ID
    method: "GET",
    handler: getPackageByIdHTTPHandler,
});

http.route({
    path: "/tracks",
    method: "GET",
    handler: getTracksHTTPHandler,
});

http.route({
    path: "/reset",
    method: "DELETE",
    handler: resetHandler,
});

http.route({
	path: "/package",
	method: "POST",
	handler: uploadPackageHandler,
});

http.route({
	pathPrefix: "/package/", // TODO update path accordingly.
	method: "POST",
	handler: updatePackageHandler,
});
// authenticate route
http.route({
    path: "/authenticate",
    method: "PUT",
    handler: authenticateHandler,
});


export default http;
