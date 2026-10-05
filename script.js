
// =========================================
// PEGAR ELEMENTOS DO HTML
// =========================================

const campoTarefa =
    document.getElementById("campo-tarefa");

const botaoAdicionar =
    document.getElementById("botao-adicionar");

const listaTarefas =
    document.getElementById("lista-tarefas");

const contadorTarefas =
    document.getElementById("contador-tarefas");

const botaoAlterarTema =
    document.getElementById("botao-alterar-tema");

const humorTarefa =
    document.getElementById("humor-tarefa");

const mensagemMare =
    document.getElementById("mensagem-mare");

const progressoMare =
    document.getElementById("progresso-mare");

const numeroPendentes =
    document.getElementById("numero-pendentes");


// =========================================
// CARREGAR TAREFAS
// =========================================

let tarefas = JSON.parse(
    localStorage.getItem("tarefas")
) || [];


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


        // Compatibilidade com tarefas antigas

        const clima =
            tarefa.clima || "Tranquilo";

        const emoji =
            tarefa.humor || "🌊";


        item.innerHTML = `

            <div class="informacoes-tarefa">

                <span class="emoji-tarefa">
                    ${emoji}
                </span>


                <div class="texto-tarefa-area">

                    <span class="texto-tarefa">
                        ${tarefa.nome}
                    </span>

                    <span class="clima-tarefa">
                        ${clima}
                    </span>

                </div>

            </div>


            <div class="acoes-tarefa">

                <button
                    class="botao-verificar"
                    onclick="concluirTarefa(${indice})"
                    title="Concluir tarefa">

                    <i class="fa-solid fa-circle-check"></i>

                </button>


                <button
                    class="botao-excluir"
                    onclick="excluirTarefa(${indice})"
                    title="Excluir tarefa">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;


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

    const texto =
        campoTarefa.value.trim();


    if (texto === "") {

        alert(
            "Digite uma tarefa antes de adicionar."
        );

        return;

    }


    // Separar emoji e descrição do humor

    const dadosHumor =
        humorTarefa.value.split("|");


    const emoji =
        dadosHumor[0];

    const clima =
        dadosHumor[1];


    tarefas.push({

        nome: texto,

        concluida: false,

        humor: emoji,

        clima: clima

    });


    // Limpar campo

    campoTarefa.value = "";


    // Voltar para a primeira opção

    humorTarefa.value =
        "☀️|Cheio de energia";


    mostrarTarefas();

    campoTarefa.focus();

}


// =========================================
// CONCLUIR TAREFA
// =========================================

function concluirTarefa(indice) {

    tarefas[indice].concluida =
        !tarefas[indice].concluida;


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
// ATUALIZAR CONTADOR
// =========================================

function atualizarContador() {

    const total =
        tarefas.length;


    contadorTarefas.textContent =
        `${total} ${total === 1 ? "tarefa" : "tarefas"} na lista`;

}


// =========================================
// ATUALIZAR NÍVEL DA MARÉ
// =========================================

function atualizarMare() {

    const tarefasPendentes =
        tarefas.filter(
            tarefa => !tarefa.concluida
        ).length;


    numeroPendentes.textContent =
        `${tarefasPendentes} ${
            tarefasPendentes === 1
                ? "pendente"
                : "pendentes"
        }`;


    // Nenhuma tarefa pendente

    if (tarefasPendentes === 0) {

        progressoMare.style.width = "0%";

        mensagemMare.textContent =
            "🏖️ Praia tranquila! Tudo em dia!";

        return;

    }


    // De 1 até 3 tarefas

    if (tarefasPendentes <= 3) {

        progressoMare.style.width = "30%";

        mensagemMare.textContent =
            "🌊 Maré baixa — está tudo sob controle!";

        return;

    }


    // De 4 até 5 tarefas

    if (tarefasPendentes <= 5) {

        progressoMare.style.width = "60%";

        mensagemMare.textContent =
            "🌊🌊 Maré subindo — hora de começar!";

        return;

    }


    // 6 ou mais tarefas

    progressoMare.style.width = "100%";

    mensagemMare.textContent =
        "🌊🌊🌊 Maré alta — vamos organizar antes da tempestade!";

}


// =========================================
// SALVAR TAREFAS
// =========================================

function salvarTarefas() {

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

}


// =========================================
// MUDAR TEMA
// =========================================

function alterarTema() {

    document.body.classList.toggle(
        "modo-escuro"
    );


    const modoEscuro =
        document.body.classList.contains(
            "modo-escuro"
        );


    if (modoEscuro) {

        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-sun"></i>';


        localStorage.setItem(
            "tema",
            "escuro"
        );

    } else {

        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-moon"></i>';


        localStorage.setItem(
            "tema",
            "claro"
        );

    }

}


// =========================================
// CARREGAR TEMA
// =========================================

function carregarTema() {

    const tema =
        localStorage.getItem("tema");


    if (tema === "escuro") {

        document.body.classList.add(
            "modo-escuro"
        );


        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

}


// =========================================
// BOTÃO ADICIONAR
// =========================================

botaoAdicionar.addEventListener(
    "click",
    adicionarTarefa
);


// =========================================
// BOTÃO DE TEMA
// =========================================

botaoAlterarTema.addEventListener(
    "click",
    alterarTema
);


// =========================================
// ENTER PARA ADICIONAR
// =========================================

campoTarefa.addEventListener(
    "keydown",
    function(evento) {

        if (evento.key === "Enter") {

            adicionarTarefa();

        }

    }
);


// =========================================
// INICIAR A APLICAÇÃO
// =========================================

carregarTema();

mostrarTarefas();

