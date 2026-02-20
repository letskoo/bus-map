import './style.css'

console.log("MAIN JS 실행됨")

// 🔥 화면 높이 강제
document.body.style.margin="0"
document.body.style.padding="0"
document.body.style.height="100vh"
document.documentElement.style.height="100vh"

const routeId = 1

document.querySelector('#app').innerHTML = `
<div id="map" style="width:100vw;height:100vh;background:#eee;"></div>
`

// 🔥 카카오 SDK 로드
const script = document.createElement('script')
script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=7760a4557ccbf1f9dd40e051124ba1fc&autoload=false"
script.defer = true
document.head.appendChild(script)

script.onerror = () => {
  console.log("카카오SDK 로드 실패")
}

script.onload = () => {

  if (!window.kakao || !window.kakao.maps) {
    console.log("카카오SDK 실패")
    return
  }

  kakao.maps.load(() => {

    console.log("카카오맵 로드됨")

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

        console.log("버스이동:",lat,lng)

      }catch(e){
        console.log("위치못가져옴")
      }
    }

    fetchBus()
    setInterval(fetchBus,2000)

  })
}