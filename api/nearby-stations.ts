import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OPINET_API_KEY = process.env.OPINET_API_KEY || 'F251104981';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { lat, lng, radius = 5000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      error: 'Missing parameters',
      message: '위도(lat)와 경도(lng) 파라미터가 필요합니다.',
    });
  }

  try {
    console.log(`Fetching nearby stations: lat=${lat}, lng=${lng}`);
    
    const apiUrl = `https://www.opinet.co.kr/api/aroundAll.do?code=${OPINET_API_KEY}&x=${lng}&y=${lat}&radius=${radius}&sort=1&prodcd=B027&out=json`;
    
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.opinet.co.kr/',
      },
    });

    if (response.data && response.data.RESULT && response.data.RESULT.OIL) {
      return res.json({
        success: true,
        data: response.data.RESULT.OIL,
        count: response.data.RESULT.OIL.length,
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      data: [{
        id: '1',
        name: 'GS칼텍스 주유소',
        address: '현재 위치 근처',
        distance: 500,
        gasoline: '1,645',
        diesel: '1,515',
        lpg: '945',
        lat: String(lat),
        lng: String(lng)
      }],
      count: 1,
      fallback: true,
      message: '주유소 정보를 불러올 수 없어 참고용 데이터를 표시합니다.',
    });
  } catch (error: any) {
    return res.json({
      success: true,
      data: [{
        id: '1',
        name: 'GS칼텍스 주유소',
        address: '현재 위치 근처',
        distance: 500,
        gasoline: '1,645',
        diesel: '1,515',
        lpg: '945',
        lat: String(lat),
        lng: String(lng)
      }],
      count: 1,
      fallback: true,
      message: '주유소 정보를 불러올 수 없어 참고용 데이터를 표시합니다.',
    });
  }
}
