// =====================================================================
// Configuração compartilhada entre as páginas
// =====================================================================

// Se a página foi aberta pelo próprio NestJS (http://localhost:3000),
// usa o mesmo endereço. Se foi aberta pelo Live Server (porta 5500),
// aponta para a API do NestJS na porta 3000.
const API_BASE = window.location.port === '3000' ? '' : 'http://localhost:3000';
const API_TRANSACOES = API_BASE + '/transacoes';

// Formata número como moeda brasileira (só formatação de exibição, não é cálculo).
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
