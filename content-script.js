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

function fetchMALId(a, b) {
    const variables = {
        id: a,
        type: b
    };
    const url = 'https://graphql.anilist.co';
    let studioQuery = getMALId();

    return fetchQuery(studioQuery, url, variables);
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

function getShikiId(idMalValue) {
    if (getMediaType() === 'ANIME') {
        console.log('https://shikimori.me/api/animes/' + idMalValue);
        return 'https://shikimori.me/api/animes/' + idMalValue;
    } else {
        console.log('https://shikimori.me/api/mangas/' + idMalValue);
        return 'https://shikimori.me/api/mangas/' + idMalValue;
    }
}

function getRusTitle() {
    let spanRusElement = document.querySelector('.Span-Rus-Title');
    fetchMALId(getMediaId(), getMediaType())
    .then((res) => {
        let idMalValue = res.data.Media.idMal;

        fetch(getShikiId(idMalValue))
        .then(response => response.json())
        .then(data => {
            console.log('данные получены');
            // do something with data
            console.log(data);
            let rusTitle = data.russian;

            let EnglishTitle = document.querySelector('h1[data-v-5776f768]');

            /* 
            let EnglishTitle = document.querySelector('h1[data-v-5776f768]').innerHTML;

            if (EnglishTitle.indexOf("/") !== -1) {
                return;
            }
            document.querySelector('h1[data-v-5776f768]').innerHTML = EnglishTitle + ' / ' + rusTitle; 
            */
            if (spanRusElement) { // Проверка, существует ли элемент
                console.log('проверка на существование элемента');
                if (spanRusElement.textContent.split("/")[1] === rusTitle) {
                    console.log('проверка на совпадение');
                    return;
                }
                console.log('проверка на совпадение не прошла');
                let parts = spanRusElement.textContent.split("/");
                parts[1] = rusTitle;
                spanRusElement.textContent = parts.join("/");
            } else {
                console.log('создание элемента');
                let SpanRus = document.createElement('span');
                SpanRus.classList.add('Span-Rus-Title');
                SpanRus.textContent = '/' + rusTitle;
                EnglishTitle.appendChild(SpanRus);
                spanRusElement = SpanRus; // Присваиваем переменной ссылку на созданный элемент
            }
        })
        .catch(error => {
            // handle error
            console.log('ошибка');
            console.error(error);
    });
    })

}



function page(regex, href = false) {
    return regex.test(href ? window.location.href : window.location.pathname);
}

const observers = new MutationObserver(() => {
    let urlNext = window.location.href;

    // запуск функции при обновлении страницы, так как видимо anilist не обновляет страницу при переходе по ссылкам
    window.onload = function() { 
        // same as window.addEventListener('load', (event) => {
        if (urlNext.includes('/anime/') || urlNext.includes('/manga/')) {
            getRusTitle();
            /* if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/)) {
                getRusTitle();
            } */
            urlPrev = urlNext;
        }
    };
    // проверка, что ссылка не совпадает с предыдущей. Нужно для того, чтобы observe не запускал функцию несколько раз на одной странице
    if (urlPrev === urlNext) return;
    //if (window.location.hostname === 'anilist.co') {

    // проверка, что ссылка ведет на страницу аниме или манги. Если не одна проверка не прошла
    if (urlNext.includes('/anime/') || urlNext.includes('/manga/')) {
        getRusTitle();
        /* if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/)) {
            getRusTitle();
        } */
        urlPrev = urlNext;
    }
});

let urlPrev = window.location.href;
observers.observe(document, { childList: true, subtree: true });
