import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const MOLIT_TRAFFIC_API_KEY = process.env.MOLIT_TRAFFIC_API_KEY || '67489c096aa949e0bd1c2e771ca6475b';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Fetching traffic info...');
    
    const apiUrl = `http://data.ex.co.kr/api/trafficapi/trafficInfo?key=${MOLIT_TRAFFIC_API_KEY}&type=json`;
    
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (response.data && response.data.list) {
      const parsedData = response.data.list.slice(0, 20).map((item: any) => ({
        routeName: item.routeName || '정보 없음',
        startName: item.startName || '',
        endName: item.endName || '',
        congestion: item.congestion || '원활',
        speed: item.speed || '-',
      }));

      return res.json({
        success: true,
        data: parsedData,
        count: parsedData.length,
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      data: [
        { routeName: '경부고속도로', startName: '서울', endName: '부산', congestion: '원활', speed: '100' },
        { routeName: '영동고속도로', startName: '서울', endName: '강릉', congestion: '원활', speed: '95' }
      ],
      count: 2,
      fallback: true,
      message: '도로 소통 정보를 불러올 수 없어 참고용 데이터를 표시합니다.',
    });
  } catch (error: any) {
    return res.json({
      success: true,
      data: [
        { routeName: '경부고속도로', startName: '서울', endName: '부산', congestion: '원활', speed: '100' },
        { routeName: '영동고속도로', startName: '서울', endName: '강릉', congestion: '원활', speed: '95' }
      ],
      count: 2,
      fallback: true,
      message: '도로 소통 정보를 불러올 수 없어 참고용 데이터를 표시합니다.',
    });
  }
}
