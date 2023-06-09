/*
*
* CONTENT SCRIPT
*
*/
'use strict';

const running = {
    lastLocation: window.location.pathname,

    running: false,

    currentData: null,

    stopRunning() {
        this.running = false;
    },

    async init() {
        if (this.running) return;

        this.running = true;

        if (this.lastLocation !== window.location.pathname) {
            this.lastLocation = location.pathname;
            this.cleanUp();
        }

        const isAnime = /^\/anime/.test(location.pathname);

        if (!this.currentData) {
            const malID = (await fetchMALId(getMediaId(), isAnime)).data.Media.idMal;

            if (!malID) {
                return this.stopRunning();
            }
            this.currentData = malID;
        }

        addLinks(this.currentData, isAnime);

        return this.stopRunning();
    },

    cleanUp() {
        const elements = $('.MyAnimeList, .Shikimori');
        for (const el of elements) el.remove();
        this.currentData = null;
    },
};

function getMediaType() {
    let url = window.location.href;
    return url.split('/')[3].toUpperCase();
}


function getMediaId() {
    let url = window.location.href;
    return url.split('/')[4];
}

function fetchQuery(query, url, variables) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };
    
    return fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);

}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleError(error) {
    alert('Anilist+ could not fetch the API, check the console for more info.');
    console.error(error);
}

function handleData(data) {
    return data;
}

function getMALId() {
    return `
    query ($id: Int, $type: MediaType) { 
        Media(id: $id, type: $type) {
          idMal
        }
      }
    `;
}

function fetchMALId(a, isAnime = true) {
    let b = isAnime ? 'ANIME' : 'MANGA'
    const variables = {
        id: a,
        type: b
    };
    const url = 'https://graphql.anilist.co';
    let studioQuery = getMALId();

    return fetchQuery(studioQuery, url, variables);
}
function addLinks(malID, isAnime) {
    let MyAnimeList = $('.MyAnimeList');
    let Shikimori = $('.Shikimori');
    if (MyAnimeList.length || Shikimori.length) return;
    let EnglishTitle = document.querySelector('h1[data-v-5776f768]');
    if (!EnglishTitle) return;

    let DivLinks = document.createElement('div');
    DivLinks.classList.add('Links');
    DivLinks.style.float = "right";

    EnglishTitle.appendChild(DivLinks);

    let malLink = document.createElement('a');
    malLink.classList.add('MyAnimeList');
    malLink.setAttribute('target', '_blank');
    malLink.href = `https://myanimelist.net/${isAnime ? 'anime' : 'manga'}/${malID}/`;

    let malLinkImgContainer = document.createElement('div');
    malLinkImgContainer.classList.add('icon-wrap');
    malLinkImgContainer.style.padding = "0";

    let malLinkImg = document.createElement('img');
    malLinkImg.classList.add('icon');
    malLinkImg.src = 'https://cdn.myanimelist.net/images/favicon.ico';
    malLinkImg.width = '16';

    malLinkImgContainer.append(malLinkImg);
    malLink.append(malLinkImgContainer);

    let shikiLink = document.createElement('a');
    shikiLink.classList.add('Shikimori');
    shikiLink.setAttribute('target', '_blank');
    shikiLink.href = `https://shikimori.me/${isAnime ? 'animes' : 'mangas'}/${malID}/`;

    let shikiLinkImgContainer = document.createElement('div');
    shikiLinkImgContainer.classList.add('icon-wrap');
    shikiLinkImgContainer.style.padding = "0";

    let shikiLinkImg = document.createElement('img');
    shikiLinkImg.classList.add('icon');
    shikiLinkImg.src = 'https://shikimori.me/favicons/favicon-16x16.png';
    shikiLinkImg.width = '16';

    shikiLinkImgContainer.append(shikiLinkImg);
    shikiLink.append(shikiLinkImgContainer);

    DivLinks.append(shikiLink);
    DivLinks.append(malLink);
}

function page(regex, href = false) {
    return regex.test(href ? window.location.href : window.location.pathname);
}

const observersLink = new MutationObserver(() => {
    if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/)) {
        running.init();
    }
});

observersLink.observe(document, { childList: true, subtree: true });