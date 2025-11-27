// IMPORTAÇÕES
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, increment, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// CONFIGURAÇÃO
const firebaseConfig = {
    apiKey: "AIzaSyBCK5dJwPTeIeKRkNuuKtxRWbSyugBW3DI",
    authDomain: "inforgram-6ff38.firebaseapp.com",
    projectId: "inforgram-6ff38",
    storageBucket: "inforgram-6ff38.firebasestorage.app",
    messagingSenderId: "735952084956",
    appId: "1:735952084956:web:76542c7c9e9b64da5fb919",
    measurementId: "G-HED47CVH2V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsCollection = collection(db, "posts");

// --- 1. LÓGICA DO FEED (RENDERIZAÇÃO) ---
const feedContainer = document.getElementById('feed-container');

if (feedContainer) {
    const q = query(postsCollection, orderBy("data", "desc"));
    
    onSnapshot(q, (snapshot) => {
        feedContainer.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const post = docSnap.data();
            const id = docSnap.id;
            const likes = post.likes || 0; // Pega curtidas ou 0
            
            const card = document.createElement('article');
            card.className = 'post-card';
            
            // Verifica se o usuário local já curtiu (localStorage)
            const likedClass = localStorage.getItem(`liked_${id}`) ? 'color: red;' : '';
            const iconType = localStorage.getItem(`liked_${id}`) ? 'favorite' : 'favorite_border';

            card.innerHTML = `
                <div class="card-header">
                    <div class="user-info">
                        <img src="img/inforgram-logo.jpg" class="avatar-small"> 
                        <span class="username">${escapeHtml(post.nome)}</span>
                    </div>
                    <span class="material-icons-outlined delete-btn" data-id="${id}">delete</span>
                </div>
                
                <div class="card-content">
                    <p>${escapeHtml(post.mensagem)}</p>
                </div>

                <div class="card-actions">
                    <div style="display:flex; align-items:center; cursor:pointer;" class="like-btn" data-id="${id}">
                        <span class="material-icons-outlined" style="${likedClass}">${iconType}</span>
                    </div>
                    <span class="material-icons-outlined comment-btn">chat_bubble_outline</span>
                    <span class="material-icons-outlined">send</span>
                </div>
                
                <div class="likes-count" style="padding: 0 15px; font-weight: bold; font-size: 0.9rem;">
                    ${likes} curtidas
                </div>

                <div style="padding:5px 15px 15px; color:#888; font-size:0.8rem;">
                    Postado hoje
                </div>
            `;
            
            // Evento Deletar
            card.querySelector('.delete-btn').addEventListener('click', () => deletePost(id));
            
            // Evento Curtir
            card.querySelector('.like-btn').addEventListener('click', function() {
                handleLike(id, this);
            });

            // Evento Comentar (Simulado)
            card.querySelector('.comment-btn').addEventListener('click', () => {
                const comment = prompt("Escreva seu comentário:");
                if(comment) alert("Comentário enviado! (Simulação)");
            });

            feedContainer.appendChild(card);
        });
    });
}

// --- 2. FUNÇÃO DE CURTIR (REAL) ---
async function handleLike(id, btnElement) {
    // Verifica se já curtiu localmente para evitar flood
    if (localStorage.getItem(`liked_${id}`)) {
        return alert("Você já curtiu esse post!");
    }

    // Efeito visual imediato
    const icon = btnElement.querySelector('span');
    icon.textContent = 'favorite'; // Muda ícone para preenchido
    icon.style.color = 'red';
    
    // Salva no navegador que essa pessoa curtiu
    localStorage.setItem(`liked_${id}`, 'true');

    try {
        const postRef = doc(db, "posts", id);
        // Atualiza no banco (Incrementa +1)
        await updateDoc(postRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error("Erro ao curtir:", error);
    }
}

// --- 3. FUNÇÃO POSTAR (UNIFICADA E CORRIGIDA) ---
const postForm = document.getElementById('post-form');

if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const message = document.getElementById('message').value;
        const btn = document.getElementById('btn-submit');
        
        // 3.1 Filtro de Palavrões (Mantido)
        const badWords = ['bobo', 'feio', 'palavrao'];
        if (badWords.some(w => message.toLowerCase().includes(w))) {
            alert("Mensagem bloqueada pelo filtro.");
            return;
        }

        try {
            btn.textContent = "Enviando...";
            btn.disabled = true;
            
            // 3.2 Envio para o Banco (Com likes: 0)
            await addDoc(postsCollection, {
                nome: username,
                mensagem: message,
                likes: 0, // Inicia com 0
                data: serverTimestamp()
            });
            
            // 3.3 Redireciona de volta para o Feed
            window.location.href = 'index.html'; 
            
        } catch (error) {
            console.error(error);
            alert("Erro ao postar");
            btn.disabled = false;
        }
    });
}

