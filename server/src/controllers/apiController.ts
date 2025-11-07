import { Request, Response } from 'express';
import axios from 'axios';

// API Keys from environment variables
const OPINET_API_KEY = process.env.OPINET_API_KEY;
const MOLIT_TRAFFIC_API_KEY = process.env.MOLIT_TRAFFIC_API_KEY;

/**
 * Get oil prices from Opinet API
 */
export const getOilPrice = async (req: Request, res: Response) => {
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
      res.json({
        success: true,
        data: response.data.RESULT.OIL,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn('⚠️ Invalid API response, returning fallback data');
      // 폴백 데이터 제공
      res.json({
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
    // 오류 발생 시에도 폴백 데이터 제공
    res.json({
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
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get nearby gas stations from Opinet API
 */
export const getNearbyStations = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    // Validate required parameters
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
        message: '위도(lat)와 경도(lng) 파라미터가 필요합니다.',
      });
    }

    console.log(`Fetching nearby stations: lat=${lat}, lng=${lng}, radius=${radius}`);

    const apiUrl = `https://www.opinet.co.kr/api/aroundAll.do?code=${OPINET_API_KEY}&x=${lng}&y=${lat}&radius=${radius}&sort=1&prodcd=B027&out=json`;

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
      console.log(`✅ Found ${response.data.RESULT.OIL.length} nearby stations`);
      res.json({
        success: true,
        data: response.data.RESULT.OIL,
        count: response.data.RESULT.OIL.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn('⚠️ Invalid API response, returning fallback data');
      // 폴백 데이터 제공
      res.json({
        success: true,
        data: [
          {
            id: '1',
            name: 'GS칼텍스 주유소',
            address: '현재 위치 근처',
            distance: 500,
            gasoline: '1,645',
            diesel: '1,515',
            lpg: '945',
            lat: String(lat),
            lng: String(lng)
          },
          {
            id: '2',
            name: 'SK에너지 주유소',
            address: '현재 위치 근처',
            distance: 800,
            gasoline: '1,650',
            diesel: '1,520',
            lpg: '950',
            lat: String(lat),
            lng: String(lng)
          }
        ],
        count: 2,
        timestamp: new Date().toISOString(),
        fallback: true,
        message: '실시간 데이터를 불러올 수 없어 참고용 데이터를 표시합니다.',
      });
    }
  } catch (error: any) {
    console.error('❌ Nearby stations fetch error:', error.message);
    // 오류 발생 시에도 폴백 데이터 제공
    res.json({
      success: true,
      data: [
        {
          id: '1',
          name: 'GS칼텍스 주유소',
          address: '현재 위치 근처',
          distance: 500,
          gasoline: '1,645',
          diesel: '1,515',
          lpg: '945',
          lat: String(req.query.lat || '37.5665'),
          lng: String(req.query.lng || '126.9780')
        }
      ],
      count: 1,
      timestamp: new Date().toISOString(),
      fallback: true,
      message: '주유소 정보를 불러올 수 없어 참고용 데이터를 표시합니다.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get traffic information from Korea Expressway API
 */
export const getTrafficInfo = async (req: Request, res: Response) => {
  try {
    console.log('Fetching traffic info from Korea Expressway API...');

    const apiUrl = `http://data.ex.co.kr/api/trafficapi/trafficInfo?key=${MOLIT_TRAFFIC_API_KEY}&type=json`;

    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
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

      console.log(`✅ Traffic info fetched: ${parsedData.length} routes`);
      res.json({
        success: true,
        data: parsedData,
        count: parsedData.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn('⚠️ Invalid API response, returning fallback data');
      // 폴백 데이터 제공
      res.json({
        success: true,
        data: [
          { routeName: '경부고속도로', startName: '서울', endName: '부산', congestion: '원활', speed: '100' },
          { routeName: '영동고속도로', startName: '서울', endName: '강릉', congestion: '원활', speed: '95' },
          { routeName: '서해안고속도로', startName: '서울', endName: '목포', congestion: '원활', speed: '95' },
          { routeName: '중부고속도로', startName: '서울', endName: '대전', congestion: '원활', speed: '90' }
        ],
        count: 4,
        timestamp: new Date().toISOString(),
        fallback: true,
        message: '실시간 데이터를 불러올 수 없어 참고용 데이터를 표시합니다.',
      });
    }
  } catch (error: any) {
    console.error('❌ Traffic info fetch error:', error.message);
    // 오류 발생 시에도 폴백 데이터 제공
    res.json({
      success: true,
      data: [
        { routeName: '경부고속도로', startName: '서울', endName: '부산', congestion: '원활', speed: '100' },
        { routeName: '영동고속도로', startName: '서울', endName: '강릉', congestion: '원활', speed: '95' }
      ],
      count: 2,
      timestamp: new Date().toISOString(),
      fallback: true,
      message: '도로 소통 정보를 불러올 수 없어 참고용 데이터를 표시합니다.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
