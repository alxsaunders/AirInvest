import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

export async function GET() {
  try {
    // Read from ZHVI file
    const zhviPath = path.join(process.cwd(), 'src', 'data', 'zhvi.csv');
    console.log('Reading ZHVI file from:', zhviPath);
    
    const fileContent = readFileSync(zhviPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Filter for MSA cities only
    const cities = records
      .filter((record: any) => record.RegionType === 'msa')
      .map((record: any) => ({
        id: record.RegionID,
        name: record.RegionName,
        state: record.StateName
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error loading cities:', error);
    return NextResponse.json(
      { error: 'Failed to load cities', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}