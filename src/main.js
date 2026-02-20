import './style.css'

console.log("MAIN JS 실행됨")

const routeId = 1

// 🔥 강제 전체화면 세팅 (Vite 기본 CSS 완전 제거)
document.documentElement.style.margin="0"
document.documentElement.style.padding="0"
document.documentElement.style.height="100%"
document.documentElement.style.width="100%"

document.body.style.margin="0"
document.body.style.padding="0"
document.body.style.display="block"
document.body.style.height="100%"
document.body.style.width="100%"

const app = document.querySelector('#app')
app.style.margin="0"
app.style.padding="0"
app.style.width="100vw"
app.style.height="100vh"

// 🔥 지도 영역 생성
app.innerHTML = `
<div id="map"></div>
`

// 🔥 카카오 SDK 로드
const script = document.createElement('script')
script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=7760a4557ccbf1f9dd40e051124ba1fc&autoload=false"
document.head.appendChild(script)

script.onload = () => {

  if(!window.kakao){
    console.log("카카오 SDK 로드 실패")
    return
  }

  kakao.maps.load(()=>{

    console.log("카카오맵 로드 완료")

    const container = document.getElementById('map')

    const options = {
      center: new kakao.maps.LatLng(36.3550,127.3880),
      level: 5,
    }

    const map = new kakao.maps.Map(container, options)

    const marker = new kakao.maps.Marker({
      position: options.center,
      map,
    })

    async function fetchBus(){
      try{
        const res = await fetch(`/api/location?routeId=${routeId}&t=${Date.now()}`)
        const data = await res.json()

        if(!data || !data.latitude) return

        const lat = Number(data.latitude)
        const lng = Number(data.longitude)

        if(isNaN(lat) || isNaN(lng)) return

        const pos = new kakao.maps.LatLng(lat,lng)

        marker.setPosition(pos)
        map.panTo(pos)

        console.log("버스:",lat,lng)

      }catch(e){
        console.log("위치못가져옴")
      }
    }

    fetchBus()
    setInterval(fetchBus,2000)

  })
}