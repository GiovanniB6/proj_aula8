// Formulário de cadastro: lê os campos e envia POST /transacoes
// no formato do Schema da Aula 7:
// { descricao, valor, tipo, categoria, consumoConsciente }

const form = document.getElementById('formTransacao');
const grupoConsumo = document.getElementById('grupoConsumo');
const elMensagem = document.getElementById('mensagem');
const btnSalvar = document.getElementById('btnSalvar');

// "Consciente x Impulso" só faz sentido para despesas: esconde quando for receita.
function atualizarGrupoConsumo() {
  const tipo = form.querySelector('input[name="tipo"]:checked').value;
  grupoConsumo.hidden = tipo === 'receita';
}
form.querySelectorAll('input[name="tipo"]').forEach((radio) => {
  radio.addEventListener('change', atualizarGrupoConsumo);
});
atualizarGrupoConsumo();

function mostrarMensagem(texto, tipo) {
  elMensagem.textContent = texto;
  elMensagem.className = 'status status--' + tipo;
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const tipo = form.querySelector('input[name="tipo"]:checked').value;
  const consciente = form.querySelector('input[name="consumoConsciente"]:checked').value;

  const transacao = {
    descricao: form.descricao.value.trim(),
    valor: Number(form.valor.value),
    tipo: tipo, // 'receita' ou 'despesa'
    categoria: form.categoria.value,
    // Receita não é gasto, então conta como consciente (não entra no total por impulso)
    consumoConsciente: tipo === 'receita' ? true : consciente === 'true',
  };

  if (!transacao.descricao || !(transacao.valor > 0) || !transacao.categoria) {
    mostrarMensagem('Preencha a descrição, um valor maior que zero e a categoria.', 'erro');
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando…';

  try {
    const resposta = await fetch(API_TRANSACOES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transacao),
    });

    if (!resposta.ok) throw new Error('A API respondeu com status ' + resposta.status);

    mostrarMensagem('Transação salva! Voltando para o início…', 'sucesso');
    form.reset();
    atualizarGrupoConsumo();
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Não foi possível salvar. Verifique se a API está rodando. (' + erro.message + ')', 'erro');
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar transação';
  }
});
