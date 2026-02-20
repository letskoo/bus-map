console.log("MAIN JS 실행됨");
import './style.css'

const routeId = 1

document.querySelector('#app').innerHTML = `
<div id="map" style="width:100%;height:100vh;"></div>
`

const script = document.createElement('script')
script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7760a4557ccbf1f9dd40e051124ba1fc&autoload=false"
document.head.appendChild(script)

script.onload = () => {
  kakao.maps.load(() => {

    const container = document.getElementById('map')
    const options = {
      center: new kakao.maps.LatLng(36.3550, 127.3880),
      level: 7, // 🔥 확대레벨 높임 (움직임 눈에 보이게)
    }

    const map = new kakao.maps.Map(container, options)

    const marker = new kakao.maps.Marker({
      position: options.center,
      map,
    })

    async function fetchBus() {
      try {
        const res = await fetch(`/api/location?routeId=${routeId}&t=${Date.now()}`)
        const data = await res.json()

        if (!data?.latitude) return

        const pos = new kakao.maps.LatLng(Number(data.latitude), Number(data.longitude))

        marker.setPosition(pos)

        // 🔥 부드럽게 이동 (핵심)
        map.panTo(pos)

      } catch (e) {
        console.log('위치못가져옴')
      }
    }

    fetchBus()
    setInterval(fetchBus, 2000)

  })
}