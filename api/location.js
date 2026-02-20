export default async function handler(req, res) {
  const { routeId } = req.query;

  const r = await fetch(`https://bus-server-production.up.railway.app/driver/location/${routeId}`);
  const data = await r.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}