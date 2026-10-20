-- Rodar uma vez no Supabase: menu "SQL Editor" > New query > colar > Run.

create table usuarios (
  id uuid primary key default gen_random_uuid(),
  usuario text not null unique,
  senha_hash text not null,
  papel text not null default 'usuario' check (papel in ('admin', 'usuario')),
  status text not null default 'pendente' check (status in ('pendente', 'aprovado')),
  criado_em timestamptz not null default now()
);

-- Bloqueia acesso pela chave pública; só o servidor do CRM (chave secreta) lê a tabela.
alter table usuarios enable row level security;
