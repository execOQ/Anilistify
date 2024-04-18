async function fetchQuery(query, url, variables) {
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
    
    try {
        const response = await fetch(url, options);
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        alert('Anilistify could not fetch the API, check the console for more info.');
        console.error(error);
    }
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

async function fetchAnilistData(a, isAnime = true) {
    let b = isAnime ? 'ANIME' : 'MANGA'

    const url = 'https://graphql.anilist.co';
    const variables = {
        id: a,
        type: b
    };

    let query = `
    query ($id: Int, $type: MediaType) { 
        Media(id: $id, type: $type) {
            idMal
            averageScore
        }
    }
    `;

    return await fetchQuery(query, url, variables);
}

async function fetchShikiData_V2(id, isAnime = true) {
    console.log(id);
    
    const url = 'https://shikimori.one/api/graphql';
    const variables = {
        ids: `${id}`,
    };

    let query = isAnime ? `
    query($ids: String) {
        animes(ids: $ids) {
            id
            malId
            url
            name
            russian
            scoresStats {
                count
                score
            }
        }
    }
    ` : `
    query($ids: String) {
        mangas(ids: $ids) {
            id
            malId
            url
            name
            russian
            scoresStats {
                count
                score
            }
        }
    }
    `;

    return await fetchQuery(query, url, variables);
}

async function fetchShikiData(malID, isAnime) {
    let url = `https://shikimori.me/api/${isAnime ? 'animes' : 'mangas'}/${malID}/`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function fetchMALData(malID, isAnime = true) {
    let url = `https://api.jikan.moe/v4/${isAnime ? 'anime' : 'manga'}/${malID}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data;
}

export default { fetchAnilistData, fetchShikiData_V2, fetchMALData };