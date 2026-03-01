import './style.css'

console.log("🔥 MAIN JS LOADED")

const TOKEN = "6mU5SKcGtuXAimx2u2kiosWH"
const SERVER = "https://bus-server-production.up.railway.app"
const KAKAO_KEY = "7760a4557ccbf1f9dd40e051124ba1fc"

const app = document.querySelector('#app')

if(!app){
  console.log("❌ #app 없음")
}else{
  console.log("✅ #app 찾음")
}

app.innerHTML = `<div id="map" style="width:100vw;height:100vh;background:#eee;"></div>`

console.log("🧭 카카오맵 스크립트 로딩 시작")

const script = document.createElement('script')
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`
script.async = true
script.defer = true
document.head.appendChild(script)

script.onerror = () => {
  console.log("❌ 카카오 스크립트 로드 실패")
}

script.onload = () => {
  console.log("✅ 카카오 SDK 로드됨")

  if(!window.kakao){
    console.log("❌ kakao 객체 없음")
    return
  }

  kakao.maps.load(() => {

    console.log("🗺 지도 생성 시작")

    const container = document.getElementById('map')

    const options = {
      center: new kakao.maps.LatLng(36.3550,127.3880),
      level: 4,
    }

    const map = new kakao.maps.Map(container, options)
    const marker = new kakao.maps.Marker({ position: options.center })
    marker.setMap(map)

    let first = true

    async function fetchBus(){
      try{
        const url = `${SERVER}/share/${TOKEN}?t=`+Date.now()
        console.log("📡 fetch:", url)

        const res = await fetch(url)
        const data = await res.json()

        console.log("📦 서버데이터:", data)

        if(!data || !data.location){
          console.log("❌ location 없음")
          return
        }

        const lat = Number(data.location.latitude)
        const lng = Number(data.location.longitude)

        if(!lat || !lng){
          console.log("❌ 좌표 없음")
          return
        }

        const pos = new kakao.maps.LatLng(lat,lng)
        marker.setPosition(pos)

        if(first){
          map.setCenter(pos)
          first=false
        }else{
          map.panTo(pos)
        }

        console.log("🟢 지도 업데이트:", lat, lng)

      }catch(e){
        console.log("❌ fetch 에러", e)
      }
    }

    fetchBus()
    setInterval(fetchBus,2000)

  })
}