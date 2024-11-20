import fs from 'fs';
import path from 'path';
import { CacheEntry, SearchParams } from '@/types/cache';
import { ZillowProperty } from '@/types/property';

export class CacheManager {
  private readonly dataDir: string;
  private readonly cacheFile: string;
  private readonly maxAgeDays: number;

  constructor(maxAgeDays = 3) {
    this.dataDir = path.join(process.cwd(), 'data');
    this.cacheFile = path.join(this.dataDir, 'property-cache.json');
    this.maxAgeDays = maxAgeDays;
    this.initializeCache();
  }

  private initializeCache(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.cacheFile)) {
      fs.writeFileSync(this.cacheFile, JSON.stringify([]));
    }
  }

  private readCache(): CacheEntry[] {
    try {
      const content = fs.readFileSync(this.cacheFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading cache:', error);
      return [];
    }
  }

  private writeCache(entries: CacheEntry[]): void {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(entries, null, 2));
    } catch (error) {
      console.error('Error writing cache:', error);
    }
  }

  private isCacheValid(timestamp: string): boolean {
    const cacheDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - cacheDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays < this.maxAgeDays;
  }

  public getCacheKey(searchParams: SearchParams): string {
    return `${searchParams.city.toLowerCase()}_${searchParams.state.toLowerCase()}_${
      JSON.stringify(searchParams.filters || {})
    }`;
  }

  public getCache(searchParams: SearchParams): CacheEntry | null {
    const entries = this.readCache();
    const cacheKey = this.getCacheKey(searchParams);
    
    const entry = entries.find(entry => 
      this.getCacheKey(entry.searchParams) === cacheKey
    );

    if (entry && this.isCacheValid(entry.timestamp)) {
      return entry;
    }

    return null;
  }

  public setCache(searchParams: SearchParams, results: ZillowProperty[]): void {
    const entries = this.readCache();
    const cacheKey = this.getCacheKey(searchParams);
    
    const filteredEntries = entries.filter(entry => 
      this.getCacheKey(entry.searchParams) !== cacheKey
    );

    filteredEntries.push({
      timestamp: new Date().toISOString(),
      results,
      searchParams
    });

    const validEntries = filteredEntries.filter(entry => 
      this.isCacheValid(entry.timestamp)
    );

    this.writeCache(validEntries);
  }
}