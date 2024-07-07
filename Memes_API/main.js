import './style.css'
// All Global variables and methods.
let apiModal;
let memesfeed;
let nomemesAlert;
let apiKeyForm;
let memeNameForm;
let themeBtn;
let searchBar;
let favouriteMemes;
let url;
let inputWarning;
let themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween",
    "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business",
    "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
]

// calling initialize function whenever DOM first loaded.
document.addEventListener("DOMContentLoaded", initialize);

// Setting all initial code immediately after DOM load.
function initialize() {
    if (window.location.pathname === "/") {
        window.location.replace(`${window.location.origin}/meme?demo=&theme=`);
        return;
    }
    url = new URL(window.location);
    favouriteMemes = document.querySelectorAll(".favourite");
    searchBar = document.querySelector("#searchinput");
    themeBtn = document.querySelectorAll(".theme-btn");
    apiKeyForm = document.querySelector("#setkey");
    memeNameForm = document.querySelector("#setMemeName");
    apiModal = document.querySelector("#apimodal");
    memesfeed = document.querySelector("#memesfeed");
    nomemesAlert = document.querySelector("#nomemes");
    inputWarning = document.querySelector("#inp-warning");
    apiKeyForm.addEventListener('submit', saveApiKey);
    memeNameForm.addEventListener('submit', saveMemesName);
    searchBar.addEventListener("input", searchInput);
    makeThemeBtn();
    showTheme(0);
    getMemes("");
    showFavouriteMemes();
}

// Take input from search input box and call fetch after 1sec.
let callfetch;
function searchInput(e) {
    clearTimeout(callfetch);
    if (e.target.value.length != 0 && e.target.value.length < 3) {
        inputWarning.textContent = `Need ${3 - e.target.value.length} more character`;
    } else {
        inputWarning.textContent = "";
        callfetch = setTimeout(() => {
            getMemes(e.target.value)
        }, 1000)
    }
}

// creating list of theme button and adding click event on them
function makeThemeBtn() {
    themeBtn.forEach((item) => {
        themes.map(theme => {
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.innerText = theme;
            li.appendChild(p);
            item.appendChild(li);
        })
        for (const iterator of item.children) {
            iterator.addEventListener("click", (e) => {
                localStorage.setItem("theme", e.target.innerText);
                showTheme(1);
            });
        }
    })
}

// Displaying theme from url or LocalStorage.
function showTheme(byClicked) {
    let theme = "dark";
    const htmlTag = document.querySelector("html");
    if (byClicked) {
        const themeName = localStorage.getItem("theme");
        url.searchParams.set("theme", themeName);
        theme = themeName;
    } else {
        const initTheme = url.searchParams.get("theme");
        if (initTheme) {
            localStorage.setItem("theme", initTheme);
            theme = initTheme;
        } else {
            theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
        }
        url.searchParams.set("theme", theme);
    }
    history.replaceState(null, '', url);
    htmlTag.attributes["data-theme"].value = theme;
}

// Save a new api key on form submit in localStorage.
function saveApiKey(e) {
    if (e.target.key.value.length > 0) {
        localStorage.setItem("apikey", e.target.key.value);
        e.target.key.value = "";
        getMemes("");
    }
}

// Showing API key modal button when no "apikey" in localStorage.
function showModal() {
    apiModal.textContent = "";
    const h1 = document.createElement("h1");
    const button = document.createElement("button");
    h1.innerText = "You need an API key to get the memes feed.";
    button.setAttribute("class", "btn");
    button.addEventListener("click", () => my_modal_5.showModal());
    button.innerText = "set an API key";
    apiModal.appendChild(h1);
    apiModal.appendChild(button);
    memesfeed.textContent = "";
}

