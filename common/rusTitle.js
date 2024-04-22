function getRusTitle(rusTitle) {
    let EnglishTitle = document.querySelector('h1[data-v-5776f768]');
    let spanRusElement = document.querySelector('.Span-Rus-Title');
    let textSeparator = document.querySelector('.Separate-Texts');

    if (!textSeparator) {
        console.log('Creating text separator.');
        let SeparateTexts = document.createElement('span');
        SeparateTexts.classList.add('Separate-Texts');
        SeparateTexts.textContent = ' • ';

        EnglishTitle.appendChild(SeparateTexts);
    }

    if (spanRusElement) {
        if (spanRusElement.textContent === rusTitle) return;

        console.log('RUS title is not equivalent to the original...');
        spanRusElement.textContent = rusTitle;
    } else {
        console.log('Setting RUS title: ' + rusTitle);

        let SpanRus = document.createElement('span');
        SpanRus.classList.add('Span-Rus-Title');
        SpanRus.textContent = rusTitle;

        document.querySelector('.Separate-Texts').after(SpanRus);
        spanRusElement = SpanRus;
    }
}

async function fetchDataForRelationsAnime(getconfig) {
    const { fetchAnilistData, fetchShikiData, fetchMALData } = (await import("../extras/fetchQuery.js")).default;
    
    const titleLinks = document.querySelectorAll('a.title');
    const titleLinksArray = Array.from(titleLinks);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (const link of titleLinksArray) {
        if (!/\/anime\/\d+\/|\/manga\/\d+\//.test(link)) {
            console.log("This is not a link to an anime/manga page. Skipping...");
            return;
        }

        let anilistScore = null;
        let MALScore = null;
        let shikiScore = null;

        const relativeHref = link.getAttribute('href');
        const baseUrl = window.location.href;
        const absoluteHref = new URL(relativeHref, baseUrl).href;

        const id = absoluteHref.split('/')[4];
        const isAnime = /\/anime\//.test(absoluteHref);

        console.log(absoluteHref, isAnime, id);
        await sleep(200);

        const AnilistFetch = (await fetchAnilistData(id, isAnime));
        if (!AnilistFetch) {
            console.log(`Anilist data fetch failed with error: ${AnilistFetch.errors[0].message}`, AnilistFetch);
            return;
        }
        const anilistData = AnilistFetch.data.Media;
        console.log("Anilist data:", anilistData);
        const malID = anilistData.idMal;

        anilistScore = anilistData.averageScore;
        
        const ShikiFetch = fetchShikiData(malID, isAnime);
        const MALFetch = fetchMALData(malID, isAnime);
        const [ ShikiResponse, MALResponse ] = await Promise.allSettled([ShikiFetch, MALFetch]);

        if (ShikiResponse.status === "fulfilled" && ShikiResponse != null) {
            const calculateAverageScore = (await import("../extras/calculateShikiScore.js")).default;

            const ShikiData = ShikiResponse.value.data[isAnime ? "animes" : "mangas"][0];
            console.log("Shikimori data:", ShikiData);

            if (ShikiData != null) {
                shikiScore = calculateAverageScore(ShikiData.scoresStats).toFixed(2);
                console.log("Calculated Shikimori score: " + shikiScore);
    
                let rusTitle = ShikiData.russian;

                if (rusTitle != null && rusTitle != "") {
                    console.log('Creating text separator.');
                    let SeparateTexts = document.createElement('span');
                    SeparateTexts.classList.add(`Separate-Texts`);
                    SeparateTexts.textContent = ' • ';
                    link.appendChild(SeparateTexts);
    
                    console.log('Setting RUS title: ' + rusTitle);
                    let SpanRus = document.createElement('span');
                    SpanRus.classList.add(`Span-Rus-Title`);
                    SpanRus.textContent = rusTitle;
                    SeparateTexts.after(SpanRus);
                } else {
                    console.log("Fetched russian title is empty!");
                }
            } else {
                console.log("Fetched data from Shikimori is null!");
            }

        } else {
            console.log("Fetching data from Shikimori is failed!");
        }

        if (MALResponse.status === "fulfilled" && MALResponse != null) {
            const MALData = MALResponse.value.data;
            console.log("MAL data:", MALData);

            if (MALData != null) MALScore = MALData.score;
            else console.log("Fetched data from MAL is null!");
        } else {
            console.log("Fetching data from MAL is failed!");
        }

        // score container
        // BUG: I need somehow to move "manga * finished" otherwise the title name would overlay on it because of score container which is too big

        // fix
        //link.parentNode.style.width = '400px';

        /* const createScoreContainer = (await import("./getScore.js")).default;

        let SeparateTexts2 = document.createElement('span');
        SeparateTexts2.classList.add('Separate-Texts');
        SeparateTexts2.textContent = ' · ';
        
        let scoreContainer = await createScoreContainer([anilistScore, MALScore, shikiScore], true, true, getconfig);
        scoreContainer.style.display = 'inline-block';
        SeparateTexts2.appendChild(scoreContainer);
        
        link.parentNode.querySelector('div.info').appendChild(SeparateTexts2); */
    }
}

export default { getRusTitle, fetchDataForRelationsAnime };