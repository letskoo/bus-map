import './style.css'

const routeId = 1
const KAKAO_KEY = '7760a4557ccbf1f9dd40e051124ba1fc'

// 화면
document.querySelector('#app').innerHTML = `<div id="map"></div>`

// 카카오 SDK 로드
const script = document.createElement('script')
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`
script.async = true
script.defer = true
document.head.appendChild(script)

script.onerror = () => {
  console.log('카카오 SDK 로드 실패 (도메인/키 확인)')
}

script.onload = () => {
  if (!window.kakao || !window.kakao.maps) {
    console.log('카카오 SDK 객체 없음')
    return
  }

  kakao.maps.load(() => {
    const container = document.getElementById('map')
    const options = {
      center: new kakao.maps.LatLng(36.3550, 127.3880),
      level: 5,
    }

    const map = new kakao.maps.Map(container, options)
    const marker = new kakao.maps.Marker({ position: options.center })
    marker.setMap(map)

    // 부드러운 이동
    let currentLat = null
    let currentLng = null
    let animTimer = null

    function smoothMove(newLat, newLng) {
      if (currentLat === null) {
        currentLat = newLat
        currentLng = newLng
        const pos = new kakao.maps.LatLng(currentLat, currentLng)
        marker.setPosition(pos)
        map.panTo(pos)
        return
      }

      if (animTimer) clearInterval(animTimer)

      const steps = 15
      let count = 0
      const startLat = currentLat
      const startLng = currentLng
      const dLat = (newLat - startLat) / steps
      const dLng = (newLng - startLng) / steps

      animTimer = setInterval(() => {
        currentLat += dLat
        currentLng += dLng

        const pos = new kakao.maps.LatLng(currentLat, currentLng)
        marker.setPosition(pos)
        map.panTo(pos)

        count++
        if (count >= steps) {
          clearInterval(animTimer)
          animTimer = null
          currentLat = newLat
          currentLng = newLng
        }
      }, 80)
    }

    async function fetchBus() {
      try {
        const res = await fetch(`/api/location?routeId=${routeId}&t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        if (!data?.latitude) return

        const lat = Number(data.latitude)
        const lng = Number(data.longitude)
        if (Number.isNaN(lat) || Number.isNaN(lng)) return

        smoothMove(lat, lng)
      } catch (e) {
        // 조용히
      }
    }

    fetchBus()
    setInterval(fetchBus, 2000)
  })
}