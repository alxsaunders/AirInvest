// lib/csvCache.ts
import fs from 'fs';
import path from 'path';
import { parse, format } from 'date-fns';

interface CacheEntry {
  date: string;
  city: string;
  state: string;
  results: string; // JSON stringified results
}

const CSV_PATH = path.join(process.cwd(), 'data', 'property-cache.csv');
const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

export const initializeCache = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, 'date,city,state,results\n');
  }
};

export const cleanupOldEntries = () => {
  initializeCache();
  
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split('\n');
  const header = lines[0];
  const entries = lines.slice(1).filter(line => line.trim());

  const currentTime = new Date().getTime();
  const validEntries = entries.filter(entry => {
    const [date] = entry.split(',');
    const entryTime = new Date(date).getTime();
    return currentTime - entryTime < CACHE_DURATION;
  });

  fs.writeFileSync(CSV_PATH, [header, ...validEntries].join('\n'));
};

export const getCachedResults = (city: string, state: string) => {
  try {
    initializeCache();
    cleanupOldEntries();

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n');
    const entries = lines.slice(1).filter(line => line.trim());

    for (const entry of entries) {
      const [date, entryCity, entryState, results] = entry.split(',');
      if (
        entryCity.toLowerCase() === city.toLowerCase() &&
        entryState.toLowerCase() === state.toLowerCase()
      ) {
        return JSON.parse(results);
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

export const saveToCache = (city: string, state: string, results: any[]) => {
  try {
    initializeCache();
    cleanupOldEntries();

    const date = new Date().toISOString();
    const escapedResults = JSON.stringify(results).replace(/,/g, '|');
    const newLine = `${date},${city},${state},${escapedResults}\n`;

    fs.appendFileSync(CSV_PATH, newLine);
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};