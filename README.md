# 🕒 Dora — Calculadora de Ponto

Uma aplicação web para calcular e acompanhar a jornada de trabalho diária de forma intuitiva.

## 🚀 Tecnologias Utilizadas

- **[React 19](https://reactjs.org/)** com **[Vite](https://vitejs.dev/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** para estilização
- **[MUI (Material UI)](https://mui.com/)** para ícones e componentes
- **JavaScript (ES6+)**

## ✨ Funcionalidades

- **Calculadora de Ponto:** Registro de entrada, almoço e retorno para calcular automaticamente o horário de saída estimado.
- **Banco de Horas:** Aba dedicada ao histórico de dias registrados, com opções de editar e excluir registros.
- **Barra de Progresso:** Visualização do andamento da jornada em tempo real (`ProgressBar`).
- **Saída Real:** Campo para registrar o horário que você realmente saiu, exibido ao concluir a jornada.
- **Alertas Inteligentes:** Avisos contextuais para erros de horário, intervalo curto, horário de almoço e jornada concluída (`alertas.js`).
- **Preferências:** Modal de configurações para jornada padrão, tolerância de ponto e notificação de fim de expediente (`PreferenciasModal`).
- **Paletas de Cores:** 6 opções de cor de acento (roxo, azul, rosa, amarelo, vermelho e verde), cada uma com versão escura e clara. O fundo e os cards acompanham sutilmente a cor escolhida.
- **Notificações do Navegador:** Alerta via Web Notifications API ao zerar o tempo restante.
- **Registro Automático:** Salva o ponto automaticamente à meia-noite caso não tenha sido registrado manualmente, limpando os campos em seguida.
- **Limpeza ao Registrar:** Campos limpos automaticamente ao registrar o dia manualmente, com confirmação antes da ação.
- **Persistência Local:** Dados salvos via `localStorage` (horários do dia, histórico e preferências).
- **Mensagem Diária:** Mensagem motivacional exibida na tela principal (`MensagemDiaria`).
- **Card de Novidades:** Notificação dispensável no canto inferior direito para anunciar atualizações aos usuários (`CardNovidade`).

## 🗂️ Estrutura do Projeto

```
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── JornadaInput.jsx
│   ├── TimeInput.jsx
│   ├── Resultado.jsx
│   ├── ProgressBar.jsx
│   ├── Historico.jsx
│   ├── MensagemDiaria.jsx
│   ├── PreferenciasModal.jsx
│   └── CardNovidade.jsx
├── utils/
│   ├── time.js
│   └── alertas.js
├── App.jsx
└── main.jsx
```

## 🛠️ Como executar o projeto localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/calculadora-de-ponto.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd calculadora-de-ponto
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra o navegador no link informado no terminal (geralmente `http://localhost:5173`).

## 👩💻 Autora

Desenvolvido com 💜 por **Maria Eduarda Anunciato**.
