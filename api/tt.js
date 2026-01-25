const axios = require('axios');
const tt = async (url,baseUrl) => {
try{
const headers = {
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Cookie': 'current_language=en; _ga=GA1.1.1700935381.1728570987; _gcl_au=1.1.1351099834.1728570987; _ga_5370HT04Z3=GS1.1.1728570986.1.1.1728571266.0.0.0',
  'Origin': 'https://www.tikwm.com',
  'Referer': 'https://www.tikwm.com/',
  'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
  'Sec-Ch-Ua-Mobile': '?1',
  'Sec-Ch-Ua-Platform': '"Android"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'
};
const formData = new URLSearchParams();
formData.append('url',`${url}`);
formData.append('count','12');
formData.append('cursor','0');
formData.append('web','1');
formData.append('hd','1');
let data = await axios.post('https://www.tikwm.com/api/',formData,{headers:headers})
if(data.status == 200){
if(data.data.msg == '-1') return {status: false, author: "iwan", message: data.data.msg}
let mainUrl = 'https://tikwm.com';
return {
  status: true,
  author: "iwan",
  result : {
      title:data.data.data.title,
      link:{
          video: `${mainUrl}${data.data.data.hdplay}`,
          videohd:`${mainUrl}${data.data.data.hdplay}`,
          videosd:`${mainUrl}${data.data.data.play}`,
          audio:`${mainUrl}${data.data.data.music}`
      },
      linkUnblock:{
          video: `${baseUrl}/buffer/id?data=${encodeURIComponent(`${mainUrl}${data.data.data.hdplay}`)}`,
          videohd:`${baseUrl}/buffer/id?data=${encodeURIComponent(`${mainUrl}${data.data.data.hdplay}`)}`,
          videosd:`${baseUrl}/buffer/id?data=${encodeURIComponent(`${mainUrl}${data.data.data.play}`)}`,
          audio:`${baseUrl}/buffer/id?data=${encodeURIComponent(`${mainUrl}${data.data.data.music}`)}`
      }
  }
}
 }else{
 return {status: false, author: "iwan", message: "Kesalahan Fetching Data"}
}
}catch(e){
return {status: false, author: "iwan", message: "Kesalahan Api Panel"}
}
}
module.exports = tt;
