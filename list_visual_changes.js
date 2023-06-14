/*
*
* CONTENT SCRIPT
*
*/
'use strict';
  


const svg = {
    /** from AniList */
    smile:
      '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="smile" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-green))" class="icon svg-inline--fa fa-smile fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" class=""></path></svg>',
    /** from AniList */
    straight:
      '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="meh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-orange))" class="icon svg-inline--fa fa-meh fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z" class=""></path></svg>',
    /** from AniList */
    frown:
      '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="frown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="rgb(var(--color-red))" class="icon svg-inline--fa fa-frown fa-w-16"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z" class=""></path></svg>',
    /**  From https://github.com/SamHerbert/SVG-Loaders */
    // License/accreditation https://github.com/SamHerbert/SVG-Loaders/blob/master/LICENSE.md
    loading:
      '<svg width="60" height="8" viewbox="0 0 130 32" style="fill: rgb(var(--color-text-light, 80%, 80%, 80%))" xmlns="http://www.w3.org/2000/svg" fill="#fff"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="60" cy="15" r="9" fill-opacity=".3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from=".5" to=".5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"/></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/></circle></svg>',
};

const getconfig = {
    LinksCheckbox: null,
    
    MALlinkCheckbox: null,

    ShikimoriLinkCheckbox: null,

    KitsulinkCheckbox: null,

    russianTitleCheckbox: null,

    scoreHeaderCheckbox: null,

    anilistCheckbox: null,

    malCheckbox: null,

    shikimoriCheckbox: null,


    async init() {
        const self = this; // Сохраняем ссылку на объект getconfig
    
        chrome.storage.sync.get(
            ['Links', 'MALlink', 'ShikimoriLink', 'KitsuLink', 'russianTitle', 'scoreHeader', 'anilist', 'anilistIcon', 'mal', 'shikimori'],
            function (result) {
                self.LinksCheckbox = result.Links;
                self.MALlinkCheckbox = result.MALlink;
                self.ShikimoriLinkCheckbox = result.ShikimoriLink;
                self.KitsulinkCheckbox = result.KitsuLink;

                self.russianTitleCheckbox = result.russianTitle;

                self.scoreHeaderCheckbox = result.scoreHeader;
                self.anilistCheckbox = result.anilist;
                self.anilistIcon = result.anilistIcon;
                self.malCheckbox = result.mal;
                self.shikimoriCheckbox = result.shikimori;
            }
        );
    }
}

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

        if (getconfig.russianTitleCheckbox) {
            getRusTitle(this.currentDataShiki);
        }
        
        if (getconfig.LinksCheckbox && (getconfig.MALlinkCheckbox || getconfig.ShikimoriLinkCheckbox || getconfig.KitsulinkCheckbox)) {
            addLinks(this.currentData, isAnime);
        }

        if (getconfig.anilistCheckbox || getconfig.malCheckbox || getconfig.shikimoriCheckbox) {
            getScore(this.currentScore);
        }

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

    let EnglishTitle = document.querySelector('p[data-v-5776f768]');
    let Sidebar = document.querySelector('.rankings');
    
    if (MyAnimeList.length || Shikimori.length || Anilist.length) return;
    if (!EnglishTitle || !Sidebar) return;

    let newNode = document.createElement('div');
    newNode.classList.add('scores-container');

    if (getconfig.scoreHeaderCheckbox === 'Sidebar') {
        let typeDiv = document.createElement('div');
        typeDiv.textContent = 'Scores';
        typeDiv.style.fontSize = '1.3rem';
        typeDiv.style.fontWeight = '500';
        typeDiv.style.paddingBottom = '5px';
        newNode.appendChild(typeDiv);
    }

    let AnilistDiv = document.createElement('div');
    AnilistDiv.classList.add('Anilist-Container');

    let AnilistScore = document.createElement('span');
    AnilistScore.classList.add('AnilistScore', 'span-score');
    if (scores[0] === null || scores[0] == undefined) {
        AnilistScore.textContent = 'No score on AniList';
    }

    if (getconfig.anilistIcon) {
        let iconMarkup;

        if (scores[0] === null || scores[0] == undefined) {
            iconMarkup = svg.straight;
        } else if (scores[0] >= 75) {
            iconMarkup = svg.smile;
        } else if (scores[0] >= 60) {
            iconMarkup = svg.straight;
        } else {
            iconMarkup = svg.frown;
        }

        let iconSpan = document.createElement('span');
        iconSpan.classList.add('icon-score');
        iconSpan.innerHTML = iconMarkup + ' ';

        AnilistDiv.appendChild(iconSpan);

        AnilistScore.textContent = scores[0] + '%';
    } else {
        AnilistScore.textContent = scores[0] + '% on AniList';
    }

    AnilistDiv.appendChild(AnilistScore);


    let MALScore = document.createElement('span');
    MALScore.classList.add('MALScore', 'span-score');
    if (scores[1] === null || scores[1] == undefined) {
        MALScore.textContent = 'No score on MyAnimeList';
    }
    MALScore.textContent = scores[1] + ' ' + 'on MyAnimeList';

  
    let ShikiScore = document.createElement('span');
    ShikiScore.classList.add('ShikiScore', 'span-score');
    if (scores[2] === null || scores[2] == undefined || scores[2] === '0.0') {
        ShikiScore.textContent = 'No score on Shikimori';
    }
    ShikiScore.textContent = scores[2] + ' ' + 'on Shikimori';


    if (getconfig.anilistCheckbox) {
        newNode.appendChild(AnilistDiv);
    }

    if (getconfig.malCheckbox) {
        newNode.appendChild(MALScore);
    }

    if (getconfig.shikimoriCheckbox) {
        newNode.appendChild(ShikiScore);
    }



    if (getconfig.scoreHeaderCheckbox === 'Header') {  
        newNode.style.marginTop = "10px";

        AnilistDiv.style.display = "inline-block";

        MALScore.style.marginLeft = "10px";
        ShikiScore.style.marginLeft = "10px";

        EnglishTitle.parentNode.insertBefore(newNode, EnglishTitle);
    }
    
    if (getconfig.scoreHeaderCheckbox === 'Sidebar') {
        newNode.style.marginBottom = "16px";
        newNode.style.background = "rgb(var(--color-foreground))";
        newNode.style.borderRadius = "3px";
        newNode.style.display = "block";
        newNode.style.padding = "18px";
        newNode.style.width = "100%";
        

        AnilistDiv.style.display = "block";
        AnilistDiv.style.marginBottom = "5px";
        MALScore.style.display = "block";
        MALScore.style.marginBottom = "5px";
        ShikiScore.style.display = "block";

        AnilistScore.style.fontSize = "1.2rem";
        MALScore.style.fontSize = "1.2rem";
        ShikiScore.style.fontSize = "1.2rem";
        

        Sidebar.parentNode.insertBefore(newNode, Sidebar);
    }
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
    
    if (getconfig.ShikimoriLinkCheckbox) {
        DivLinks.append(shikiLink);
    }

    if (getconfig.MALlinkCheckbox) {
        DivLinks.append(malLink);
    }

    if (getconfig.KitsulinkCheckbox) {
        console.log('Kitsu link is not implemented yet');
    }
}

function page(regex, href = false) {
    return regex.test(href ? window.location.href : window.location.pathname);
}

const observersLink = new MutationObserver(() => {
    getconfig.init();
    if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/)) {
        running.init();
    }
});

observersLink.observe(document, { childList: true, subtree: true });