/**
 * CryptoWatch 
 * 
 * o script gerencia a interface do usuário e a comunicação com o backend
 * para carregar dados de criptomoedas, agora com a exibição do status de estabilidade.
 * 
 * Funcionalidades:
 * - carregamento e filtragem de moedas (crypto e memecoins).
 * - exibição do status de estabilidade.
 */
let tipoAtual = "crypto";

/**
 * Carrega os dados das moedas do backend e renderiza no frontend.
 * @param {string} tipo - O tipo de moeda a ser exibido ('crypto' ou 'memecoins').
 */
async function carregarMoedas(tipo) {
  tipoAtual = tipo;
  const container = document.getElementById("coins");
  container.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch("/api/coins");
    const coins = await res.json();

    // filtra as moedas com base no tipo (memecoins vs. outras)
    const filtradas = coins.filter((c) =>
      tipo === "memecoins"
        ? ["DOGE", "SHIB", "PEPE", "FLOKI"].includes(c.symbol)
        : !["DOGE", "SHIB", "PEPE", "FLOKI"].includes(c.symbol)
    );

    container.innerHTML = filtradas
      .map(
        (c) => `
        <div class="card">
          <h3>${c.name} (${c.symbol})</h3>
          <p>💰 ${c.quote.USD.price.toFixed(2)} USD</p>
          <p class="${
            c.quote.USD.percent_change_24h >= 0 ? "up" : "down"
          }">${c.quote.USD.percent_change_24h.toFixed(2)}% (24h)</p>
          <p class="${
            c.stability_status === "Estável" ? "stability-stable" : "stability-unstable"
          }">Estabilidade: ${c.stability_status}</p>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Erro ao carregar moedas:", err);
    container.innerHTML = "<p>Erro ao carregar moedas. Verifique se o servidor está rodando e se a chave de API está configurada.</p>";
  }
}

// event listeners para as abas
document.getElementById("tab-crypto").onclick = () => carregarMoedas("crypto");
document.getElementById("tab-meme").onclick = () => carregarMoedas("memecoins");

// carrega as moedas qnd iniciar e configura o intervalo de atualização
carregarMoedas("crypto");
setInterval(() => carregarMoedas(tipoAtual), 60000);
