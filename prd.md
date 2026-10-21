# CRM — Documento de Produto (PRD)

## O que é e pra quem

É um CRM simples para uma pessoa organizar seus contatos e oportunidades de negócio em um só lugar. Serve para quem hoje usa planilhas ou anotações soltas e quer acompanhar cada contato desde o primeiro interesse até virar cliente. O foco é ter uma visão clara de quantas oportunidades existem, em que etapa estão, e o que fazer a seguir com cada uma.

## Funcionalidades da primeira versão

- [x] Cadastro e listagem de contatos
- [x] Funil com etapas (novo, em contato, proposta, cliente)
- [x] Anotações por contato
- [x] Login
- [ ] Follow-up gerado por IA
- [x] Painel com os números do funil
- [x] Publicação na internet

## Entregue fora do plano original

- [x] Multiusuário: qualquer pessoa pode se cadastrar, mas só entra depois que o administrador aprova na tela de Usuários; há dois papéis (administrador e usuário) e os contatos são compartilhados entre todos os aprovados.

## O que NÃO entra na primeira versão

- Envio automático de e-mail ou WhatsApp para os contatos
- Integração com outros sistemas (planilhas, redes sociais, ERPs, etc.)
- Aplicativo mobile (só funciona pelo navegador)
- Relatórios avançados ou exportação de dados
- Personalização do funil (etapas fixas, sem criar/editar etapas novas)
- Múltiplos funis ou múltiplos "produtos/negócios" separados

## Versão 2

- [x] **Kanban do funil:** ver e mover os contatos entre as etapas arrastando.

  PRONTO QUANDO:
  - Abro o Funil e vejo 4 colunas (Novo, Em contato, Proposta, Cliente), cada uma com seus contatos e a quantidade no topo.
  - Arrasto um contato de uma coluna para outra e ele fica na coluna nova.
  - Recarrego a página e o contato continua na coluna para onde arrastei.
  - Abro o Dashboard e os números já refletem a mudança de etapa.
  - Em tela estreita (celular), consigo ver todas as colunas e mudar um contato de etapa pelo seletor de etapa do cartão.

- [x] **Página do contato:** tudo de um contato num lugar só (dados, etapa, anotações), com uma busca pra chegar nela rápido. A página já tem um espaço reservado para os follow-ups gerados, que serão ligados quando o "Follow-up gerado por IA" for construído.

  PRONTO QUANDO:
  - Clico em um contato (no Kanban ou na busca) e abre a página dele, com endereço próprio.
  - Na página vejo nome, email, telefone, a etapa atual e as anotações, e consigo trocar a etapa e criar, editar e excluir anotações ali mesmo.
  - Digito parte do nome na busca e aparecem os contatos que batem; ao escolher um, vou direto para a página dele.
  - Uma busca sem resultado mostra uma mensagem clara de que nada foi encontrado.

- [x] **Dashboard v2:** os números do funil apresentados como painel de sistema, com um gráfico simples da distribuição por etapa.

  PRONTO QUANDO:
  - Abro o Dashboard e vejo o total de contatos e a quantidade em cada etapa, no visual do sistema (design.md).
  - Vejo um gráfico simples mostrando quantos contatos há em cada etapa, cada uma na sua cor.
  - Mudo a etapa de um contato, volto ao Dashboard e números e gráfico mudaram juntos.
  - Sem nenhum contato cadastrado, o Dashboard mostra zeros e uma mensagem clara, sem quebrar.
  - Em tela estreita (celular), números e gráfico continuam legíveis.

## Fora da v2 (fica pra v3)

- Permissões avançadas (dono por contato, metas por usuário)
- Automações e lembretes agendados
- Integrações com outros sistemas
- Aplicativo de celular
