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

    currentDataShiki: null,

    currentScore: null,

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

        if (!this.currentData || !this.currentDataShiki || !this.currentScore) {
            const AnilistData = await fetchMALId(getMediaId(), isAnime);
            const malID = AnilistData.data.Media.idMal;
            const AnilistScore = AnilistData.data.Media.averageScore;

            const ShikiData = await getShikiId(malID, isAnime);
            const ShikiID = ShikiData.russian;
            const ShikiScore = ShikiData.score;

            const MALData = await getMalData(malID, isAnime);
            const MALScore = MALData.data.score;



            if (!AnilistData || !ShikiData || !MALData) {
                return this.stopRunning();
            }

            this.currentData = malID;
            this.currentDataShiki = ShikiID;
            this.currentScore = [AnilistScore, MALScore, ShikiScore];
        }


        getRusTitle(this.currentDataShiki);
        addLinks(this.currentData, isAnime);
        getScore(this.currentScore);

        return this.stopRunning();
    },

    cleanUp() {
        const elements = $('.MyAnimeList, .Shikimori, .Span-Rus-Title, .scores-container');
        for (const el of elements) el.remove();
        this.currentData = null;
    },
};

function getShikiId(malID, isAnime) {
    let url = `https://shikimori.me/api/${isAnime ? 'animes' : 'mangas'}/${malID}/`;
    return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data;
    });
}

function getMalData(malID, isAnime = true) {
    let url = `https://api.jikan.moe/v4/${isAnime ? 'anime' : 'manga'}/${malID}`;
    return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data;
    });
}

function getMediaType() {
    let url = window.location.href;
    return url.split('/')[3].toUpperCase();
}


function getMediaId() {
    let url = window.location.href;
    return url.split('/')[4];
}

function request(options) {
    return new Promise((resolve, reject) => {
        options.onload = res => resolve(res);
        options.onerror = err => reject(err);
        options.ontimeout = err => reject(err);
    });
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
          averageScore
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

function getRusTitle(rusTitle) {
    let spanRusElement = document.querySelector('.Span-Rus-Title');

    console.log('данные получены');

    let EnglishTitle = document.querySelector('h1[data-v-5776f768]');

    if (spanRusElement) { // Проверка, существует ли элемент
        console.log('проверка на существование элемента');
        if (spanRusElement.textContent === rusTitle) {
            console.log('проверка на совпадение');
            return;
        }
        console.log('проверка на совпадение не прошла');
        let parts = spanRusElement.textContent;
        parts = rusTitle;
    } else {
        console.log('создание элемента');
        let SeparateTexts = document.createElement('span');
        SeparateTexts.classList.add('Separate-Texts');
        SeparateTexts.textContent = ' / ';

        let SpanRus = document.createElement('span');
        SpanRus.classList.add('Span-Rus-Title');
        SpanRus.textContent = rusTitle;

        EnglishTitle.appendChild(SeparateTexts);
        EnglishTitle.appendChild(SpanRus);
        spanRusElement = SpanRus; // Присваиваем переменной ссылку на созданный элемент
    }
}

function getScore(scores) {
    let Anilist = $('.AnilistScore');
    let MyAnimeList = $('.MALScore');
    let Shikimori = $('.ShikiScore'); 
    
    if (MyAnimeList.length || Shikimori.length || Anilist.length) return;
    let EnglishTitle = document.querySelector('p[data-v-5776f768]');
    if (!EnglishTitle) return;

    let newNode = document.createElement('div');
    newNode.classList.add('scores-container');
    newNode.style.marginTop = "10px";
  
    let AnilistScore = document.createElement('span');
    AnilistScore.classList.add('AnilistScore', 'span-score');
    AnilistScore.textContent = 'Anilist: ' + scores[0];

    let MALScore = document.createElement('span');
    MALScore.classList.add('MALScore', 'span-score');
    MALScore.style.marginLeft = "10px";
    MALScore.textContent = scores[1] + ' ' + 'on MyAnimeList';
  
    let ShikiScore = document.createElement('span');
    ShikiScore.classList.add('ShikiScore', 'span-score');
    ShikiScore.style.marginLeft = "10px";
    ShikiScore.textContent = scores[2] + ' ' + 'on Shikimori';
  
    newNode.appendChild(AnilistScore);
    newNode.appendChild(MALScore);
    newNode.appendChild(ShikiScore);
  
    EnglishTitle.parentNode.insertBefore(newNode, EnglishTitle);
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
    malLink.style.float = "right";

    let malLinkImgContainer = document.createElement('div');
    malLinkImgContainer.classList.add('icon-wrap');
    malLinkImgContainer.style.padding = "0";
    malLinkImgContainer.style.margin = "0 5px";

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
    shikiLink.style.float = "right";

    let shikiLinkImgContainer = document.createElement('div');
    shikiLinkImgContainer.classList.add('icon-wrap');
    shikiLinkImgContainer.style.padding = "0";
    shikiLinkImgContainer.style.margin = "0 5px";

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