// --- 4. FUNÇÕES UTILITÁRIAS ---

// Deletar Post
async function deletePost(id) {
    if (confirm("Deseja apagar esta mensagem permanentemente?")) {
        try {
            await deleteDoc(doc(db, "posts", id));
        } catch (e) {
            console.error(e);
            alert("Erro ao deletar");
        }
    }
}

// Segurança XSS
function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#039;' }[m];
    });
}

// Admin Status UI
window.checkAdminStatus = function () {
    const loginForm = document.getElementById('admin-login-form');
    const logoutArea = document.getElementById('admin-logout-area');

    if (loginForm && logoutArea) {
        if (document.body.classList.contains('admin-mode')) {
            loginForm.classList.add('hidden');
            logoutArea.classList.remove('hidden');
        } else {
            loginForm.classList.remove('hidden');
            logoutArea.classList.add('hidden');
        }
    }
}

// Função de abrir Mídia Única (Notificações)
window.openSingleMedia = function (mediaSrc) {
    clearTimeout(storyTimer);

    const modal = document.getElementById('modal-story-viewer');
    const imgEl = document.getElementById('story-image-display');
    const videoEl = document.getElementById('story-video-display');
    const progressContainer = document.getElementById('story-progress-container');

    // Limpa UI do story normal
    if(progressContainer) progressContainer.innerHTML = '';
    
    const userLabel = document.querySelector('.story-username');
    if (userLabel) userLabel.textContent = "inforgram_oficial";

    imgEl.classList.add('hidden');
    videoEl.classList.add('hidden');
    videoEl.pause();

    if (mediaSrc.endsWith('.mp4')) {
        videoEl.src = mediaSrc;
        videoEl.classList.remove('hidden');
        videoEl.play();
        videoEl.loop = true;
    } else {
        imgEl.src = mediaSrc;
        imgEl.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
}


// --- 5. LÓGICA DE STORIES ---

const storiesContent = {
    'web': [
        'img/story-web-1.jpg',
        'img/story-web-2.jpg',
        'img/story-web-3.jpg',
        'img/story-web-4.jpg'
    ],
    'games': [
        'img/videogames.mp4',
        'img/gamestory.mp4',
        'img/gamesstory.mp4'
    ],
    'robo': [
        'img/robostory.mp4',
        'img/story-robo-1.jpg',
        'img/story-robo-3.mp4',
    ],
    'hard': [
        'img/story-hard-1.jpeg',
        'img/story-hard-2.mp4',
        'img/story-hard-3.jpeg',
        'img/story-hard-4.mp4',
    ],
    'moment': [
        'img/story1.jpeg',
        'img/story2.jpeg',
        'img/story3.jpeg',
        'img/story4.jpeg',
        'img/story5.jpeg',
        'img/story6.jpeg',
        'img/story7.jpeg',
        'img/story8.jpeg',
        'img/story9.jpeg',
        'img/story10.jpeg',
        'img/story11.jpeg',
        'img/story12.jpeg',
        'img/story13.jpeg',
        'img/story14.jpeg',
        'img/story15.jpeg',
        'img/story16.jpeg',
        'img/story17.jpeg',
        'img/story18.jpg',
        'img/story19.jpeg'
    ]
};

let currentStoryImages = [];
let currentStoryIndex = 0;
let storyTimer = null;
const DEFAULT_DURATION = 4000;

window.openStory = function (category) {
    currentStoryImages = storiesContent[category] || [];
    if (currentStoryImages.length === 0) return alert("Categoria vazia!");

    const userLabel = document.querySelector('.story-username');
    if (userLabel) userLabel.textContent = "inforgram_" + category;

    setupProgressBars();

    const modal = document.getElementById('modal-story-viewer');
    modal.classList.remove('hidden');

    currentStoryIndex = 0;
    showCurrentStoryMedia();
}

function setupProgressBars() {
    const container = document.getElementById('story-progress-container');
    if(!container) return;
    
    container.innerHTML = '';

    currentStoryImages.forEach((_, index) => {
        const segment = document.createElement('div');
        segment.className = 'progress-segment';

        const fill = document.createElement('div');
        fill.className = 'progress-fill';
        fill.id = `progress-fill-${index}`;

        segment.appendChild(fill);
        container.appendChild(segment);
    });
}

function showCurrentStoryMedia() {
    clearTimeout(storyTimer);

    const imgEl = document.getElementById('story-image-display');
    const videoEl = document.getElementById('story-video-display');
    const icon = document.getElementById('story-like-icon'); // PEGA O ÍCONE
    
    const currentMedia = currentStoryImages[currentStoryIndex];
    const isVideo = currentMedia.endsWith('.mp4');
    let duration = DEFAULT_DURATION;

    // --- NOVO: Verifica se essa foto específica já foi curtida ---
    const storyKey = `liked_story_${currentMedia}`;
    if(localStorage.getItem(storyKey)) {
        icon.textContent = 'favorite';
        icon.style.color = 'red';
    } else {
        icon.textContent = 'favorite_border';
        icon.style.color = 'white';
    }
    // ------------------------------------------------------------

    imgEl.classList.add('hidden');
    videoEl.classList.add('hidden');
    videoEl.pause();

    if (isVideo) {
        videoEl.src = currentMedia;
        videoEl.classList.remove('hidden');
        videoEl.play();
        videoEl.onloadedmetadata = () => {
            duration = videoEl.duration * 1000;
            animateProgressBar(duration);
            videoEl.onended = () => nextStory();
        };
        setTimeout(() => animateProgressBar(duration), 100);
    } else {
        imgEl.src = currentMedia;
        imgEl.classList.remove('hidden');
        animateProgressBar(duration);
        storyTimer = setTimeout(nextStory, duration);
    }
}

function animateProgressBar(duration) {
    currentStoryImages.forEach((_, i) => {
        const bar = document.getElementById(`progress-fill-${i}`);
        if (bar) {
            bar.style.animation = 'none';
            bar.style.width = '0%';

            if (i < currentStoryIndex) {
                bar.style.width = '100%';
            } else if (i === currentStoryIndex) {
                void bar.offsetWidth; // Força reflow para reiniciar animação
                bar.style.animation = `fillBar ${duration}ms linear forwards`;
            }
        }
    });
}

window.nextStory = function () {
    if (currentStoryIndex < currentStoryImages.length - 1) {
        currentStoryIndex++;
        showCurrentStoryMedia();
    } else {
        closeStory();
    }
}

window.prevStory = function () {
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        showCurrentStoryMedia();
    } else {
        showCurrentStoryMedia();
    }
}

