import './style.css'

// All Global variables and methods.
let apiModal;
let memesfeed;
let nomemesAlert;
let apiKeyForm;
let theme;
let themeBtn;
let searchBar;
let favouriteMemes;

// calling initialize function whenever DOM first loaded.
document.addEventListener("DOMContentLoaded", initialize);

// Setting all initial code immediately after DOM load.
function initialize() {
    favouriteMemes = document.querySelectorAll(".favourite");
    searchBar = document.querySelector("#searchinput");
    themeBtn = document.querySelectorAll(".theme-btn");
    apiKeyForm = document.querySelector("#setkey");
    apiModal = document.querySelector("#apimodal");
    memesfeed = document.querySelector("#memesfeed");
    nomemesAlert = document.querySelector("#nomemes");
    apiKeyForm.addEventListener('submit', saveApiKey)
    searchBar.addEventListener("input", searchInput);
    toggleTheme(themeBtn);
    showTheme();
    getMemes("");
    showFavouriteMemes();
}

// Take input from search input box and call fetch after 2sec.
let callfetch;
function searchInput(e) {
    clearTimeout(callfetch);
    callfetch = setTimeout(() => {
        getMemes(e.target.value)
    }, 2000)
}

// Change theme in localStorage.
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

// Displaying theme from LocalStorage.
function showTheme() {
    theme = document.querySelector("html");
    theme.attributes["data-theme"].value = localStorage.getItem("theme") ? localStorage.getItem("theme") : "light";
}

// Save a new api key on form submit in localStorage.
function saveApiKey(e) {
    if (e.target.key.value.length > 0) {
        localStorage.setItem("apikey", e.target.key.value);
        getMemes("");
    }
}

// Showing API key modal button when no "apikey" in localStorage.
function showModal() {
    apiModal.innerHTML = `
          <h1>You need an API key to get the memes feed.</h1>
          <button class="btn" onclick="my_modal_5.showModal()">open modal</button>
        `;
    memesfeed.innerHTML = "";
}

// Getting all memes if apikey is found in localStorage.
async function getMemes(keyword) {
    try {
        let url = "";
        if (window.location.href === "http://localhost:5173/demo") {
            url = "db.json";
        } else {
            const apiKey = localStorage.getItem("apikey");
            url = `https://api.humorapi.com/memes/search?number=10&api-key=${apiKey}&keywords=${keyword}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
            nomemesAlert.innerHTML = `
              <p class="font-semibold text-lg">Unauthorized key or API request reached its limit</p>
              <p>Please try new API key or use mock API <a href="http://localhost:5173/demo" class="underline">http://localhost:5173/demo</a></p>
            `;
            showModal();
            return;
        }
        const data = await res.json();
        let memes = "";
        const favourite = localStorage.getItem("favourite");
        for (const meme of data.memes) {
            memes += `
            <div class="w-[100%] h-auto p-1 relative hover:scale-[102%] transition-all meme" id="${meme.id}">
            ${favourite && JSON.parse(favourite).some(ele => ele.id === `${meme.id}`) ?
                    `<i class="material-icons absolute hidden w-[30px] h-[30px] top-2 left-2 text-[#FF3D00] active:scale-75 love" id=${meme.id}>favorite</i>`
                    :
                    `<i class="material-icons absolute hidden w-[30px] h-[30px] top-2 left-2 active:scale-75 love" id=${meme.id}>favorite</i>`
                }
                <img src="${meme.url}" alt="${meme.description}" class="w-full h-full object-cover align-middle">
            </div>
            `
        }
        apiModal.innerHTML = "";
        nomemesAlert.innerHTML = "";
        memesfeed.innerHTML = memes;
        document.querySelectorAll(".love").forEach(itag => {
            itag.addEventListener("click", addToFavouriteList);
        })
    } catch (error) {
        alert(error.message)
    }
}

// Adding favourite memes in localStorage on click and changing <i> tag color.
function addToFavouriteList(e) {
    const newData = {
        id: e.target.parentElement.id,
        desc: e.target.nextElementSibling.alt,
        img: e.target.nextElementSibling.src
    }
    e.target.classList.add("text-[#FF3D00]");
    const favourite = localStorage.getItem("favourite");
    if (favourite) {
        const previousItem = JSON.parse(favourite);
        for (const iterator of previousItem) {
            if (iterator.id === e.target.parentElement.id) return;
        }
        previousItem.push(newData);
        localStorage.setItem("favourite", JSON.stringify(previousItem));
        showFavouriteMemes()
        return;
    }
    localStorage.setItem("favourite", JSON.stringify([newData]));
    showFavouriteMemes()
}

// Displaing all the favourite memes from localStorage in favourite List.
function showFavouriteMemes() {
    const favourite = localStorage.getItem("favourite");
    if (favourite) {
        const previousItem = JSON.parse(favourite);
        favouriteMemes.forEach((main) => {
            main.innerHTML = "";
            for (const iterator of previousItem) {
                main.innerHTML += `
                        <div class="w-full h-[60px] flex items-center p-1 gap-2 hover:shadow-md rounded-none border-b-2" id=${iterator.id}>
                            <img src="${iterator.img}" alt="chobi"
                                class="border-2 rounded-md object-cover w-[50px] h-full">
                            <p class="overflow-hidden text-lg text-ellipsis whitespace-nowrap text-left w-[170px]">${iterator.desc}</p>
                            <i class="material-icons h-full flex items-center cursor-pointer active:scale-75 deletememe"
                                style="font-size:24px;color: crimson;">delete</i>
                        </div>
                `
            }
        })

        document.querySelectorAll(".deletememe").forEach((favou) => {
            favou.addEventListener('click', deleteFavouriteMemes);
        })
    }
}

// Deleting favourite meme from list on click and changing corrosponding <i> tag color.
function deleteFavouriteMemes(e) {
    const favourite = localStorage.getItem("favourite");
    if (favourite) {
        const previousItem = JSON.parse(favourite);
        const newArray = previousItem.filter((ele) => {
            return ele.id !== e.target.parentElement.id;
        })
        for (const iterator of document.querySelectorAll(".love")) {
            if (iterator.id === e.target.parentElement.id) {
                iterator.classList.remove("text-[#FF3D00]");
                break;
            }
        }
        localStorage.setItem("favourite", JSON.stringify(newArray));
    }
    showFavouriteMemes();
}