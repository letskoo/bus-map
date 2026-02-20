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
      level: 3,
    }

    const map = new kakao.maps.Map(container, options)

    const marker = new kakao.maps.Marker({
      position: options.center,
      map,
    })

    async function fetchBus() {
      try {
        const res = await fetch(`bus-server-production.up.railway.app/driver/location/${routeId}`)
        const data = await res.json()

        if (!data) return

        const pos = new kakao.maps.LatLng(data.latitude, data.longitude)
        marker.setPosition(pos)
        map.setCenter(pos)

      } catch (e) {
        console.log('fetch error')
      }
    }

    fetchBus()
    setInterval(fetchBus, 2000)

  })
}