let currentLat = null
let currentLng = null

function smoothMove(newLat, newLng){
  if(currentLat === null){
    currentLat = newLat
    currentLng = newLng
    return
  }

  const steps = 20
  let count = 0

  const dLat = (newLat - currentLat)/steps
  const dLng = (newLng - currentLng)/steps

  const interval = setInterval(()=>{
    currentLat += dLat
    currentLng += dLng

    const movePos = new kakao.maps.LatLng(currentLat,currentLng)
    marker.setPosition(movePos)
    map.panTo(movePos)

    count++
    if(count>=steps){
      clearInterval(interval)
      currentLat = newLat
      currentLng = newLng
    }
  },50)
}

async function fetchBus(){
  try{
    const res = await fetch(`/api/location?routeId=${routeId}&t=${Date.now()}`)
    const data = await res.json()
    if(!data?.latitude) return

    const lat = Number(data.latitude)
    const lng = Number(data.longitude)

    smoothMove(lat,lng)

  }catch(e){}
}