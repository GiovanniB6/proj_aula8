import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { TransacoesController } from '../src/transacoes/transacoes.controller';
import { TransacoesService } from '../src/transacoes/transacoes.service';
import { Transacao } from '../src/transacoes/schemas/transacao.schema';
import { criarModelFalso } from './model-falso';

describe('Transacoes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { ModelFalso } = criarModelFalso();
    const modulo = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [
        TransacoesService,
        { provide: getModelToken(Transacao.name), useValue: ModelFalso },
      ],
    }).compile();
    app = modulo.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  it('POST /transacoes cadastra e GET /transacoes devolve histórico + métricas', async () => {
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'Salário', valor: 2000, tipo: 'receita', categoria: 'Salário', consumoConsciente: true })
      .expect(201);
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'Fone', valor: 150, tipo: 'despesa', categoria: 'Compras', consumoConsciente: false })
      .expect(201);

    const resposta = await request(app.getHttpServer()).get('/transacoes').expect(200);

    expect(resposta.body.historico).toHaveLength(2);
    expect(resposta.body.historico[0].descricao).toBe('Fone'); // mais recente primeiro
    expect(resposta.body.metricas).toEqual({ saldoTotal: 1850, totalDespesas: 150, totalGastoImpulso: 150 });
  });
});
