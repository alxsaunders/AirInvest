// app/api/check-cache/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Initialize data directory and CSV path
const dataDir = path.join(process.cwd(), 'data');
const CSV_PATH = path.join(dataDir, 'property-cache.csv');

// Initialize cache with error handling and logging
const initializeCache = () => {
    try {
        console.log('Initializing cache...');
        console.log('Data directory path:', dataDir);
        
        if (!fs.existsSync(dataDir)) {
            console.log('Creating data directory...');
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        if (!fs.existsSync(CSV_PATH)) {
            console.log('Creating CSV file...');
            fs.writeFileSync(CSV_PATH, 'date,city,state,results\n');
        }
        
        console.log('Cache initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing cache:', error);
        return false;
    }
};

// Add function to save to cache
const saveToCache = (city: string, state: string, results: any) => {
    try {
        console.log('Saving to cache...');
        const date = new Date().toISOString();
        const resultsString = JSON.stringify(results).replace(/,/g, '|'); // Prevent CSV issues
        const newLine = `${date},${city},${state},${resultsString}\n`;
        
        fs.appendFileSync(CSV_PATH, newLine);
        console.log('Saved to cache successfully');
        return true;
    } catch (error) {
        console.error('Error saving to cache:', error);
        return false;
    }
};

export async function POST(request: Request) {
    try {
        const initialized = initializeCache();
        if (!initialized) {
            return NextResponse.json({ error: 'Failed to initialize cache' }, { status: 500 });
        }

        const { city, state, results } = await request.json();

        if (!city || !state) {
            return NextResponse.json({ error: 'City and state are required' }, { status: 400 });
        }

        console.log('Checking cache for:', city, state);

        // If results are provided, save them to cache
        if (results) {
            saveToCache(city, state, results);
            return NextResponse.json({ 
                message: 'Results cached successfully',
                hasCache: true,
                results,
                timestamp: new Date().toISOString()
            });
        }

        // Read from cache
        const content = fs.readFileSync(CSV_PATH, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim());
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const [date, cachedCity, cachedState, cachedResults] = lines[i].split(',');
            
            if (cachedCity.toLowerCase() === city.toLowerCase() && 
                cachedState.toLowerCase() === state.toLowerCase()) {
                
                // Check if cache is less than 3 days old
                const cacheDate = new Date(date);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - cacheDate.getTime());
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays < 3) {
                    console.log('Cache hit for:', city, state);
                    return NextResponse.json({
                        hasCache: true,
                        results: JSON.parse(cachedResults.replace(/\|/g, ',')),
                        timestamp: date
                    });
                }
            }
        }

        console.log('No cache found for:', city, state);
        return NextResponse.json({ hasCache: false });

    } catch (error) {
        console.error('Cache check error:', error);
        return NextResponse.json({ error: 'Failed to check cache' }, { status: 500 });
    }
}