# ✨ Inforgram - Rede Social Interativa em Tempo Real

Uma aplicação web interativa desenvolvida para a **Feira das Profissões**, simulando uma rede social completa (estilo Instagram). O projeto funciona como um totem digital onde visitantes podem interagir, e o feed é atualizado instantaneamente em um monitor principal, demonstrando o poder da comunicação em tempo real.

Este projeto vai além de um site estático, implementando uma arquitetura **Fullstack Serverless** utilizando **Google Firebase** como Backend-as-a-Service (BaaS). O foco foi criar uma experiência imersiva ("Efeito Uau") para os visitantes, provando que tecnologias complexas podem ser aprendidas no curso técnico.

O desenvolvimento abordou conceitos avançados de Engenharia de Software Web, incluindo:

* **Arquitetura Reativa e Serverless (Firebase):**
    * **Banco de Dados em Tempo Real:** Utilização do **Cloud Firestore** (NoSQL) com *listeners* (`onSnapshot`) para sincronizar dados instantaneamente entre múltiplos dispositivos sem a necessidade de recarregar a página (F5).
    * **Operações CRUD:** Implementação completa de criação (postar), leitura (feed) e exclusão (moderação admin) de dados na nuvem.

* **Frontend Moderno e UX/UI (HTML5, CSS3 & JS ES6+):**
    * **Design Responsivo Adaptativo:** O layout se transforma drasticamente dependendo do dispositivo: funciona como um *Dashboard* de 3 colunas em telas grandes (Desktop/Telão) e se converte em uma *App Experience* (Menu inferior, navegação por toque) em dispositivos móveis.
    * **CSS Grid e Flexbox Avançado:** Estruturação complexa do layout sem uso de frameworks pesados, garantindo performance e controle total do design (Glassmorphism, Dark Mode).
    * **Lógica de Interação Complexa:**
        * **Stories Híbridos:** Algoritmo em JavaScript capaz de gerenciar filas de reprodução mistas (Fotos e Vídeos), com barras de progresso segmentadas e temporizadores automáticos.
        * **Reels com Scroll Snap:** Implementação de rolagem vertical com travamento (física de aplicativo) usando CSS puro (`scroll-snap`).
        * **Persistência Local:** Uso de `localStorage` para gerenciar estados de "curtida" e evitar interações duplicadas no frontend.

-----

## ✨ Funcionalidades Principais

* **Feed em Tempo Real:** Postagens feitas em um dispositivo aparecem instantaneamente no telão principal via WebSockets.
* **Visualizador de Stories Inteligente:** Suporte para fotos e vídeos, navegação por toque (esquerda/direita) e barra de progresso segmentada dinâmica.
* **Aba Reels Imersiva:** Player de vídeo em tela cheia com rolagem vertical estilo TikTok/Reels e controle de áudio.
* **Modo Administrador (Segurança):** Sistema de login simples para moderadores, permitindo a exclusão de posts impróprios diretamente pela interface.
* **Design Mobile-First:** Barra de navegação inferior, carrossel de sugestões horizontal e cabeçalho fixo otimizados para celulares.
* **Sistema de Notificações Interativo:** Ao clicar em uma notificação de curtida/comentário, a aplicação abre a mídia específica (foto ou vídeo) correspondente.

-----

## 🛠️ Tecnologias Utilizadas

* **Linguagens:** HTML5 Semântico, CSS3 (Variables, Animations, Media Queries), JavaScript (ES6 Modules).
* **Backend-as-a-Service (BaaS):** [Google Firebase](https://firebase.google.com/) (Firestore Database).
* **SDKs:** Firebase JS SDK v9 (Modular).
* **Ícones:** [Google Material Icons](https://fonts.google.com/icons).
* **Fontes:** Instagram Sans (Custom Font) e System Fonts.

-----

## 🚀 Como Executar Localmente

Como o projeto utiliza **Módulos JavaScript (ES6)** para importar o Firebase, ele precisa rodar em um servidor local (não funcionará apenas clicando no arquivo HTML).

1. **Clone o repositório:**

```bash
git clone [https://github.com/MaryAylla/inforgram.git](https://github.com/MaryAylla/inforgram.git)
cd inforgram
