// ===========================
// SIDEBAR TOGGLE
// ===========================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ===========================
// CHAT WIDGET TOGGLE
// ===========================
function toggleChat() {
    const chatWidget = document.getElementById('chat-widget-window');
    chatWidget.classList.toggle('d-none');
    if (!chatWidget.classList.contains('d-none')) {
        setTimeout(() => {
            document.getElementById('user-input').focus();
        }, 100);
    }
}

// ===========================
// PROGRESS TRACKING
// ===========================
let completedLessons = [];

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('mikrotik-progress');
    if (saved) {
        completedLessons = JSON.parse(saved);
        updateProgressBar();
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('mikrotik-progress', JSON.stringify(completedLessons));
    updateProgressBar();
}

// Update progress bar
function updateProgressBar() {
    const totalLessons = 10; // Total materi
    const completed = completedLessons.length;
    const percentage = Math.round((completed / totalLessons) * 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.textContent = percentage + '%';
    }

    if (progressText) {
        progressText.textContent = percentage + '% Selesai';
    }
}

// Mark lesson as completed
function markAsCompleted(lessonId) {
    if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        saveProgress();
        alert('Materi berhasil ditandai sebagai selesai!');
    } else {
        alert('Materi ini sudah ditandai selesai sebelumnya.');
    }
}

// ===========================
// CODE COPY FUNCTIONALITY
// ===========================
function copyCode(button) {
    const codeBlock = button.parentElement.querySelector('code');
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#10b981';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#3b82f6';
        }, 2000);
    });
}

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function () {
    loadProgress();

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (event) {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = event.target.closest('[onclick="toggleSidebar()"]');

        if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !toggleBtn) {
                sidebar.classList.remove('active');
            }
        }
    });
});
// --- KONFIGURASI DAN INIALISASI API ---

// API Key yang Anda berikan
// PENTING: Dalam aplikasi nyata, API Key ini HARUS disimpan di server,
// BUKAN di kode frontend. Namun, untuk demo sederhana ini, kita letakkan di sini.
const API_KEY = "AIzaSyBQtHe6v6yLRDGsEfvSUfAkQPcfI9GdhrU";

// URL Endpoint Gemini API
// Kita menggunakan model gemini-2.5-flash-preview-09-2025 untuk performa cepat.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// Elemen DOM
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const loadingIndicator = document.getElementById('loading-indicator');
const sendButton = document.getElementById('send-button');

// Menyimpan riwayat obrolan untuk konteks
let chatHistory = [];

// --- FUNGSI UTAMA CHATBOT ---

/**
 * Konversi Markdown dasar (bold, list item, dan blok kode) ke HTML untuk tampilan yang lebih baik.
 * @param {string} text - Teks dalam format Markdown.
 * @returns {string} - Teks dalam format HTML yang sudah diformat.
 */
function markdownToHtml(text) {
    let output = [];
    let isList = false;
    let isCodeBlock = false;

    // Memproses setiap baris teks
    text.split('\n').forEach(line => {
        let cleanLine = line.trim();

        // 1. Deteksi Blok Kode (Fenced Code Block)
        if (line.startsWith('```')) {
            if (isCodeBlock) {
                output.push('</code></pre>');
                isCodeBlock = false;
            } else {
                // Mengambil petunjuk bahasa (misalnya, ```html)
                const language = line.substring(3).trim().split(' ')[0] || 'plaintext';
                // Memulai blok kode dengan <pre> dan <code>
                output.push(`<pre><code class="language-${language}">`);
                isCodeBlock = true;
            }
            return; // Lewati baris pagar kode itu sendiri
        }

        if (isCodeBlock) {
            // Escape karakter HTML di dalam blok kode (< menjadi &lt;, > menjadi &gt;)
            output.push(line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
            return;
        }

        // 2. Item Daftar dan Pemformatan Reguler (hanya jika TIDAK di dalam blok kode)

        // Pastikan list ditutup jika baris sebelumnya adalah list dan baris saat ini bukan
        if (!cleanLine.startsWith('* ') && !cleanLine.startsWith('- ') && isList) {
            output.push('</ul>');
            isList = false;
        }

        if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
            if (!isList) {
                output.push('<ul>');
                isList = true;
            }
            // Hapus marker, dan proses bold di dalam item list
            let itemContent = cleanLine.substring(2).trim();
            // Tangani **bold**
            itemContent = itemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Tangani *bold*
            itemContent = itemContent.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

            output.push(`<li>${itemContent}</li>`);
        } else {
            // Pemrosesan teks reguler
            let processedLine = line;

            // Proses bold di teks reguler
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            processedLine = processedLine.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

            // Tangani heading dasar (seperti `#### C. Bagian Akhir`) untuk memformatnya sebagai paragraf bold
            if (processedLine.trim().startsWith('#')) {
                processedLine = `<strong>${processedLine.replace(/#+\s*/g, '').trim()}</strong>`;
            }

            // Tambahkan baris konten (menggunakan 'line' asli untuk menjaga spasi di awal baris)
            output.push(processedLine);
        }
    });

    // Clean up: tutup list yang tersisa
    if (isList) {
        output.push('</ul>');
    }
    // Clean up: tutup blok kode yang tersisa
    if (isCodeBlock) {
        output.push('</code></pre>');
    }

    // Gabungkan output. Kita menggunakan '\n' untuk menjaga pemisahan baris dan membiarkan browser menangani rendering
    return output.filter(line => line.trim() !== '').join('\n');
}


