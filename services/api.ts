/**
 * PRD API 服务
 */

// TODO: 在飞书开放平台配置后替换为实际的 API Key
const API_KEY = 'YOUR_API_KEY_HERE';
const API_BASE_URL = 'https://prd.myintent.cc';

interface Source {
  file: string;
  title: string;
  url: string;
  start_line?: number;
  end_line?: number;
}

interface AskResponse {
  type: string;
  answer: string;
  sources: Source[];
}

/**
 * 查询 PRD 文档
 */
export function askPRD(query: string): Promise<AskResponse> {
  return new Promise((resolve, reject) => {
    tt.request({
      url: `${API_BASE_URL}/ask`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      data: { query },
      success(res) {
        if (res.statusCode === 200 && res.data) {
          resolve(res.data as AskResponse);
        } else {
          console.error('API error:', res);
          reject(new Error(res.data?.error || 'API request failed'));
        }
      },
      fail(err) {
        console.error('Request failed:', err);
        reject(err);
      },
    });
  });
}
