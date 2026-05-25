import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const btnLogin = document.getElementById("btn-login");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const msgErro = document.getElementById("msg-erro");

btnLogin.addEventListener("click", async () => {
    const email = emailInput.value;
    const senha = senhaInput.value;

    // Reseta a mensagem de erro
    msgErro.style.display = "none";
    msgErro.textContent = "";

    if (!email || !senha) {
        msgErro.style.display = "block";
        msgErro.textContent = "Preencha e-mail e senha.";
        return;
    }

    try {
        btnLogin.textContent = "Entrando...";
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Vai no banco olhar a Role do usuário
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === "tecnico") {
                window.location.href = "tecnico.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            // Se o usuário não estiver na coleção 'usuarios', assume que é solicitante normal
            window.location.href = "publicar.html";
        }
        
        }catch (error) {
        msgErro.style.display = "block";
        
        // Verificando qual foi o erro para mostrar uma mensagem amigável
            if (error.code === 'auth/invalid-credential') {
            msgErro.textContent = "E-mail ou senha incorretos.";
            } else if (error.code === 'auth/invalid-email') {
            msgErro.textContent = "Formato de e-mail inválido.";
            } else {
            msgErro.textContent = "Erro ao fazer login: " + error.message;
            }
    }
});