/**
 * Menambahkan pesan ke jendela obrolan (chat window).
 * @param {string} text - Teks pesan.
 * @param {string} sender - 'user' atau 'bot'.
 */
function displayMessage(text, sender) {
    // Membuat elemen div baru untuk pesan
    const messageDiv = document.createElement('div');
    // Menambahkan kelas Bootstrap: my-2 (margin vertikal), rounded, shadow
    messageDiv.classList.add('message', sender, 'my-2');

    // Mengubah Markdown menjadi HTML sebelum ditampilkan
    const formattedText = markdownToHtml(text);

    // Cek apakah output mengandung tag blok kode atau list
    const needsWrap = formattedText.includes('<pre>') || formattedText.includes('<ul>');

    if (needsWrap) {
        // Jika ada blok kode atau list, masukkan langsung HTML yang sudah diformat
        messageDiv.innerHTML = formattedText;
    } else {
        // Jika hanya teks biasa, bungkus dalam <p>
        messageDiv.innerHTML = `<p class="mb-0">${formattedText.replace(/\n/g, '<br>')}</p>`;
    }

    // Menambahkan pesan ke bagian atas chat window (karena flex-direction: column-reverse)
    chatWindow.prepend(messageDiv);

    // Menggulir ke pesan terbaru (yang ada di bagian bawah visual)
    chatWindow.scrollTop = 0; // Karena kita menggunakan reverse, scrollTop 0 adalah yang paling "bawah"
}

/**
 * Mengirim pesan ke Gemini API dan mendapatkan respons.
 * @param {string} prompt - Pesan pengguna saat ini.
 */
