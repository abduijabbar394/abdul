const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const convertBtn = document.getElementById('convert-btn');
const errorMessage = document.getElementById('error-message');
const loadingState = document.getElementById('loading-state');
const resultArea = document.getElementById('result-area');
const resultText = document.getElementById('result-text');
const toast = document.getElementById('toast');

let selectedFile = null;

// Allow valid audio extensions
const validExtensions = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/aac', 'audio/ogg'];

// API URL (Assumes server runs on localhost:8000. In production, change this)
const API_URL = "http://127.0.0.1:8000/transcribe";

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop area
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('dragover');
}

function unhighlight() {
    dropArea.classList.remove('dragover');
}

// Handle dropped files
dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
});

// Handle file input change
fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    hideError();
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Check if the file is an audio file
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
        showError("দয়া করে একটি সঠিক মান সম্পন্ন অডিও ফাইল আপলোড করুন (mp3, wav, m4a, ইত্যাদি)।");
        return;
    }
    
    // Limit to 25MB (optional)
    if (file.size > 25 * 1024 * 1024) {
        showError("ফাইলের সাইজ ২৫ মেগাবাইটের বেশি হওয়া যাবে না।");
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    
    // UI Update
    dropArea.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    resultArea.classList.add('hidden');
    
    // Enable button
    convertBtn.classList.remove('disabled');
}

function removeFile() {
    selectedFile = null;
    fileInput.value = '';
    
    // UI Update
    fileInfo.classList.add('hidden');
    dropArea.classList.remove('hidden');
    convertBtn.classList.add('disabled');
    resultArea.classList.add('hidden');
    hideError();
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

async function convertAudio() {
    if (!selectedFile || convertBtn.classList.contains('disabled')) return;
    
    // Setup UI for loading
    hideError();
    convertBtn.classList.add('hidden');
    loadingState.classList.remove('hidden');
    resultArea.classList.add('hidden');
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            resultText.textContent = data.text;
            if(!data.text.trim()) {
                resultText.innerHTML = "<em>(কোনো কথা বোঝা যায়নি)</em>";
            }
            // Show result
            loadingState.classList.add('hidden');
            resultArea.classList.remove('hidden');
            convertBtn.classList.remove('hidden');
            convertBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> আবার রূপান্তর করুন';
            
            // Save to history (optional)
            saveToHistory(selectedFile.name, data.text);
        } else {
            throw new Error(data.detail || "রূপান্তর করতে সমস্যা হয়েছে।");
        }
    } catch (error) {
        let msg = "সার্ভারের সাথে সংযোগ করা সম্ভব হয়নি। ব্যাকএন্ড চলছে কিনা যাচাই করুন।";
        if(error.message !== "Failed to fetch") {
            msg = error.message;
        }
        showError(msg);
        loadingState.classList.add('hidden');
        convertBtn.classList.remove('hidden');
    }
}

// Copy Text
function copyText() {
    const text = resultText.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("টেক্সট কপি করা হয়েছে!");
    }).catch(err => {
        showError("কপি করতে সমস্যা হয়েছে।");
    });
}

// Download Text
function downloadText() {
    const text = resultText.innerText;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    a.href = url;
    let baseName = selectedFile ? selectedFile.name.split('.')[0] : "audio";
    a.download = baseName + "_transcription.txt";
    
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

// Toast notification
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// History Handling (Optional but requested)
function saveToHistory(filename, text) {
    let history = JSON.parse(localStorage.getItem('audioTextHistory') || '[]');
    history.unshift({
        filename,
        text,
        date: new Date().toISOString()
    });
    // Keep only last 10
    if(history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('audioTextHistory', JSON.stringify(history));
}
