import './style.css'

console.log("MAIN JS 실행됨")

// 🔥 Vercel 기본 가운데정렬 강제 해제
document.body.style.margin = "0"
document.body.style.padding = "0"
document.body.style.display = "block"
document.body.style.height = "100vh"
document.documentElement.style.height = "100vh"

// 🔥 전체화면 강제
document.querySelector('#app').style.width="100vw"
document.querySelector('#app').style.height="100vh"

const routeId = 1

document.querySelector('#app').innerHTML = `
<div id="map" style="width:100vw;height:100vh;"></div>
`

// 카카오 SDK
const script = document.createElement('script')
script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=7760a4557ccbf1f9dd40e051124ba1fc&autoload=false"
document.head.appendChild(script)

script.onload = () => {
  kakao.maps.load(() => {

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
        if(!data?.latitude) return

        const pos = new kakao.maps.LatLng(Number(data.latitude),Number(data.longitude))
        marker.setPosition(pos)
        map.panTo(pos)

      }catch(e){}
    }

    fetchBus()
    setInterval(fetchBus,2000)
  })
}