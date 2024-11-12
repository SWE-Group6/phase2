import { httpRouter } from "convex/server";
import { helloHandler, packageRateHandler } from "./api";

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

export default http;