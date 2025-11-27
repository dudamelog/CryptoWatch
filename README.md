## 1. Status do Projeto e Funcionalidades Implementadas

Essa versão do projeto foca apenas na exibição de dados de criptomoedas em tempo real e na nova funcionalidade de cálculo de estabilidade. As funcionalidades de Autenticação, Alertas e persistência de dados foram deixadas de lado pois não foi cumprido o propósito do banco de dados.

## 2. Tecnologias Utilizadas

*   **Frontend:** HTML5, CSS3, Javascript
*   **Backend:** Node.js, Express.js
*   **API de Dados:** CoinMarketCap Pro API (requer chave)

## 3. Configuração e Execução

### Pré-requisitos

*   Node.js e npm instalados.
*   Uma chave de API da CoinMarketCap Pro.

### Passos

1.  **Clonar o Repositório:**
    \`\`\`bash
    git clone https://github.com/Uelo/CryptoWatch.git
    cd CryptoWatch
    \`\`\`

2.  **Instalar Dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo chamado **`.env`** na raiz do diretório e insira sua chave de API da CoinMarketCap Pro:
    \`\`\`
    CMC_API_KEY=SUA_CHAVE_AQUI
    \`\`\`

4.  **Executar o Servidor:**
    \`\`\`bash
    node server.js
    \`\`\`
    O servidor será iniciado na porta 3000.

## 4. Estrutura do Código

*   **`server.js`**: Contém a lógica de backend, incluindo a chamada à API e o cálculo de estabilidade.
*   **`public/index.html`**: Estrutura básica do frontend.
*   **`public/script.js`**: Lógica frontend para carregar e exibir os dados das moedas, incluindo o status de estabilidade.
