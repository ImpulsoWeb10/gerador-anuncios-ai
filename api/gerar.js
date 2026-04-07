export default async function handler(req, res) {

  // 🔓 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 Preflight (IMPORTANTE)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { produto, descricao, cnpj } = req.body;

    const prompt = `
Crie um anúncio completo com SEO:

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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-flash:generateContent?key=" + process.env.API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🔍 DEBUG (MOSTRA ERRO REAL)
    console.log("RESPOSTA DA API:", JSON.stringify(data, null, 2));

    if (!data.candidates) {
      return res.status(200).json({
        text: "❌ Erro da API:\n" + JSON.stringify(data, null, 2)
      });
    }

    const text = data.candidates[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      text: text || "⚠️ Resposta vazia da IA"
    });

  } catch (error) {
    console.error("ERRO:", error);

    return res.status(500).json({
      text: "❌ Erro no servidor"
    });
  }
}
