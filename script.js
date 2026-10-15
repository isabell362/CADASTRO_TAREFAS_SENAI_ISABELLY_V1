
// =========================================
// PEGAR ELEMENTOS DO HTML
// =========================================

const campoTarefa = document.getElementById("campo-tarefa");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoAlterarTema = document.getElementById("botao-alterar-tema");
const humorTarefa = document.getElementById("humor-tarefa");
const mensagemMare = document.getElementById("mensagem-mare");
const progressoMare = document.getElementById("progresso-mare");
const numeroPendentes = document.getElementById("numero-pendentes");

// =========================================
// CARREGAR TAREFAS SALVAS
// =========================================

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// =========================================
// MAPA DE EMOJIS
// =========================================

const emojisHumor = {
    feliz: "😊",
    animada: "🌞",
    tranquila: "🌊",
    cansada: "😴",
    ansiosa: "🌥️",
    desanimada: "☁️",
    "cheio de energia": "☀️"
};

// =========================================
// RECUPERAR O EMOJI DAS TAREFAS
// =========================================

function recuperarEmoji(tarefa) {
    const humorSalvo = String(tarefa.humor || "🌊").trim();
    const humorMinusculo = humorSalvo.toLowerCase();

    // Corrigir tarefas antigas que salvaram o nome do humor
    if (emojisHumor[humorMinusculo]) {
        return emojisHumor[humorMinusculo];
    }

    // Corrigir formato antigo: emoji|descrição
    if (humorSalvo.includes("|")) {
        const partes = humorSalvo.split("|");
        const primeiraParte = partes[0].trim();

        if (emojisHumor[primeiraParte.toLowerCase()]) {
            return emojisHumor[primeiraParte.toLowerCase()];
        }

        return primeiraParte || "🌊";
    }

    // Se já estiver salvo como emoji, manter
    const emojiEncontrado = humorSalvo.match(/^\p{Emoji_Presentation}/u);

    if (emojiEncontrado) {
        return emojiEncontrado[0];
    }

    return "🌊";
}

// =========================================
// MOSTRAR TAREFAS
// =========================================

