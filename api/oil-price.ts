import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OPINET_API_KEY = process.env.OPINET_API_KEY || 'F251104981';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Fetching oil prices from Opinet API...');
    
    const apiUrl = `https://www.opinet.co.kr/api/avgAllPrice.do?code=${OPINET_API_KEY}&out=json`;
    
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.opinet.co.kr/',
      },
    });

    if (response.data && response.data.RESULT && response.data.RESULT.OIL) {
      console.log('✅ Oil prices fetched successfully');
      return res.json({
        success: true,
        data: response.data.RESULT.OIL,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn('⚠️ Invalid API response, returning fallback data');
      return res.json({
        success: true,
        data: [
          { prodcd: 'B027', prodnm: '휘발유', price: '1,650.5', diff: '10.2' },
          { prodcd: 'D047', prodnm: '경유', price: '1,520.3', diff: '-5.4' },
          { prodcd: 'K015', prodnm: '고급휘발유', price: '1,950.7', diff: '15.1' },
          { prodcd: 'C004', prodnm: 'LPG', price: '950.2', diff: '3.5' }
        ],
        timestamp: new Date().toISOString(),
        fallback: true,
        message: '실시간 데이터를 불러올 수 없어 참고용 데이터를 표시합니다.',
      });
    }
  } catch (error: any) {
    console.error('❌ Oil price fetch error:', error.message);
    return res.json({
      success: true,
      data: [
        { prodcd: 'B027', prodnm: '휘발유', price: '1,650.5', diff: '10.2' },
        { prodcd: 'D047', prodnm: '경유', price: '1,520.3', diff: '-5.4' },
        { prodcd: 'K015', prodnm: '고급휘발유', price: '1,950.7', diff: '15.1' },
        { prodcd: 'C004', prodnm: 'LPG', price: '950.2', diff: '3.5' }
      ],
      timestamp: new Date().toISOString(),
      fallback: true,
      message: '실시간 데이터를 불러올 수 없어 참고용 데이터를 표시합니다.',
    });
  }
}
