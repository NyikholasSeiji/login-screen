// Usuário fixo apenas para simular o login (não há back-end)
const USUARIO_TESTE = {
  email: "admin@email.com",
  senha: "123456",
};

const MAX_TENTATIVAS = 3;
let tentativas = 0;

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("password");
const emailErro = document.getElementById("email-error");
const senhaErro = document.getElementById("password-error");
const botaoEntrar = document.getElementById("submit");
const botaoMostrar = document.getElementById("toggle-password");
const lembrar = document.getElementById("remember");
const mensagem = document.getElementById("message");

const emailSalvo = localStorage.getItem("emailLembrado");
if (emailSalvo) {
  emailInput.value = emailSalvo;
  lembrar.checked = true;
}

botaoMostrar.addEventListener("click", () => {
  const oculto = senhaInput.type === "password";
  senhaInput.type = oculto ? "text" : "password";
  botaoMostrar.textContent = oculto ? "Ocultar" : "Mostrar";
});

document.getElementById("forgot").addEventListener("click", (e) => {
  e.preventDefault();
  mostrarMensagem("Enviamos um link de recuperação para o seu e-mail (simulação).", "info");
});

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "message " + tipo;
}

function validarCampos() {
  let valido = true;
  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  emailErro.textContent = "";
  senhaErro.textContent = "";
  emailInput.classList.remove("invalid");
  senhaInput.classList.remove("invalid");

  if (email === "") {
    emailErro.textContent = "Informe o e-mail.";
    valido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailErro.textContent = "E-mail inválido.";
    valido = false;
  }

  if (senha === "") {
    senhaErro.textContent = "Informe a senha.";
    valido = false;
  } else if (senha.length < 6) {
    senhaErro.textContent = "A senha deve ter pelo menos 6 caracteres.";
    valido = false;
  }

  if (emailErro.textContent) emailInput.classList.add("invalid");
  if (senhaErro.textContent) senhaInput.classList.add("invalid");

  return valido;
}

// Simula uma chamada ao servidor que demora 1,5 segundo
function simularLogin(email, senha) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(email === USUARIO_TESTE.email && senha === USUARIO_TESTE.senha);
    }, 1500);
  });
}

function bloquearTemporariamente(segundos) {
  botaoEntrar.disabled = true;
  let restante = segundos;
  mostrarMensagem(`Muitas tentativas. Tente novamente em ${restante}s.`, "fail");

  const timer = setInterval(() => {
    restante--;
    if (restante <= 0) {
      clearInterval(timer);
      tentativas = 0;
      botaoEntrar.disabled = false;
      botaoEntrar.textContent = "Entrar";
      mostrarMensagem("Você já pode tentar novamente.", "info");
    } else {
      mostrarMensagem(`Muitas tentativas. Tente novamente em ${restante}s.`, "fail");
    }
  }, 1000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensagem.className = "message";

  if (!validarCampos()) return;

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  botaoEntrar.disabled = true;
  botaoEntrar.textContent = "Entrando...";

  const sucesso = await simularLogin(email, senha);

  if (sucesso) {
    tentativas = 0;
    if (lembrar.checked) {
      localStorage.setItem("emailLembrado", email);
    } else {
      localStorage.removeItem("emailLembrado");
    }
    mostrarMensagem(`Login realizado com sucesso! Bem-vindo, ${email}.`, "success");
    senhaInput.value = "";
    botaoEntrar.textContent = "Entrar";
    botaoEntrar.disabled = false;
    return;
  }

  tentativas++;
  senhaInput.value = "";

  if (tentativas >= MAX_TENTATIVAS) {
    bloquearTemporariamente(10);
    return;
  }

  const restantes = MAX_TENTATIVAS - tentativas;
  mostrarMensagem(`E-mail ou senha incorretos. Tentativas restantes: ${restantes}.`, "fail");
  botaoEntrar.textContent = "Entrar";
  botaoEntrar.disabled = false;
});
