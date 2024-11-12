'use server';

import { cookies } from 'next/headers';

export interface LocationData {
  city: string;
  state: string;
  zip: string;
}

export async function reverseGeocode(
  latitude: number, 
  longitude: number
): Promise<LocationData> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    const result = data.results[0].components;
    
    return {
      city: result.city || result.town || result.village || '',
      state: result.state || '',
      zip: result.postcode || ''
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to get location details');
  }
}

export async function saveLocationToCookie(locationData: LocationData) {
  cookies().set('userLocation', JSON.stringify(locationData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400 * 7 // 7 days
  });
}