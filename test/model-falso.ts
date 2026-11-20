// Modelo Mongoose FALSO, em memória, usado só nos testes (dispensa o MongoDB Atlas).
export function criarModelFalso(dadosIniciais: any[] = []) {
  const banco: any[] = [...dadosIniciais];

  class ModelFalso {
    constructor(dto: any) {
      Object.assign(this, dto);
    }
    async save() {
      const doc = { _id: String(banco.length + 1), ...this, createdAt: new Date(Date.now() + banco.length) };
      banco.push(doc);
      return doc;
    }
    static find() {
      return {
        sort: () => ({
          exec: async () => [...banco].sort((a, b) => b.createdAt - a.createdAt),
        }),
      };
    }
  }
  return { ModelFalso, banco };
}
