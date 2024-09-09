import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const surahNumber = searchParams.get('surahNumber');
  const ayahNumber = searchParams.get('ayahNumber');
  const reciterId = searchParams.get('reciterId');

  try {
    const response = await axios.get(`https://cdn.islamic.network/quran/audio/128/${reciterId}/${ayahNumber}.mp3`, {
      responseType: 'arraybuffer',
    });
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');

    return new NextResponse(response.data, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Error fetching the audio:', error);
    return new NextResponse('Error fetching the audio', { status: 500 });
  }
}