// Getting all memes if apikey is found in localStorage.
async function getMemes(keyword) {
    try {
        let reqUrl = "";
        if (url.searchParams.get("demo")) {
            reqUrl = "db.json";
        } else {
            const apiKey = localStorage.getItem("apikey");
            reqUrl = `https://api.humorapi.com/memes/search?number=10&api-key=${apiKey}&keywords=${keyword}`;
        }
        const res = await fetch(reqUrl);
        if (!res.ok) {
            /* Loop until firstChild of a div is present, and if firstChild is present then remove it. [removing each node inside an element] */
            // while (nomemesAlert.firstChild) {
            //     console.log(nomemesAlert.firstChild);
            //     nomemesAlert.removeChild(nomemesAlert.firstChild)
            // }
            nomemesAlert.textContent = "";
            const p1 = document.createElement("p");
            const p2 = document.createElement("p");
            const a = document.createElement("a");
            p1.setAttribute("class", "font-semibold text-lg");
            p1.innerText = "Unauthorized key or API request reached its limit";
            p2.innerText = "Please try new API key or use mock API ";
            a.setAttribute("class", "underline");
            a.setAttribute("href", `${window.location.origin}/meme?demo=true&theme=`);
            a.innerText = `${window.location.origin}/meme?demo=true&theme=`;
            p2.appendChild(a);
            nomemesAlert.appendChild(p1);
            nomemesAlert.appendChild(p2);
            showModal();
            return;
        }
        const data = await res.json();
        const favourite = localStorage.getItem("favourite");
        memesfeed.textContent = "";
        for (const meme of data.memes) {
            const div = document.createElement("div");
            const i = document.createElement("i");
            const img = document.createElement("img");
            div.setAttribute("class", "w-[100%] h-auto sm:p-[7px] py-[7px] relative hover:scale-[101%] hover:border transition-all meme");
            favourite && JSON.parse(favourite).some(ele => ele.id === `fav-${meme.id}`) ?
                i.setAttribute("class", "material-icons absolute hidden w-[30px] h-[30px] top-2 left-2 text-[#FF3D00] active:scale-75 love")
                :
                i.setAttribute("class", "material-icons absolute hidden w-[30px] h-[30px] top-2 left-2 active:scale-75 love");
            i.setAttribute("id", `fav-${meme.id}`);
            i.textContent = 'favorite';
            img.setAttribute("class", "w-full h-full object-cover align-middle");
            img.setAttribute("alt", `${meme.description}`);
            img.setAttribute("src", `${meme.url}`);
            div.appendChild(i);
            div.appendChild(img);
            memesfeed.appendChild(div);
        }
        apiModal.textContent = "";
        nomemesAlert.textContent = "";
        document.querySelectorAll(".love").forEach(itag => {
            itag.addEventListener("click", (e) => {
                my_modal_6.showModal()
                url.searchParams.set("id", e.target.id);
                url.searchParams.set("img", e.target.nextElementSibling.src);
                url.searchParams.set("name", e.target.nextElementSibling.alt);
                history.replaceState(null, '', url);
            });
        })
    } catch (error) {
        alert(error.message)
    }
}

// Taking user provided name from form and adding that with url state data, and saving it in localStorage by considering further process.
// If no name given then default name from the url will be placed.
function saveMemesName(e) {
    let newMeme = {
        id: url.searchParams.get("id"),
        img: url.searchParams.get("img"),
        name: url.searchParams.get("name")
    }
    if (e.target.memename.value.length > 0) {
        newMeme = { ...newMeme, name: e.target.memename.value }
        e.target.memename.value = "";
    }
    url.searchParams.delete("id")
    url.searchParams.delete("img")
    url.searchParams.delete("name")
    history.replaceState(null, '', url)
    const favourite = localStorage.getItem("favourite");
    if (favourite) {
        const previousItem = JSON.parse(favourite);
        for (const iterator of previousItem) {
            if (iterator.id === newMeme.id) return;
        }
        previousItem.push(newMeme);
        localStorage.setItem("favourite", JSON.stringify(previousItem));
        document.getElementById(`${newMeme.id}`).classList.add("text-[#FF3D00]");
        showFavouriteMemes();
        return;
    }
    localStorage.setItem("favourite", JSON.stringify([newMeme]));
    document.getElementById(`${newMeme.id}`).classList.add("text-[#FF3D00]");
    showFavouriteMemes();
}

// Displaing all the favourite memes from localStorage in favourite List.
function showFavouriteMemes() {
    const favourite = localStorage.getItem("favourite");
    if (favourite) {
        const previousItem = JSON.parse(favourite);
        favouriteMemes.forEach((main) => {
            main.textContent = "";
            for (const iterator of previousItem) {
                const div = document.createElement("div");
                const img = document.createElement("img");
                const p = document.createElement("p");
                const i = document.createElement("i");
                div.setAttribute("class", "w-full h-[60px] flex items-center p-1 gap-2 hover:shadow-md rounded-none border-b-2");
                div.setAttribute("id", `${iterator.id}`);
                img.setAttribute("src", `${iterator.img}`);
                img.setAttribute("alt", "chobi");
                img.setAttribute('class', "border-2 rounded-md object-cover w-[50px] h-full");
                p.setAttribute("class", "overflow-hidden text-lg text-ellipsis whitespace-nowrap text-left w-[170px]");
                i.setAttribute("class", "material-icons h-full flex items-center cursor-pointer active:scale-75 deletememe");
                i.setAttribute("style", "font-size:24px;color: crimson;")
                p.innerText = `${iterator.name}`;
                i.innerText = 'delete';
                div.appendChild(img);
                div.appendChild(p);
                div.appendChild(i);
                main.appendChild(div);
            }
        })

        document.querySelectorAll(".deletememe").forEach((favou) => {
            favou.addEventListener('click', (e) => deleteFavouriteMemes(e.target.parentElement.id));
        })
    }
}

// Deleting favourite meme from list on click and changing corrosponding <i> tag color.
function deleteFavouriteMemes(memeId) {
    const favourite = localStorage.getItem("favourite");
    if (favourite) {
        const previousItem = JSON.parse(favourite);
        const newArray = previousItem.filter((ele) => {
            return ele.id !== memeId;
        })
        localStorage.setItem("favourite", JSON.stringify(newArray));
    }
    showFavouriteMemes();
    document.getElementById(`${memeId}`).classList.remove("text-[#FF3D00]");
}