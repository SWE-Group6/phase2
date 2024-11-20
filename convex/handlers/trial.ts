import {httpAction} from "../_generated/server";


export const helloHandler = httpAction(async (ctx, request) => {
    return new Response(JSON.stringify({messsage: "Hello world!"}), {
      status: 200,
      });
  });