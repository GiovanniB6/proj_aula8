import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransacoesService } from './transacoes.service';
import { Transacao } from './schemas/transacao.schema';
import { criarModelFalso } from '../../test/model-falso';

describe('TransacoesService', () => {
  async function criarService(dados: any[]) {
    const { ModelFalso } = criarModelFalso(dados);
    const modulo = await Test.createTestingModule({
      providers: [
        TransacoesService,
        { provide: getModelToken(Transacao.name), useValue: ModelFalso },
      ],
    }).compile();
    return modulo.get(TransacoesService);
  }

  it('calcula saldoTotal, totalDespesas e totalGastoImpulso', async () => {
    const service = await criarService([
      { descricao: 'Salário', valor: 3000, tipo: 'receita', categoria: 'Salário', consumoConsciente: true, createdAt: 1 },
      { descricao: 'Aluguel', valor: 1200, tipo: 'despesa', categoria: 'Moradia', consumoConsciente: true, createdAt: 2 },
      { descricao: 'Roupa', valor: 250.1, tipo: 'despesa', categoria: 'Compras', consumoConsciente: false, createdAt: 3 },
      { descricao: 'Delivery', valor: 0.2, tipo: 'despesa', categoria: 'Alimentação', consumoConsciente: false, createdAt: 4 },
    ]);

    const resultado = await service.findAll();

    expect(resultado.historico).toHaveLength(4);
    expect(resultado.metricas).toEqual({
      saldoTotal: 1549.7,
      totalDespesas: 1450.3,
      totalGastoImpulso: 250.3,
    });
  });

  it('retorna métricas zeradas quando não há transações', async () => {
    const service = await criarService([]);
    const resultado = await service.findAll();
    expect(resultado).toEqual({
      historico: [],
      metricas: { saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 },
    });
  });
});
