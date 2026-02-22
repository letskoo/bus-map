import './style.css'

document.querySelector('#app').innerHTML = `
<div style="padding:20px;font-size:22px;font-weight:bold">
기사 GPS 송신 페이지
</div>

<button id="start" style="font-size:20px;padding:15px;margin:20px">
운행 시작 (GPS 전송)
</button>

<div id="status" style="padding:20px;font-size:18px;color:green">
대기중
</div>
`

const SERVER="https://bus-server-production.up.railway.app"
const ROUTE_ID=1

let watchId=null

document.getElementById("start").onclick=()=>{

  if(!navigator.geolocation){
    alert("GPS 안됨")
    return
  }

  document.getElementById("status").innerText="GPS 전송 시작됨"

  watchId=navigator.geolocation.watchPosition(async(pos)=>{

    const lat=pos.coords.latitude
    const lng=pos.coords.longitude

    document.getElementById("status").innerText=
    `전송중: ${lat.toFixed(5)}, ${lng.toFixed(5)}`

    await fetch(SERVER+"/driver/location",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
        routeId:ROUTE_ID,
        lat,
        lng
      })
    })

  },{
    enableHighAccuracy:true,
    maximumAge:0,
    timeout:5000
  })
}