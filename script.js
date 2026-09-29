// =========================================
// PEGAR ELEMENTOS DO HTML
// =========================================

const campoTarefa = document.getElementById("campo-tarefa");

const botaoAdicionar = document.getElementById("botao-adicionar");

const listaTarefas = document.getElementById("lista-tarefas");

const contadorTarefas = document.getElementById("contador-tarefas");

const botaoAlterarTema = document.getElementById("botao-alterar-tema");


// =========================================
// CARREGAR TAREFAS SALVAS
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

        item.innerHTML = `
            <span class="texto-tarefa">
                ${tarefa.nome}
            </span>

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

    tarefas.push({
        nome: texto,
        concluida: false
    });

    campoTarefa.value = "";

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

    const total = tarefas.length;

    contadorTarefas.textContent =
        `${total} ${total === 1 ? "tarefa" : "tarefas"} na lista`;
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

    document.body.classList.toggle("modo-escuro");

    const modoEscuro =
        document.body.classList.contains("modo-escuro");


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
// CARREGAR TEMA SALVO
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
// INICIAR
// =========================================

mostrarTarefas();

carregarTema();