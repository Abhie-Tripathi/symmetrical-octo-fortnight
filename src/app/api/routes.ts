export default async function handler(req, res) {
  const { input } = req.query;
  const apiKey = "AIzaSyB2l3cMq_y6soADmXiDH8JfNBd4xIzh3Ro";
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching places" });
  }
}
