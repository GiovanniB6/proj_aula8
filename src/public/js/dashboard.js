// Dashboard de Saúde Financeira
// Faz GET /transacoes e apenas EXIBE o que a API devolve:
// { historico: [...], metricas: { saldoTotal, totalDespesas, totalGastoImpulso } }
// Nenhum cálculo é feito aqui — tudo vem pronto do back-end.

const elStatus = document.getElementById('status');
const elSaldo = document.getElementById('saldoTotal');
const elDespesas = document.getElementById('totalDespesas');
const elImpulso = document.getElementById('totalGastoImpulso');
const elLista = document.getElementById('listaHistorico');

async function carregarDashboard() {
  elStatus.textContent = 'Carregando dados…';
  elStatus.className = 'status';

  try {
    const resposta = await fetch(API_TRANSACOES, { method: 'GET' });
    if (!resposta.ok) throw new Error('A API respondeu com status ' + resposta.status);

    const dados = await resposta.json();

    exibirMetricas(dados.metricas);
    exibirHistorico(dados.historico);

    elStatus.textContent = '';
    elStatus.className = 'status status--oculto';
  } catch (erro) {
    console.error(erro);
    elStatus.textContent = 'Não foi possível carregar os dados. Verifique se a API está rodando em ' +
      (API_BASE || window.location.origin) + '.';
    elStatus.className = 'status status--erro';
  }
}

// Painel de Métricas: lê o objeto "metricas" do JSON
function exibirMetricas(metricas) {
  elSaldo.textContent = formatarMoeda(metricas.saldoTotal);
  elDespesas.textContent = formatarMoeda(metricas.totalDespesas);
  elImpulso.textContent = formatarMoeda(metricas.totalGastoImpulso);

  // Só troca a cor do saldo conforme o sinal do valor recebido.
  elSaldo.classList.toggle('valor--negativo', metricas.saldoTotal < 0);
}

// Extrato: percorre o array "historico" do JSON
function exibirHistorico(historico) {
  elLista.innerHTML = '';

  if (!historico || historico.length === 0) {
    const vazio = document.createElement('li');
    vazio.className = 'lista__vazia';
    vazio.textContent = 'Nenhum lançamento ainda. Toque em "Nova transação" para começar.';
    elLista.appendChild(vazio);
    return;
  }

  historico.forEach((transacao) => {
    elLista.appendChild(criarItem(transacao));
  });
}

function criarItem(transacao) {
  const ehReceita = transacao.tipo === 'receita';

  const li = document.createElement('li');
  li.className = 'lancamento';

  const info = document.createElement('div');
  info.className = 'lancamento__info';

  // textContent (e não innerHTML) evita que um texto digitado vire código na página
  const descricao = document.createElement('p');
  descricao.className = 'lancamento__descricao';
  descricao.textContent = transacao.descricao;

  const detalhe = document.createElement('p');
  detalhe.className = 'lancamento__detalhe';
  detalhe.textContent = transacao.categoria;
  if (transacao.createdAt) {
    detalhe.textContent += ' · ' + new Date(transacao.createdAt).toLocaleDateString('pt-BR');
  }

  info.append(descricao, detalhe);

  // Selo Essencial / Impulso só para despesas (campo consumoConsciente)
  if (!ehReceita) {
    const selo = document.createElement('span');
    if (transacao.consumoConsciente) {
      selo.className = 'selo selo--essencial';
      selo.textContent = 'Essencial';
    } else {
      selo.className = 'selo selo--impulso';
      selo.textContent = 'Impulso';
    }
    info.appendChild(selo);
  }

  const valor = document.createElement('p');
  valor.className = 'lancamento__valor ' + (ehReceita ? 'valor--positivo' : 'valor--negativo');
  valor.textContent = (ehReceita ? '+ ' : '− ') + formatarMoeda(transacao.valor);

  li.append(info, valor);
  return li;
}

document.getElementById('btnAtualizar').addEventListener('click', carregarDashboard);
carregarDashboard();
