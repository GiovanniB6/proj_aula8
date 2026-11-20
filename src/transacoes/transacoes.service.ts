import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<TransacaoDocument>,
  ) {}

  async create(dto: CreateTransacaoDto): Promise<Transacao> {
    const nova = new this.transacaoModel(dto);
    return nova.save();
  }

  // Devolve o histórico e as métricas já calculadas (o front-end só exibe).
  async findAll() {
    // Mais recentes primeiro, para o extrato do front-end.
    const historico = await this.transacaoModel.find().sort({ createdAt: -1 }).exec();

    let totalReceitas = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const t of historico) {
      if (t.tipo === 'receita') {
        totalReceitas += t.valor;
      } else if (t.tipo === 'despesa') {
        totalDespesas += t.valor;
        if (t.consumoConsciente === false) {
          totalGastoImpulso += t.valor;
        }
      }
    }

    // Arredonda para 2 casas e evita problemas de ponto flutuante (ex.: 0.1 + 0.2).
    const arredondar = (n: number) => Math.round(n * 100) / 100;

    return {
      historico,
      metricas: {
        saldoTotal: arredondar(totalReceitas - totalDespesas),
        totalDespesas: arredondar(totalDespesas),
        totalGastoImpulso: arredondar(totalGastoImpulso),
      },
    };
  }
}
