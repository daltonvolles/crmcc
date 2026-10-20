-- Rodar uma vez no Supabase: menu "SQL Editor" > New query > colar > Run.
-- Bloqueia o acesso às tabelas pela chave pública do Supabase; só o servidor do CRM (chave secreta) lê e grava.
-- Pode rodar de novo sem problema.

alter table contatos enable row level security;
alter table anotacoes enable row level security;
