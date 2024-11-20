import { Package } from "../package_rate/Models/Package"
import { httpAction} from "../_generated/server";


//not using as of now
export const packageRateHandler = httpAction(async (ctx, request) => {
    //grab the url query param from the request
    const entireUrl = new URL(request.url);
    const url = entireUrl.searchParams.get('url');

    // Print the type of url and version
    console.log('Type of URL:', typeof url);
    console.log('URL:', url);

    if (typeof url !== 'string' || !url) {
        return new Response(JSON.stringify({ error: 'Invalid or missing URL in query parameters' }), {
            status: 400,
        });
    }

    try {
        const pkg = new Package(url); // Assuming version is optional
        const metrics = await pkg.getMetrics();
        
        // Send metrics as JSON
        return new Response(JSON.stringify(metrics), {
            status: 200,
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
            status: 500,
        });
    }
    
});