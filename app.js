import { auth, db, storage } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// Proteção de rota: se não estiver logado, volta pro login
let usuarioLogado = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioLogado = user;
    } else {
        window.location.href = "index.html";
    }
});

// Botão de Sair
document.getElementById("btn-sair").addEventListener("click", () => {
    signOut(auth);
});

// Lógica do Formulário
const formOs = document.getElementById("form-os");
const msgStatus = document.getElementById("msg-status");
const btnSalvar = document.getElementById("btn-salvar");

formOs.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarregar a página
    
    btnSalvar.textContent = "Enviando...";
    btnSalvar.disabled = true;
    msgStatus.style.color = "blue";
    msgStatus.textContent = "Fazendo upload da foto...";

    try {
        // 1. Pegar os valores do formulário
        const nome = document.getElementById("nome-solicitante").value;
        const setor = document.getElementById("setor").value;
        const tipoOs = document.getElementById("tipo-os").value;
        const dataPrevista = document.getElementById("data-prevista").value;
        const fotoArquivo = document.getElementById("foto-os").files[0];

        // 2. Gerar o Código da OS (Ex: OS-1715451234)
        const codigoOs = "OS-" + Date.now().toString().slice(-6);

        // 3. Fazer upload da foto pro Firebase Storage
        // Cria um caminho único para a foto usando o código da OS
        const fotoRef = ref(storage, `fotos_os/${codigoOs}_${fotoArquivo.name}`);
        await uploadBytes(fotoRef, fotoArquivo);
        
        // 4. Pegar a URL pública da foto gerada
        const fotoUrl = await getDownloadURL(fotoRef);

        msgStatus.textContent = "Salvando Ordem de Serviço...";

        // 5. Salvar tudo no Firestore (Banco de Dados)
        await addDoc(collection(db, "ordens_de_servico"), {
            codigoOs: codigoOs,
            solicitanteId: usuarioLogado.uid,
            solicitanteEmail: usuarioLogado.email,
            nomeSolicitante: nome,
            setor: setor,
            tipoOs: tipoOs,
            dataPrevista: dataPrevista,
            fotoUrl: fotoUrl,
            status: "pendente",
            dataCriacao: serverTimestamp()
        });

        // Sucesso!
        msgStatus.style.color = "green";
        msgStatus.textContent = `Sucesso! OS criada com código: ${codigoOs}`;
        formOs.reset(); // Limpa o formulário

    } catch (error) {
        console.error(error);
        msgStatus.style.color = "red";
        msgStatus.textContent = "Erro ao criar OS. Tente novamente.";
    } finally {
        btnSalvar.textContent = "Gerar OS";
        btnSalvar.disabled = false;
    }
});