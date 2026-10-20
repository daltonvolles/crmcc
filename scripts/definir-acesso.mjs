// Cria ou atualiza um usuário ADMIN (já aprovado) na tabela "usuarios".
// Serve também para trocar a senha do admin. A senha é guardada embaralhada (scrypt + sal).
// Uso: npm run definir-acesso

import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { randomBytes, scryptSync } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const ARQUIVO = new URL('../.env.local', import.meta.url)
process.loadEnvFile(ARQUIVO)

const rl = createInterface({ input: stdin, output: stdout })
let esconder = false
rl._writeToOutput = (texto) => stdout.write(esconder ? '*'.repeat(texto.replace(/[\r\n]/g, '').length) : texto)

async function perguntarSenha(rotulo) {
  stdout.write(rotulo)
  esconder = true
  const senha = await rl.question('')
  esconder = false
  stdout.write('\n')
  return senha
}

const usuario = (await rl.question('Usuário: ')).trim().toLowerCase()
const senha = await perguntarSenha('Senha: ')
const confirmacao = await perguntarSenha('Repita a senha: ')
rl.close()

if (!usuario || !senha) {
  console.log('Usuário e senha são obrigatórios. Nada foi alterado.')
  process.exit(1)
}
if (senha !== confirmacao) {
  console.log('As senhas não conferem. Nada foi alterado.')
  process.exit(1)
}

const sal = randomBytes(16).toString('hex')
const senhaHash = `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const { error } = await supabase
  .from('usuarios')
  .upsert({ usuario, senha_hash: senhaHash, papel: 'admin', status: 'aprovado' }, { onConflict: 'usuario' })

if (error) {
  console.log('Erro ao salvar no banco:', error.message)
  process.exit(1)
}

if (!process.env.SESSION_SECRET) {
  appendFileSync(ARQUIVO, `\nSESSION_SECRET=${randomBytes(32).toString('hex')}\n`)
}

console.log(`Pronto! "${usuario}" é administrador. Reinicie o servidor (npm run dev) se ele estiver rodando.`)
