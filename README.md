# Controle Financeiro Pessoal — NestJS + MongoDB + Front-end Mobile First

Projeto extensionista (ODS 1 e ODS 12) da disciplina Web Mobile — TADS Mackenzie.

- **Aula 7:** API RESTful com NestJS + MongoDB Atlas (`POST /transacoes` e `GET /transacoes` com métricas).
- **Aula 8:** Front-end estático (HTML, CSS e JS) Mobile First em `src/public`, servido pelo próprio NestJS.

## Como rodar

Requisitos: Node.js 18 ou superior e npm.

1. `npm install`
2. Copie `.env.example` para `.env` e coloque a sua string de conexão do MongoDB Atlas em `MONGODB_URI`.
3. `npm run start:dev`
4. Abra **http://localhost:3000** no navegador (ou no celular, na mesma rede, pelo IP do computador).

Também funciona abrindo `src/public/index.html` com o **Live Server** do VS Code
(a API precisa estar rodando na porta 3000; o CORS já está liberado no `main.ts`).

## Estrutura

```
src/
├── main.ts                       # CORS + arquivos estáticos de src/public
├── app.module.ts                 # conexão com o MongoDB (lida do .env)
├── transacoes/
│   ├── schemas/transacao.schema.ts
│   ├── dto/create-transacao.dto.ts
│   ├── transacoes.controller.ts  # POST e GET /transacoes
│   └── transacoes.service.ts     # calcula saldoTotal, totalDespesas, totalGastoImpulso
└── public/                       # FRONT-END (Aula 8)
    ├── index.html                # Dashboard de Saúde Financeira (GET)
    ├── cadastro.html             # Formulário de nova transação (POST)
    ├── css/style.css
    └── js/config.js, dashboard.js, cadastro.js
```

## API

`POST /transacoes`
```json
{ "descricao": "Conta de Luz", "valor": 180.5, "tipo": "despesa", "categoria": "Moradia", "consumoConsciente": true }
```

`GET /transacoes`
```json
{
  "historico": [ { "_id": "...", "descricao": "Conta de Luz", "valor": 180.5, "tipo": "despesa", "categoria": "Moradia", "consumoConsciente": true, "createdAt": "..." } ],
  "metricas": { "saldoTotal": 2819.5, "totalDespesas": 180.5, "totalGastoImpulso": 0 }
}
```

O front-end **não faz cálculos**: só lê `metricas` e percorre `historico`.

## Testes

```
npm test          # testes unitários do service
npm run test:e2e  # testes das rotas (usam um banco falso em memória, não precisam do Atlas)
```

## Entrega

Repositório público: **https://github.com/GiovanniB6/proj_aula8**

A entrega tem duas partes, e as duas são necessárias:

| Onde | O quê | Por quê |
|------|-------|---------|
| **AVA** | Arquivo ZIP do projeto | Exigido nas Aulas 7 e 8. Na Aula 8, é a entrega avaliada. |
| **GitHub** | Código público neste repositório | Exigido na Aula 7. Sem o repositório público, não há crédito no Projeto Extensionista. |

O ZIP é o mesmo para as duas aulas e contém somente:

- pastas `src` e `test`
- `package.json`, `tsconfig.json`, `tsconfig.build.json` e `nest-cli.json`
- `github.txt` (URL deste repositório), `README.md`, `.env.example` e `.gitignore`

### Conexão com o MongoDB Atlas (.env)

A string de conexão com o banco fica no arquivo `.env`, que **não** vai para o GitHub
(está no `.gitignore`) para não expor a senha em um repositório público.

Sem o `.env`, a API não consegue conectar ao banco. Para quem for executar o projeto:

- **Professor:** o `.env` pode ser incluído apenas no ZIP enviado pelo AVA; ou
- crie o seu próprio `.env` a partir do `.env.example`, com a string do seu cluster:

```
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/controle_financeiro
```

Recomendação: use no Atlas um usuário de banco criado só para esta atividade.
