import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get('name');

    if (!cityName) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    // Read ZHVI data (historical values)
    const zhviPath = path.join(process.cwd(), 'src', 'data', 'zhvi.csv');
    const zhviContent = readFileSync(zhviPath, 'utf-8');
    const zhviRecords = parse(zhviContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Read ZHVF data (forecasts)
    const zhvfPath = path.join(process.cwd(), 'src', 'data', 'zhvf.csv');
    const zhvfContent = readFileSync(zhvfPath, 'utf-8');
    const zhvfRecords = parse(zhvfContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Find city data
    const cityData = zhviRecords.find((record: any) => 
      record.RegionName === cityName && record.RegionType === 'msa'
    );

    if (!cityData) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    // Process historical values from ZHVI
    const values = Object.entries(cityData)
      .filter(([key]) => /^\d{4}-\d{2}-\d{2}$/.test(key))
      .map(([date, value]) => ({
        date,
        value: parseFloat(value as string)
      }))
      .filter(item => !isNaN(item.value))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get forecast data from ZHVF
    const cityForecast = zhvfRecords.find((record: any) => 
      record.RegionID === cityData.RegionID
    );

    // Process forecast values
    const forecasts = cityForecast
      ? Object.entries(cityForecast)
          .filter(([key]) => /^\d{4}-\d{2}-\d{2}$/.test(key))
          .map(([date, value]) => ({
            date,
            value: parseFloat(value as string)
          }))
          .filter(item => !isNaN(item.value))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      : [];

    const responseData = {
      RegionID: cityData.RegionID,
      RegionName: cityData.RegionName,
      RegionType: cityData.RegionType,
      StateName: cityData.StateName,
      values,
      forecasts
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error loading city data:', error);
    return NextResponse.json(
      { error: 'Failed to load city data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}