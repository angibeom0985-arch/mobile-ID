// Vercel Serverless Function - 국토교통부 도로 상황 API 프록시
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = '67489c096aa949e0bd1c2e771ca6475b';
    const { type = 'all', numOfRows = '10', pageNo = '1' } = req.query;
    
    const apiUrl = `http://apis.data.go.kr/1613000/TrafficRoadEventService/getTrafficRoadEvent?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&type=${type}&_type=json`;
    
    console.log('국토교통부 API 호출:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('국토교통부 API 응답:', data);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('국토교통부 API 에러:', error);
    return res.status(500).json({ 
      error: '도로 상황 정보를 가져올 수 없습니다.',
      details: error.message 
    });
  }
}
