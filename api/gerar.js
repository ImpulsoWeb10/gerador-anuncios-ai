export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { produto, descricao, cnpj } = req.body;

  const prompt = `
Você é especialista em SEO e e-commerce.

Produto: ${produto}
Descrição: ${descricao}
CNPJ: ${cnpj}

Gere:
- Título otimizado
- Descrição curta
- Descrição completa
- SKU
- EAN válido
- Palavras-chave
- Tags
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro ao gerar";

    return res.status(200).json({ text });

  } catch (error) {
    return res.status(500).json({ error: "Erro no servidor" });
  }
}
