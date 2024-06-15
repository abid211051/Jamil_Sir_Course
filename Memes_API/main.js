import './style.css'

// All Global variables and methods
let apiModal;
let memesfeed;
let nomemesAlert;
let apiKeyForm;
let theme;
let themeBtn;

document.addEventListener("DOMContentLoaded", initialize);

// Setting all initial code immediately after DOM load
function initialize() {
    themeBtn = document.querySelectorAll(".theme-btn");
    apiKeyForm = document.querySelector("#setkey");
    apiModal = document.querySelector("#apimodal");
    memesfeed = document.querySelector("#memesfeed");
    nomemesAlert = document.querySelector("#nomemes");
    if (window.location.href === "http://localhost:5173/demo") {
        getMemes(null, "demo")
    } else {
        apiKeyForm.addEventListener('submit', saveApiKey)
        showModal();
    }
    toggleTheme(themeBtn);
    showTheme();
}

// Change theme in localStorage
function toggleTheme(themeBtn) {
    themeBtn.forEach((item) => {
        for (const iterator of item.children) {
            iterator.addEventListener("click", (e) => {
                localStorage.setItem("theme", e.target.innerText);
                showTheme();
            });
        }
    })
}

// Displaying theme from LocalStorage
function showTheme() {
    theme = document.querySelector("html");
    theme.attributes["data-theme"].value = localStorage.getItem("theme");
}

// Save a new api key on form submit in localStorage
function saveApiKey(e) {
    if (e.target.key.value.length > 0) {
        localStorage.setItem("apikey", e.target.key.value);
        showModal();
    }
}

// Showing API key modal button when no "apikey" in localStorage
function showModal() {
    const apiKey = localStorage.getItem("apikey");
    if (apiKey) {
        apiModal.innerHTML = "";
        getMemes(apiKey, null);
    } else {
        apiModal.innerHTML = `
          <h1>You need an API key to get the memes feed.</h1>
          <button class="btn" onclick="my_modal_5.showModal()">open modal</button>
        `;
        memesfeed.innerHTML = "";
    }
}

// Getting all memes if apikey is found in localStorage
async function getMemes(apikey, type) {
    try {
        let url = "";
        if (type) {
            url = "db.json";
        } else {
            url = `https://api.humorapi.com/memes/search?number=10&api-key=${apikey}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
            localStorage.removeItem("apikey");
            nomemesAlert.innerHTML = `
              <p class="font-semibold text-lg">Unauthorized key or API request reached its limit</p>
              <p>Please try new API key or use mock API <a href="http://localhost:5173/demo" class="underline">http://localhost:5173/demo</a></p>
            `;
            showModal();
            return;
        }
        const data = await res.json();
        let memes = "";
        for (const meme of data.memes) {
            memes += `
            <div class="w-[100%] h-auto p-1 relative hover:scale-[102%] transition-all" id="${meme.id}">
                <i class="material-icons absolute hover:cursor-pointer">favorite</i>
                <img src="${meme.url}" alt="" class="w-full h-full object-cover align-middle">
              </div>
            `
        }
        memesfeed.innerHTML = memes;
    } catch (error) {
        console.log(error.message);
    }

}