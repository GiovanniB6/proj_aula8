import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  // POST /transacoes -> cadastra uma receita ou despesa
  @Post()
  create(@Body() dto: CreateTransacaoDto) {
    return this.transacoesService.create(dto);
  }

  // GET /transacoes -> { historico: [...], metricas: { saldoTotal, totalDespesas, totalGastoImpulso } }
  @Get()
  findAll() {
    return this.transacoesService.findAll();
  }
}
