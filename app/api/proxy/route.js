import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reciterId = searchParams.get('reciterId');
  const ayahNumber = searchParams.get('ayahNumber');

  try {
    const url = `https://cdn.islamic.network/quran/audio/192/${reciterId}/${ayahNumber}.mp3`;
    console.log(`Fetching audio from URL: ${url}`);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      validateStatus: (status) => status < 500, 
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');

    return new NextResponse(response.data, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error(`Error fetching audio for reciterId: ${reciterId}, ayahNumber: ${ayahNumber}`, error);
    return new NextResponse(`Error fetching the audio: ${error.message}`, { status: 500 });
  }
}