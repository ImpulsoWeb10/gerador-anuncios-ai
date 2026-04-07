export default async function handler(req, res) {
  const { produto, descricao, cnpj } = req.body;

  const prompt = `
Crie um anúncio SEO:

Produto: ${produto}
Descrição: ${descricao}
CNPJ: ${cnpj}
`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();

  res.status(200).json(data);
}
