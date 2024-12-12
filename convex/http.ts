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
import {httpAction} from "./_generated/server";

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

///package/{packageID}, package/{packageID}/rate, package/{packageID}/cost
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
    path: "/package",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        // Make sure the necessary headers are present
        // for this to be a valid pre-flight request
        const headers = request.headers;
        if (
          headers.get("Origin") !== null &&
          headers.get("Access-Control-Request-Method") !== null &&
          headers.get("Access-Control-Request-Headers") !== null
        ) {
            const optionhHeaders = new Headers({
                    // e.g. https://mywebsite.com, configured on your Convex dashboard
                    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Authorization, Content-Type",
                    "Access-Control-Max-Age": "86400",
                    Vary: "origin",
                    "Access-Control-Allow-Credentials": "true",

                  });
            
            console.log('OPTIONS request headers:', optionhHeaders);
          return new Response(null, {status: 200, headers: optionhHeaders} );
        } else {
          return new Response();
        }
    })
});


http.route({
    pathPrefix: "/package/", // TODO update path accordingly.
    method: "POST",
    handler: updatePackageHandler,
});

//pre-flight request handler for CORS
http.route({
    pathPrefix: "/package/",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        // Make sure the necessary headers are present
        // for this to be a valid pre-flight request
        const headers = request.headers;
        if (
          headers.get("Origin") !== null &&
          headers.get("Access-Control-Request-Method") !== null &&
          headers.get("Access-Control-Request-Headers") !== null
        ) {
            const optionhHeaders = new Headers({
                    // e.g. https://mywebsite.com, configured on your Convex dashboard
                    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Authorization, Content-Type",
                    "Access-Control-Max-Age": "86400",
                    Vary: "origin",
                    "Access-Control-Allow-Credentials": "true",

                  });
            
            console.log('OPTIONS request headers:', optionhHeaders);
          return new Response(null, {status: 200, headers: optionhHeaders} );
        } else {
          return new Response();
        }
    })
});

// authenticate route
http.route({
    path: "/authenticate",
    method: "PUT",
    handler: authenticateHandler,
});



export default http;
