/**
 * Backend
 * 
 * utilizei Express.js para servir a API e dados estáticos.
 * 
 * funcionalidades novas:
 * 1. cálculo de estabilidade de moedas (requisito: mostrar a estabilidade)
 * 2. consumo da API CoinMarketCap (CMC) com cache.
 * 
 * Node.js, Express, Axios, Node-Cache.
 */
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

const app = express();
const cache = new NodeCache({ stdTTL: 300 });
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

// LÓGICA DE ESTABILIDADE

// função para calcular a estabilidade (REQUISITO: Mostrar a Estabilidade)
// estabilidade é inversamente proporcional à soma das variações absolutas.
// quanto maior o valor retornado, mais estável a moeda é considerada.
const calculateStability = (percent_change_24h, percent_change_7d) => {
  // usamos um pequeno offset (0.01) para evitar divisão por zero e para que
  // moedas com variação zero tenham uma pontuação alta, mas finita.
  const totalVolatility = Math.abs(percent_change_24h) + Math.abs(percent_change_7d);
  return 1 / (totalVolatility + 0.01);
};

// 
// rotas de dados da API
// 

const API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
const API_KEY = process.env.CMC_API_KEY;

// a CoinMarketCap API é usada aqui.
// a chave de API deve ser configurada no arquivo .env.
// o endpoint 'listings/latest' fornece dados em tempo real e variação de 24h e 7d.

app.get("/api/coins", async (req, res) => {
  const cached = cache.get("coins");
  if (cached) {
    console.log("Servindo do cache");
    return res.json(cached);
  }

  try {
    const response = await axios.get(API_URL, {
      headers: { "X-CMC_PRO_API_KEY": API_KEY },
      params: { start: 1, limit: 50, convert: "USD" },
    });

    let data = response.data.data;

    // aplicar a lógica de estabilidade a cada moeda
    data = data.map(coin => {
      const quote = coin.quote.USD;
      const stabilityScore = calculateStability(
        quote.percent_change_24h,
        quote.percent_change_7d // o endpoint 'listings/latest' já fornece esta variação 
      );
      
      // adiciona a pontuação de estabilidade e o status ao objeto da moeda
      return {
        ...coin,
        stability_score: stabilityScore,
        stability_status: stabilityScore > 0.1 ? "Estável" : "Instável" // classificação de estabilidade
      };
    });

    // atualizar o cache com os dados processados
    cache.set("coins", data);
    console.log("Cache atualizado");
    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar dados do CoinMarketCap:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados do CoinMarketCap" });
  }
});

// inicia o servidor Express
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
