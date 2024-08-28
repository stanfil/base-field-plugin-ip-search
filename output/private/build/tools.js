"use strict";
// https://ip-api.com/docs/api:json
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipSearch = ipSearch;
function isValidIPv4(ip) {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    return ipv4Pattern.test(ip);
}
function isValidIPv6(ip) {
    const ipv6Pattern = /^((?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,7}:|(?:[A-Fa-f0-9]{1,4}:){1,6}:[A-Fa-f0-9]{1,4}|(?:[A-Fa-f0-9]{1,4}:){1,5}(?::[A-Fa-f0-9]{1,4}){1,2}|(?:[A-Fa-f0-9]{1,4}:){1,4}(?::[A-Fa-f0-9]{1,4}){1,3}|(?:[A-Fa-f0-9]{1,4}:){1,3}(?::[A-Fa-f0-9]{1,4}){1,4}|(?:[A-Fa-f0-9]{1,4}:){1,2}(?::[A-Fa-f0-9]{1,4}){1,5}|(?:[A-Fa-f0-9]{1,4}:){1}(?::[A-Fa-f0-9]{1,4}){1,6}|(?:::(?:[A-Fa-f0-9]{1,4}:){1,7}[A-Fa-f0-9]{1,4}|::))$/i;
    return ipv6Pattern.test(ip);
}
function checkIP(ip) {
    return isValidIPv4(ip) || isValidIPv6(ip);
}
const ispMappings = [
    { pattern: /Chinanet/i, name: '中国电信' },
    { pattern: /China Mobile/i, name: '中国移动' },
    { pattern: /China Unicom/i, name: '中国联通' },
    { pattern: /China TieTong/i, name: '中国铁通' },
    { pattern: /China Education/i, name: '中国教育网' },
];
function translateISP(isp) {
    for (const mapping of ispMappings) {
        if (mapping.pattern.test(isp)) {
            return mapping.name;
        }
    }
    return isp; // 如果没有匹配到，返回原始字符串
}
async function ipSearch(ip, fetch) {
    const isIP = checkIP(ip);
    if (!isIP)
        return null;
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
        });
        if (!response.ok) {
            throw new Error(JSON.stringify(response));
        }
        const data = await response.json();
        if (data?.isp) {
            data.isp = translateISP(data.isp);
        }
        return data;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFtQzs7QUF5RG5DLDRCQTBDQztBQWpHRCxTQUFTLFdBQVcsQ0FBQyxFQUFVO0lBQzdCLE1BQU0sV0FBVyxHQUFHLGlHQUFpRyxDQUFDO0lBQ3RILE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsRUFBVTtJQUM3QixNQUFNLFdBQVcsR0FBRyxrYkFBa2IsQ0FBQztJQUN2YyxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLEVBQVU7SUFDekIsT0FBTyxXQUFXLENBQUMsRUFBRSxDQUFDLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQzNDLENBQUM7QUEwQkQsTUFBTSxXQUFXLEdBQWlCO0lBQ2hDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0lBQ3RDLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0lBQzFDLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0lBQzFDLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7SUFDM0MsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtDQUMvQyxDQUFDO0FBRUYsU0FBUyxZQUFZLENBQUMsR0FBVztJQUMvQixLQUFLLE1BQU0sT0FBTyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUM5QixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQjtBQUNoQyxDQUFDO0FBRU0sS0FBSyxVQUFVLFFBQVEsQ0FBQyxFQUFVLEVBQUUsS0FBVTtJQUVuRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFekIsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUV2QixJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxhQUFhLEVBQUU7WUFDNUUsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsaUJBQWlCLEVBQUUsZ0JBQWdCO2dCQUNuQyxZQUFZLEVBQUUsWUFBWTtnQkFDMUIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsU0FBUyxFQUFFLHFCQUFxQjtnQkFDaEMsZ0JBQWdCLEVBQUUsT0FBTztnQkFDekIsZ0JBQWdCLEVBQUUsTUFBTTtnQkFDeEIsZ0JBQWdCLEVBQUUsV0FBVztnQkFDN0IsWUFBWSxFQUFFLHVIQUF1SDtnQkFDckksV0FBVyxFQUFFLDBDQUEwQztnQkFDdkQsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsb0JBQW9CLEVBQUUsU0FBUzthQUNoQztTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBYSxDQUFDO1FBRTlDLElBQUksSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ25DLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUVkLENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztBQUNILENBQUMifQ==