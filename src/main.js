import './style.css'

console.log("MAIN JS 실행됨")

const routeId = 1

document.querySelector('#app').innerHTML = `
<div id="map" style="width:100%;height:100vh;"></div>
`

// 🔥 카카오 SDK 강제 로드
const script = document.createElement('script')
script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=7760a4557ccbf1f9dd40e051124ba1fc&autoload=false"
document.head.appendChild(script)

script.onload = () => {

  if (!window.kakao) {
    console.log("카카오SDK 실패")
    return
  }

  kakao.maps.load(() => {

    console.log("카카오맵 로드됨")

    const container = document.getElementById('map')

    const options = {
      center: new kakao.maps.LatLng(36.3550,127.3880),
      level: 3,
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

      }catch(e){
        console.log("위치못가져옴")
      }
    }

    fetchBus()
    setInterval(fetchBus,2000)

  })
}