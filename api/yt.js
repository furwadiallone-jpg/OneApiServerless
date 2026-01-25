const axios = require('axios')
const cheerio = require('cheerio')
async function yta(url) {
try{
  const res = await axios.post('https://api.vidssave.com/api/contentsite_api/media/parse',
    new URLSearchParams({
      auth: '20250901majwlqo',
      domain: 'api-ak.vidssave.com',
      origin: 'source',
      link: url
    }).toString(),
    {
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://vidssave.com',
        referer: 'https://vidssave.com/'
      }
    }
  )
  if (res.status === 200) {
  const { title, thumbnail, duration, resources } = res.data.data
  if(resources.length === 0)return {
        status: false,
        message: "Failed to fetch data"
      }
  let audio = resources.filter(v => v.type === 'audio' && v.quality === '128KBPS')[0]?.download_url
  let video = resources.filter(v => v.type === 'video' && (v.quality === '360P'||v.quality === '480P'))[0]?.download_url
  return {status:true,data:{
    title,
    thumbnail,
    duration,
    link: { audio:audio, video:video}
  }}
  }else {
      return {
        status: false,
        message: "Failed to fetch data"
      }
    }
}catch (err) {
    return {
      status: false,
      message: err.message || err.toString()
    }
  }
}

async function ytb(url) {
  const headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Cookie": "_gcl_au=1.1.33156021.1769143387; _ga=GA1.1.185609915.1769143393; _fbp=fb.1.1769143448528.455671939159124611; _tt_enable_cookie=1; _ttp=01KFMJNDSZT2X5JX933254P05X_.tt.1; _ga_JWHZ1GHQ0S=GS2.1.s1769143392$o1$g1$t1769143829$j52$l0$h260965826; ttcsid=1769143449412::KRTtvh9VW4MIDOl_Q_BH.1.1769143851278.0; ttcsid_CU96RHBC77UBVOTKOTN0=1769143449411::lnMyDaFI3ng_fUetyL0x.1.1769143851278.1; XSRF-TOKEN=eyJpdiI6ImdtZ2RXQ3NMN21XcjNHVGtKR3ZJRFE9PSIsInZhbHVlIjoiNy9zbGZIWnZEWUlDc3NtV2ZJMDlaTndOR25PVTMwaVJGSGMwMlFBd2VrL2EybGt0Z1ZQbC83MXRaUEtaUmpCZzlZQllaMWNVY1hkYk1pbFhLQjZpQSt6bFFQMCtzRHZ4WlZaZXlMelNzM2RYWXExeHppR2V2YmNUSG85RU1OeDUiLCJtYWMiOiI0NDM0M2NjYTdjNWI1Y2IyNDBiZWVjYzMzMjY5NDZiMjYxZTg0ODQwM2ZkMGFmMjAyMjQ4NDUwNDMwZDczMDdjIiwidGFnIjoiIn0%3D; kolid_session=eyJpdiI6IjhTa2tsZk8vR0hXWDA4ekFYcHoyNVE9PSIsInZhbHVlIjoiSU5yRzJZUjllcU0zZjkwL2w2TlZCQ2tyamRKdldKVFAvWHBuVWxuRXl2THRRRHVJL2Q3ZGNiRUtXK0RTM09zeHUyWjdrbVlDb0VWT09zMHB5RGQ0SHlnQlljN1YyVHNaZXBFRUNzY3MxUXM4UVZCbkxyU0tKdzN3UkZTTjVZamoiLCJtYWMiOiJiOTIyMGYyZjFmNmJkN2NhMzNmY2QxMTU5MmZmZTYwNGNmMjdhMmVmMDg2YjMxZjY1MDcwNTQ1Y2ZmMjg1ZjM0IiwidGFnIjoiIn0%3D",
    "Origin": "https://kol.id",
    "Referer": "https://kol.id/download-video/youtube",
    "Sec-CH-UA": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": "\"Windows\"",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
  };
  const datasend = {
    url: url,
    _token: "xfQCCFKTepoJq107SKUGU3FJt9vBj9OTEDiiDiMi"
  };
  const params = new URLSearchParams(datasend);
  try {
    let data = await axios.post('https://kol.id/download-video/youtube', params.toString(), {
      headers
    })
    if (data.status === 200) {
      let $ = cheerio.load(data.data.html)
      let title = $('.small-title > h2').text().trim()
      let thumbnail = $('.video-popup-frame > img').attr('src')
      let subcriber = $('.subscriber-info').text().trim()
      let channel = $('.channel-info').text().trim().split('Channel: ')[1].split(subcriber)[0].trim()
      let duration = $('.time-details').text().trim().split('Duration: ')[1]
      let link = []
      $('.dropdown-menu > li').each((i, el) => {
        let download_url = $(el).find('a').attr('href')
        let desc = $(el).find('a').text().trim()
        link.push({
          download_url,
          desc
        })
      })
      let metadata = {
        title,
        thumbnail,
        channel,
        subcriber,
        duration,
        link: {
          audio: link[2].download_url,
          video: link[1].download_url
        }
      }
      return {
        status: true,
        data: metadata
      }
    } else {
      return {
        status: false,
        message: "Failed to fetch data"
      }
    }
  } catch (err) {
    return {
      status: false,
      message: err.message || err.toString()
    }
  }
}

async function yt(url){
let res = yta(url)
//if(res.status) return res
//let res2 = ytb(url)
return res
}

module.exports = yt;
