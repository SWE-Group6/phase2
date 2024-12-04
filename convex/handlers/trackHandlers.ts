import { api } from "../_generated/api";
import { httpAction } from "../_generated/server";

export const getTracksHTTPHandler = httpAction(async (ctx, request) => {
    const tracks = {
        "plannedTracks": [
            "Access control track",
        ]
    }
      return new Response(JSON.stringify(tracks), { status: 200 });
});