async function sendMessageToGemini(prompt) {
    // 1. Tambahkan pesan pengguna ke riwayat dan tampilkan di UI
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    displayMessage(prompt, 'user');
    userInput.value = ''; // Kosongkan input setelah dikirim

    // 2. Tampilkan indikator loading dan nonaktifkan input
    loadingIndicator.classList.remove('d-none'); // Menggunakan d-none untuk hidden di Bootstrap
    userInput.disabled = true;
    sendButton.disabled = true;

    // =======================================================================
    // INI ADALAH SYSTEM INSTRUCTION (Prompt Bawaan) YANG BISA ANDA SESUAIKAN
    // Gunakan ini untuk mendefinisikan persona, gaya, nada, dan aturan output model.
    // =======================================================================
    const systemInstruction = "anda adalah seorang asisten ai yang paham tentang dunia jaringan mikrotik, ketika anda diberi perintah, pastikan outputnya jelas rapih dan menggunakan bahasa indonesia yang ramah dan tidak terlalu kaku ,seolah olah anda adalah manusia, ketika anda diberikan perintah, pastikan jawabannya dengan rinci jelas dan terkesan ramah dan mudah dimengerti oleh para pemula";

    // 3. Siapkan payload untuk API
    const payload = {
        // Riwayat chat disertakan agar model memiliki konteks
        contents: chatHistory,

        // Gunakan Google Search grounding untuk jawaban yang berbasis fakta dan terkini
        tools: [{ "google_search": {} }],

        // Instruksi sistem untuk memandu persona dan gaya bahasa model
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },

        // Konfigurasi generasi.
        generationConfig: {
            // Maksimum token respons agar tidak terlalu panjang
            maxOutputTokens: 1000,
        }
    };

    // 4. Lakukan pemanggilan API dengan Exponential Backoff untuk penanganan error
    const MAX_RETRIES = 5;
    let response;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // 1. Jika respons berhasil (status 2xx), keluar dari loop retry
            if (response.ok) {
                break;
            }

            // 2. Cek untuk error 4xx non-retryable (400, 401, 403, 404). Hentikan retries segera.
            //    429 (Rate Limit) dikecualikan dan akan di-retry.
            if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                const errorJson = await response.json().catch(() => ({}));
                const errorMessage = errorJson.error?.message || response.statusText || 'Kesalahan pada permintaan API.';
                // Lempar error untuk ditangkap di blok catch dan ditampilkan ke pengguna.
                throw new Error(`(Status ${response.status}) ${errorMessage}`);
            }

            // 3. Jika gagal (5xx atau 429), log dan coba lagi (kecuali ini adalah percobaan terakhir)
            if (attempt < MAX_RETRIES - 1) {
                console.warn(`Percobaan ${attempt + 1} gagal (Status: ${response.status}), mencoba lagi dalam ${2 ** attempt} detik...`);
                await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000));
            } else {
                // Percobaan terakhir gagal.
                throw new Error(`API gagal setelah ${MAX_RETRIES} percobaan. (Status akhir: ${response.status})`);
            }

        } catch (error) {
            // Blok catch menangani network error, 4xx non-retryable error, dan kegagalan percobaan terakhir.
            console.error("Fetch Error:", error);

            displayMessage('Maaf, terjadi kesalahan saat menghubungi server AI. Silakan coba lagi. (Error: ' + error.message + ')', 'bot');

            // Hapus pesan user terakhir dari riwayat
            chatHistory.pop();

            // Hentikan loading dan aktifkan kembali input
            loadingIndicator.classList.add('d-none');
            userInput.disabled = false;
            sendButton.disabled = false;
            return; // Keluar dari fungsi segera setelah error ditampilkan
        }
    }


    // 5. Proses Respons API
    try {
        // Pastikan respons berhasil didapatkan sebelum mencoba parse JSON
        if (!response || !response.ok) {
            throw new Error("Respons API tidak valid atau gagal saat diterima.");
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        let botResponseText = 'Maaf, saya tidak dapat memahami atau memproses permintaan Anda.';
        let sourcesHtml = '';

        if (candidate && candidate.content?.parts?.[0]?.text) {
            botResponseText = candidate.content.parts[0].text;

            // Ekstraksi sumber (citations) jika grounding digunakan
            const groundingMetadata = candidate.groundingMetadata;
            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                const sources = groundingMetadata.groundingAttributions
                    .map(attribution => ({
                        uri: attribution.web?.uri,
                        title: attribution.web?.title,
                    }))
                    .filter(source => source.uri && source.title)
                    // Batasi hanya 3 sumber teratas
                    .slice(0, 3);

                if (sources.length > 0) {
                    // Menggunakan kelas Bootstrap untuk styling sumber
                    sourcesHtml = '<div class="mt-2 pt-2 border-top border-light text-muted small">';
                    sourcesHtml += 'Sumber:';
                    sources.forEach((source, index) => {
                        sourcesHtml += ` <a href="${source.uri}" target="_blank" class="text-decoration-none text-primary" title="${source.uri}">${source.title}</a>${index < sources.length - 1 ? ',' : ''}`;
                    });
                    sourcesHtml += '</div>';
                }
            }
        }

        // 6. Tambahkan respons bot ke riwayat dan tampilkan di UI
        chatHistory.push({ role: "model", parts: [{ text: botResponseText }] });

        // Gabungkan teks bot dengan sumber (jika ada) untuk ditampilkan
        const fullBotMessage = botResponseText + sourcesHtml;
        displayMessage(fullBotMessage, 'bot');

    } catch (error) {
        console.error("Error processing Gemini response:", error);
        displayMessage('Maaf, terjadi kesalahan dalam memproses respons. (Detail: ' + error.message + ')', 'bot');
        chatHistory.pop(); // Hapus pesan user terakhir
    }

    // 7. Sembunyikan indikator loading dan aktifkan kembali input
    loadingIndicator.classList.add('d-none');
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus(); // Kembalikan fokus ke input
}

// --- EVENT LISTENER ---

// Menangani pengiriman form (ketika tombol 'Kirim' ditekan atau 'Enter' ditekan)
chatForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah form melakukan submit default
    const prompt = userInput.value.trim();

    if (prompt) {
        sendMessageToGemini(prompt);
    }
});

// Pastikan input fokus saat halaman dimuat
window.onload = () => {
    userInput.focus();
};

// Memuat Bootstrap JS (Opsional, tapi praktik baik)
const bootstrapScript = document.createElement('script');
bootstrapScript.src = '[https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js](https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js)';
bootstrapScript.integrity = 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz';
bootstrapScript.crossOrigin = 'anonymous';
document.head.appendChild(bootstrapScript);
const chatToggleBtn = document.getElementById("chatToggleBtn");
const chatContainer = document.getElementById("chat-container");

chatToggleBtn.addEventListener("click", () => {
    chatContainer.classList.toggle("active");
});
// Tutup chat ketika klik di luar
document.addEventListener("click", (e) => {
    if (!chatContainer.contains(e.target) && !toggleButton.contains(e.target)) {
        chatContainer.classList.remove("active");
    }
});

// Update dashboard statistics
function updateDashboard() {
    const saved = localStorage.getItem('mikrotik-progress');
    if (saved) {
        const completedLessons = JSON.parse(saved);
        const totalLessons = 10;
        const percentage = Math.round((completedLessons.length / totalLessons) * 100);

        document.getElementById('dashboardProgress').textContent = percentage + '%';
        document.getElementById('completedCount').textContent = completedLessons.length;
    }
}

// Run on page load
updateDashboard();

// Update every 2 seconds to catch changes
setInterval(updateDashboard, 2000);