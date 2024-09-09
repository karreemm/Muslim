import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reciterId = searchParams.get('reciterId');
  const ayahNumber = searchParams.get('ayahNumber');

  try {
    // Construct the URL
    const url = `https://cdn.islamic.network/quran/audio/192/${reciterId}/${ayahNumber}.mp3`;
    console.log(`Fetching audio from URL: ${url}`);

    // Fetch the audio file
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
    });

    // Check if the response status is not 200
    if (response.status !== 200) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    // Set the response headers
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');

    // Return the response
    return new NextResponse(response.data, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error(`Error fetching audio for reciterId: ${reciterId}, ayahNumber: ${ayahNumber}`, error);
    return new NextResponse(`Error fetching the audio: ${error.message}`, { status: 500 });
  }
}