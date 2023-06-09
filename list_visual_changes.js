/*
*
* CONTENT SCRIPT
*
*/
'use strict';

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

function fetchMALId(a, b) {
    const variables = {
        id: a,
        type: b
    };
    const url = 'https://graphql.anilist.co';
    let studioQuery = getMALId();

    return fetchQuery(studioQuery, url, variables);
}

function GetLinks(idMalValue) {
    let Links = new Array();

    if (getMediaType() === 'ANIME') {
        console.log('https://shikimori.me/animes/' + idMalValue);
        Links['Shiki'] = 'https://shikimori.me/animes/' + idMalValue;

        console.log('https://myanimelist.net/anime/' + idMalValue);
        Links['MAL'] = 'https://myanimelist.net/anime/' + idMalValue;
    } else {
        console.log('https://shikimori.me/mangas/' + idMalValue);
        Links['Shiki'] = 'https://shikimori.me/mangas/' + idMalValue;

        console.log('https://myanimelist.net/manga/' + idMalValue);
        Links['MAL'] = 'https://myanimelist.net/manga/' + idMalValue;
    }
    return Links;
}

function addLinks() {
    let LinksToOtherSites = document.querySelector('.Links');

    fetchMALId(getMediaId(), getMediaType())
    .then((res) => {
        let idMalValue = res.data.Media.idMal;

        let data = GetLinks(idMalValue)

        alert('test2');
        let EnglishTitle = document.querySelector('h1[data-v-5776f768]');

        if (LinksToOtherSites && LinksToOtherSites.textContent.split("/")[1] === rusTitle) {
            console.log('проверка на совпадение');
            return;
        }

        console.log('создание элемента');

        let DivLinks = document.createElement('div');
        DivLinks.classList.add('.Links');
        DivLinks.style = "float: right";

        let MALlink = document.createElement('a');

        MALlink.classList.add('.link');
        MALlink.href = data['MAL'];

        let Shikilink = document.createElement('a');
        Shikilink.classList.add('.link');
        Shikilink.href = data['Shiki'];

        let Shikiimg = document.createElement('img');
        Shikiimg.src = "https://shikimori.me/favicons/favicon-16x16.png";
        Shikiimg.width = "16";
        Shikiimg.style = "margin-left: 5px;";

        let MALimg = document.createElement('img');
        MALimg.src = "https://cdn.myanimelist.net/images/favicon.ico";
        MALimg.width = "16";


        alert('test1');

        EnglishTitle.appendChild(DivLinks);

        DivLinks.appendChild(MALlink);
        DivLinks.appendChild(Shikilink);

        MALlink.appendChild(MALimg);
        Shikilink.appendChild(Shikiimg);

        LinksToOtherSites = DivLinks;
    })
}


const observersLink = new MutationObserver(() => {
    let urlNext2 = window.location.href;

    // запуск функции при обновлении страницы, так как видимо anilist не обновляет страницу при переходе по ссылкам
    window.onload = function() { 
        if (urlNext2.includes('/anime/') || urlNext2.includes('/manga/')) {
            addLinks();

            urlPrev2 = urlNext2;
        }
    };
    // проверка, что ссылка не совпадает с предыдущей. Нужно для того, чтобы observe не запускал функцию несколько раз на одной странице
    if (urlPrev2 === urlNext2) return;

    // проверка, что ссылка ведет на страницу аниме или манги. Если не одна проверка не прошла
    if (urlNext2.includes('/anime/') || urlNext2.includes('/manga/')) {
        addLinks();

        urlPrev2 = urlNext2;
    }
});

let urlPrev2 = window.location.href;

observersLink.observe(document, { childList: true, subtree: true });
