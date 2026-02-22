import './style.css'

const TOKEN = "test2030_1"   // ★ 현재 사용 토큰
const SERVER = "https://bus-server-production.up.railway.app"
const KAKAO_KEY = "7760a4557ccbf1f9dd40e051124ba1fc"

document.querySelector('#app').innerHTML = `<div id="map"></div>`

const script = document.createElement('script')
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`
script.async = true
script.defer = true
document.head.appendChild(script)

script.onload = () => {

  kakao.maps.load(() => {

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
        const res = await fetch(`${SERVER}/share/${TOKEN}?t=`+Date.now())
        const data = await res.json()

        if(!data?.location) return

        const lat = Number(data.location.latitude)
        const lng = Number(data.location.longitude)

        if(!lat) return

        const pos = new kakao.maps.LatLng(lat,lng)

        marker.setPosition(pos)

        if(first){
          map.setCenter(pos)
          first=false
        }else{
          map.panTo(pos)
        }

      }catch(e){}
    }

    fetchBus()
    setInterval(fetchBus,2000)

  })
}