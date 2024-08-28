// https://ip-api.com/docs/api:json

function isValidIPv4(ip: string) {
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
  return ipv4Pattern.test(ip);
}

function isValidIPv6(ip: string) {
  const ipv6Pattern = /^((?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,7}:|(?:[A-Fa-f0-9]{1,4}:){1,6}:[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,5}(?::[A-Fa-f0-9]{1,4}){1,2}|(?:[A-Fa-f0-9]{1,4}:){1,4}(?::[A-Fa-f0-9]{1,4}){1,3}|(?:[A-Fa-f0-9]{1,4}:){1,3}(?::[A-Fa-f0-9]{1,4}){1,4}|(?:[A-Fa-f0-9]{1,4}:){1,2}(?::[A-Fa-f0-9]{1,4}){1,5}|(?:[A-Fa-f0-9]{1,4}:){1}(?::[A-Fa-f0-9]{1,4}){1,6}|(?:::(?:[A-Fa-f0-9]{1,4}:){1,7}[A-Fa-f0-9]{1,4}|::))$/i;
  return ipv6Pattern.test(ip);
}

function checkIP(ip: string) {
  return isValidIPv4(ip) || isValidIPv6(ip)
}

type TIpData = {
  "status": "success" | "fail",
  "country": string, // *
  "countryCode": string,
  "region": string,
  "regionName": string, // *
  "city": string, // *
  "zip": string,
  "lat": number,
  "lon": number,
  "timezone": "Asia/Shanghai", // *
  "isp": string,
  "org": string,
  "as": string,
  "query": "113.118.104.11"
}

// isp Chinanet / China Mobile Communications Corporation / China Unicom Henan Province network  / China TieTong Telecommunications Corporation  / China Education and Research Network Center

interface ISPMapping {
  pattern: RegExp;
  name: string;
}

const ispMappings: ISPMapping[] = [
  { pattern: /Chinanet/i, name: '中国电信' },
  { pattern: /China Mobile/i, name: '中国移动' },
  { pattern: /China Unicom/i, name: '中国联通' },
  { pattern: /China TieTong/i, name: '中国铁通' },
  { pattern: /China Education/i, name: '中国教育网' },
];

function translateISP(isp: string): string {
  for (const mapping of ispMappings) {
    if (mapping.pattern.test(isp)) {
      return mapping.name;
    }
  }
  return isp; // 如果没有匹配到，返回原始字符串
}

export async function ipSearch(ip: string, fetch: any) {

  const isIP = checkIP(ip);

  if (!isIP) return null;

  try {
    const response = await fetch(`https://demo.ip-api.com/json/${ip}?lang=zh-CN`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Origin': 'https://ip-api.com',
        'Referer': 'https://ip-api.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    })

    if (!response.ok) {
      throw new Error(JSON.stringify(response));
    }

    const data = await response.json() as TIpData;

    if (data?.isp) {
      data.isp = translateISP(data.isp)
    }

    return data;

  } catch (e) {
    console.log(e)
    return null
  }
}
