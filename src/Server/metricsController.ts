import { Request, Response } from 'express';
import { Package } from '../Models/Package';

export const getMetrics = async (req: Request, res: Response): Promise<void> => {
    const { url } = req.query;

    // Print the type of url and version
    console.log('Type of URL:', typeof url);
    console.log('URL:', url);

    if (typeof url !== 'string' || !url) {
        res.status(400).json({ error: 'Invalid or missing URL in query parameters' });
        return;
    }

    try {
        const pkg = new Package(url); // Assuming version is optional
        const metrics = await pkg.getMetrics();
        
        // Send metrics as JSON
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};
