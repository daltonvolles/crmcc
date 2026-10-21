# Identidade Visual do CRM · V2 Dark Tech

Este arquivo é a fonte da verdade visual do projeto. Seguir em todas as telas, sem exceção (incluindo login, cadastro e usuários). Substitui a identidade da v1.

## Clima

Ferramenta técnica e precisa, escura, de quem trabalha à noite. Um produto profissional, não um template.

## Cores

| Uso | Cor |
| --- | --- |
| Fundo da aplicação | `#0D1117` |
| Superfícies (cards, painéis, navegação, cabeçalho) | `#151B24` |
| Bordas (sempre visíveis) | `#262F3D` |
| Superfícies elevadas (modais, menus) | `#1B222E` |
| Texto principal | `#E6EAF2` |
| Texto de apoio | `#9AA4B2` |
| Destaque (ações e elementos ativos) | `#4DBDFF` |
| Destaque no hover | `#6BA1FF` |
| Erros | `#FB7171` |

- Uma única cor de destaque: o azul elétrico. Nenhuma outra cor de marca.
- Botão principal: fundo `#4DBDFF` com texto escuro `#0D1117` (texto branco sobre azul claro fica ilegível).
- Campos de formulário: fundo `#0D1117`, borda `#262F3D`; ao focar, borda no destaque.
- Item ativo e seleções: fundo de destaque suave (o azul com baixa opacidade, ~12%) e texto no azul.
- Contraste sempre confortável: texto principal para leitura, texto de apoio só para informação secundária.

### Cores das etapas do funil

Versões luminosas, legíveis no escuro. Usadas **só** para representar etapas (etiquetas e números do painel):

- Novo: `#8B99AD`
- Em contato: `#F5A524`
- Proposta: `#A78BFA`
- Cliente: `#34D399`

## Tipografia

- Texto em geral: "Manrope" (Google Fonts), sem serifa.
- Números, contadores, datas, etiquetas de etapa e rótulos técnicos: "JetBrains Mono" (Google Fonts). É o toque tech.
- Títulos em peso forte (700); textos em peso normal (400).
- Rótulos técnicos pequenos (ex.: títulos de seção, etiquetas) podem ir em caixa alta com leve espaçamento entre letras.
- Hierarquia clara entre título, subtítulo e texto.

## Formas e espaçamento

- Cantos arredondados: `10px`.
- Bordas visíveis em vez de sombras.
- Bastante respiro entre os elementos.

## Proibido

- Gradientes.
- Efeito de vidro / desfoque (glassmorphism, backdrop-blur).
- Emojis na interface.
- Sombras exageradas.
- Animações chamativas (só transições curtas de cor no hover).

Se a tela parecer "template de IA", está errado.

---

# Design V2 · De página para sistema

O CRM deixa de ser uma página única e vira um sistema com áreas.

## Shell de aplicação

Toda tela logada usa o mesmo shell:

- **Cabeçalho** no topo, de ponta a ponta: nome do CRM à esquerda; à direita, quem está logado e o botão Sair.
- **Navegação lateral fixa** à esquerda, abaixo do cabeçalho, com as áreas do sistema:
  - Dashboard
  - Funil
  - Contatos
  - Usuários (visível só para admin)
  - A lista é simples de estender: novas áreas entram como novos itens.
- **Área de conteúdo** à direita da navegação. Cada área é uma tela cheia, com título no topo.
- O **item ativo** da navegação fica visível com fundo de destaque (azul suave) e texto no azul.

## Áreas

| Área | Endereço | Conteúdo |
| --- | --- | --- |
| Dashboard | `/` | Painel de números do funil (total e por etapa) |
| Funil | `/funil` | Lista de contatos com etapa e anotações |
| Contatos | `/contatos` | Cadastro de novo contato |
| Usuários | `/usuarios` | Gestão de usuários (só admin) |

## Telas estreitas (celular)

- A navegação lateral some e dá lugar a um botão "Menu" no cabeçalho.
- Tocar no botão abre a navegação por cima do conteúdo (superfície elevada `#1B222E`); escolher uma área fecha o menu.

## Telas públicas (login e cadastro)

- Sem shell: um painel centralizado sobre o fundo escuro, com o nome do CRM no topo.
- Mesmas cores, fontes, campos e botões das telas internas.
