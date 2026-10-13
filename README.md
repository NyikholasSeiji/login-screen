# login-screen

Tela de login em HTML e CSS, com JavaScript simulando a tentativa de login (sem back-end).

## Como rodar

Abra o arquivo `index.html` no navegador.

## Login de teste

- E-mail: `admin@email.com`
- Senha: `123456`

## O que a simulação faz

- Valida e-mail e senha (campos vazios, formato do e-mail, mínimo de 6 caracteres)
- Mostra "Entrando..." por 1,5 s, simulando o servidor
- Mostra mensagem de sucesso ou de erro
- Bloqueia por 10 s após 3 tentativas erradas
- Botão para mostrar/ocultar a senha
- "Lembrar de mim" salva o e-mail no `localStorage`
