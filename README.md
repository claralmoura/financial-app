# App de Finanças Pessoais

![Status: Concluído](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen)

Aplicação full-stack de gerenciamento financeiro pessoal, desenvolvida para praticar e demonstrar habilidades com a stack moderna de JavaScript/TypeScript.

---

## ✨ Funcionalidades

- **Autenticação de Usuário:** Sistema completo com registro e login usando tokens JWT.
- **Dashboard Interativo:** Visão geral com cards de resumo (receitas, despesas, saldo) e gráficos reativos.
- **CRUD de Transações:** Crie, leia, atualize e exclua transações financeiras.
- **CRUD de Categorias:** Gerencie categorias personalizadas para receitas e despesas.
- **Filtros Dinâmicos:** Filtre o dashboard por período (semana, mês, ano) e as transações por categoria ou descrição.
- **Visualização de Dados:** Gráficos de pizza e de barras (com Chart.js) para análise financeira.
- **Design Responsivo:** Interface adaptável para desktop e dispositivos móveis.

---

## 🛠️ Stack de Tecnologia

**Frontend:**
- Vue.js 3 (Composition API & `<script setup>`)
- Vite
- TypeScript
- Tailwind CSS
- Element Plus
- Pinia (Gerenciamento de Estado)
- Vue Router
- Apollo Client (GraphQL)
- Chart.js

**Backend:**
- NestJS
- TypeScript
- GraphQL com Apollo Server
- Mongoose
- Passport.js (Autenticação com JWT)

**Banco de Dados & Deploy:**
- **Banco de Dados:** MongoDB Atlas
- **Deploy Backend:** Render
- **Deploy Frontend:** Vercel

---

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/app-financas-pessoais.git](https://github.com/claralmoura/financial-app.git)
   cd app-financas-pessoais
   ```

2. **Setup do Backend:**
   ```bash
   cd backend
   npm install
   ```
   - Renomeie `.env.example` para `.env` e preencha as variáveis `DATABASE_URL` e `JWT_SECRET`.
   ```bash
   npm run start:dev
   ```

3. **Setup do Frontend:**
   ```bash
   cd frontend
   npm install
   ```
   - Crie um arquivo `.env` e adicione `VITE_API_URL=http://localhost:3000/graphql`.
   ```bash
   npm run dev
   ```
