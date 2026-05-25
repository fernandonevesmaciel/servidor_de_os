import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Proteção de rota e Botão de Sair
onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "index.html";
});

document.getElementById("btn-sair").addEventListener("click", () => {
    signOut(auth);
});

// Referência para onde vamos injetar o HTML
const listaOsContainer = document.getElementById("lista-os");

// Função para buscar e renderizar as OS
async function carregarOSPendentes() {
    listaOsContainer.innerHTML = "<p style='text-align: center;'>Buscando Ordens de Serviço...</p>";
    
    try {
        // Cria a query: Buscar na coleção 'ordens_de_servico' onde 'status' == 'pendente'
        const q = query(collection(db, "ordens_de_servico"), where("status", "==", "pendente"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            listaOsContainer.innerHTML = "<p style='text-align: center;'>Nenhuma OS pendente no momento. 🎉</p>";
            return;
        }

        listaOsContainer.innerHTML = ""; // Limpa a mensagem de carregando

        // Para cada OS encontrada, cria o HTML do Card
        querySnapshot.forEach((documento) => {
            const os = documento.data();
            const osId = documento.id; // O ID real do documento no banco

            const card = document.createElement('div');
            card.className = 'os-card';
            
            // Injetando os dados da OS no HTML
            card.innerHTML = `
                <div class="os-header">
                    <h3>${os.codigoOs}</h3>
                    <strong>Setor: ${os.setor}</strong>
                </div>
                <p><strong>Solicitante:</strong> ${os.nomeSolicitante}</p>
                <p><strong>Tipo:</strong> ${os.tipoOs}</p>
                <p><strong>Data Prevista:</strong> ${os.dataPrevista}</p>
                <img src="${os.fotoUrl}" alt="Foto da OS" class="os-foto">
                
                <div class="os-botoes">
                    <button class="btn-sucesso" onclick="atualizarOS('${osId}', 'concluida')">Marcar como Concluída</button>
                    <button class="btn-aviso" onclick="atualizarOS('${osId}', 'nao_concluida')">Não Concluída</button>
                </div>
            `;
            
            listaOsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao buscar OS: ", error);
        listaOsContainer.innerHTML = "<p style='text-align: center; color: red;'>Erro ao carregar os dados.</p>";
    }
}

// Essa função precisa ser global (window) para o 'onclick' do HTML funcionar
window.atualizarOS = async function(osId, novoStatus) {
    if(!confirm(`Tem certeza que deseja marcar esta OS como ${novoStatus === 'concluida' ? 'Concluída' : 'Não Concluída'}?`)) {
        return;
    }

    try {
        // Pega a referência do documento específico
        const osRef = doc(db, "ordens_de_servico", osId);
        
        // Atualiza apenas o campo status
        await updateDoc(osRef, {
            status: novoStatus
        });

        alert("OS atualizada com sucesso!");
        carregarOSPendentes(); // Recarrega a lista para sumir com a OS atualizada
        
    } catch (error) {
        console.error("Erro ao atualizar OS: ", error);
        alert("Erro ao atualizar o status.");
    }
}

// Chama a função assim que a página carrega
carregarOSPendentes();