window.closeStory = function () {
    clearTimeout(storyTimer);
    const videoEl = document.getElementById('story-video-display');
    if (videoEl) videoEl.pause();
    document.getElementById('modal-story-viewer').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const staticBtns = document.querySelectorAll('.static-like-btn');
    
    staticBtns.forEach(btn => {
        const id = btn.dataset.id;
        const icon = btn.querySelector('span');
        
        // Verifica memória
        if(localStorage.getItem(`liked_${id}`)) {
            icon.textContent = 'favorite';
            icon.style.color = 'red';
        }

        // Adiciona evento de clique
        btn.addEventListener('click', () => {
            if(localStorage.getItem(`liked_${id}`)) {
                // Se já curtiu, descurte (opcional, mas bom pra testar)
                localStorage.removeItem(`liked_${id}`);
                icon.textContent = 'favorite_border';
                icon.style.color = 'inherit';
                updateStaticCount(id, -1);
            } else {
                // Curte
                localStorage.setItem(`liked_${id}`, 'true');
                icon.textContent = 'favorite';
                icon.style.color = 'red';
                
                // Efeito de pulso
                icon.style.transform = 'scale(1.3)';
                setTimeout(() => icon.style.transform = 'scale(1)', 200);
                
                updateStaticCount(id, 1);
            }
        });
    });
});

// Atualiza o número visualmente
function updateStaticCount(id, amount) {
    const countEl = document.getElementById(`count-${id}`);
    if(countEl) {
        // Pega apenas o número do texto (ex: "154 curtidas" -> 154)
        let current = parseInt(countEl.innerText);
        if(isNaN(current)) current = 0;
        countEl.innerText = `${current + amount} curtidas`;
    }
}

// 2. Curtir Stories (Toggle Visual)
window.toggleStoryLike = function() {
    const icon = document.getElementById('story-like-icon');
    const currentMedia = currentStoryImages[currentStoryIndex]; // Pega a foto atual
    
    // Cria uma chave única para essa foto (ex: liked_story_web_0)
    // Assim ele lembra qual foto específica você curtiu!
    const storyKey = `liked_story_${currentMedia}`; 

    if (icon.textContent === 'favorite') {
        // Descurtir
        icon.textContent = 'favorite_border';
        icon.style.color = 'white';
        localStorage.removeItem(storyKey);
    } else {
        // Curtir
        icon.textContent = 'favorite';
        icon.style.color = 'red';
        icon.style.animation = 'likeBounce 0.3s'; // Animação
        setTimeout(() => icon.style.animation = 'none', 300);
        localStorage.setItem(storyKey, 'true');
    }
}