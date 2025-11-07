// Vercel Serverless Function - 오피넷 API 프록시
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
    const apiKey = 'F251104981';
    const apiUrl = `https://www.opinet.co.kr/api/avgAllPrice.do?code=${apiKey}&out=json`;
    
    console.log('오피넷 API 호출:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('오피넷 API 응답:', data);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('오피넷 API 에러:', error);
    return res.status(500).json({ 
      error: '유가 정보를 가져올 수 없습니다.',
      details: error.message 
    });
  }
}