function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    tarefas.forEach((tarefa, indice) => {
        const item = document.createElement("li");
        item.classList.add("item-tarefa");

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        const emoji = recuperarEmoji(tarefa);

        item.innerHTML = `
            <div class="informacoes-tarefa">
                <span class="emoji-tarefa">${emoji}</span>

                <div class="texto-tarefa-area">
                    <span class="texto-tarefa"></span>
                </div>
            </div>

            <div class="acoes-tarefa">
                <button
                    class="botao-verificar"
                    type="button"
                    onclick="concluirTarefa(${indice})"
                    title="Concluir tarefa"
                    aria-label="Concluir tarefa">
                    <i class="fa-solid fa-circle-check"></i>
                </button>

                <button
                    class="botao-excluir"
                    type="button"
                    onclick="excluirTarefa(${indice})"
                    title="Excluir tarefa"
                    aria-label="Excluir tarefa">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        // Inserir o nome como texto, sem misturar com o emoji
        item.querySelector(".texto-tarefa").textContent = tarefa.nome;

        listaTarefas.appendChild(item);
    });

    atualizarContador();
    atualizarMare();
    salvarTarefas();
}

// =========================================
// ADICIONAR TAREFA
// =========================================

function adicionarTarefa() {
    const texto = campoTarefa.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa antes de adicionar.");
        return;
    }

    const valorHumor = humorTarefa.value;
    let emoji = "🌊";

    if (valorHumor) {
        // Compatibilidade com opções no formato emoji|descrição
        if (valorHumor.includes("|")) {
            emoji = valorHumor.split("|")[0];
        } else {
            // Opções atuais do HTML: feliz, animada etc.
            emoji = emojisHumor[valorHumor.toLowerCase()] || "🌊";
        }
    }

    tarefas.push({
        nome: texto,
        concluida: false,
        humor: emoji
    });

    campoTarefa.value = "";
    humorTarefa.selectedIndex = 0;

    mostrarTarefas();
    campoTarefa.focus();
}

// =========================================
// CONCLUIR TAREFA
// =========================================

function concluirTarefa(indice) {
    tarefas[indice].concluida = !tarefas[indice].concluida;
    mostrarTarefas();
}

// =========================================
// EXCLUIR TAREFA
// =========================================

function excluirTarefa(indice) {
    tarefas.splice(indice, 1);
    mostrarTarefas();
}

// =========================================
// ATUALIZAR CONTADOR DE TAREFAS
// =========================================

function atualizarContador() {
    const total = tarefas.length;

    contadorTarefas.textContent =
        `${total} ${total === 1 ? "tarefa" : "tarefas"} na lista`;
}

// =========================================
// ATUALIZAR MARÉ DE PROGRESSO
// =========================================

function atualizarMare() {
    const tarefasPendentes = tarefas.filter(
        tarefa => !tarefa.concluida
    ).length;

    // O HTML já contém a palavra "pendentes"
    numeroPendentes.textContent = tarefasPendentes;

    const barraMare = document.querySelector(".barra-mare");

    const total = tarefas.length;
    const concluidas = total - tarefasPendentes;

    const porcentagem = total === 0
        ? 0
        : Math.round((concluidas / total) * 100);

    progressoMare.style.width = `${porcentagem}%`;

    if (barraMare) {
        barraMare.setAttribute("aria-valuenow", String(porcentagem));
    }

    if (tarefasPendentes === 0) {
        mensagemMare.textContent = "🏖️ Praia tranquila! Tudo em dia!";
    } else if (tarefasPendentes <= 3) {
        mensagemMare.textContent =
            "🌊 Maré baixa — está tudo sob controle!";
    } else if (tarefasPendentes <= 5) {
        mensagemMare.textContent =
            "🌊🌊 Maré subindo — hora de começar!";
    } else {
        mensagemMare.textContent =
            "🌊🌊🌊 Maré alta — vamos organizar as tarefas!";
    }
}

// =========================================
// SALVAR TAREFAS
// =========================================

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// =========================================
// MUDAR TEMA
// =========================================

function alterarTema() {
    document.body.classList.toggle("modo-escuro");

    const modoEscuro = document.body.classList.contains("modo-escuro");

    if (modoEscuro) {
        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

        localStorage.setItem("tema", "escuro");
    } else {
        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

        localStorage.setItem("tema", "claro");
    }
}

// =========================================
// CARREGAR TEMA
// =========================================

function carregarTema() {
    const tema = localStorage.getItem("tema");

    if (tema === "escuro") {
        document.body.classList.add("modo-escuro");

        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.classList.remove("modo-escuro");

        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }
}

// =========================================
// BOTÕES E TECLADO
// =========================================

botaoAdicionar.addEventListener("click", adicionarTarefa);
botaoAlterarTema.addEventListener("click", alterarTema);

campoTarefa.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        adicionarTarefa();
    }
});

// =========================================
// PAINEL DE AJUDA
// =========================================

const botaoAjuda = document.getElementById("botao-ajuda");
const balaoAjuda = document.getElementById("balao-ajuda");
const fecharAjuda = document.getElementById("fechar-ajuda");

if (botaoAjuda && balaoAjuda && fecharAjuda) {
    botaoAjuda.addEventListener("click", function() {
        balaoAjuda.hidden = !balaoAjuda.hidden;

        botaoAjuda.setAttribute(
            "aria-expanded",
            String(!balaoAjuda.hidden)
        );
    });

    fecharAjuda.addEventListener("click", function() {
        balaoAjuda.hidden = true;
        botaoAjuda.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", function(evento) {
        if (evento.key === "Escape" && !balaoAjuda.hidden) {
            balaoAjuda.hidden = true;
            botaoAjuda.setAttribute("aria-expanded", "false");
        }
    });
}

// =========================================
// INICIAR A APLICAÇÃO
// =========================================

carregarTema();
mostrarTarefas();
