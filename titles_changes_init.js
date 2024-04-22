/*
*
* CONTENT SCRIPT
*
*/
'use strict';

const getconfig = {
    HoverEffectCheckbox: null,

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
            ['HoverEffect', 'MALlink', 'ShikimoriLink', 'KitsuLink', 'russianTitle', 'scoreHeader', 'anilist', 'anilistIcon', 'mal', 'shikimori'],
            function (result) {
                self.HoverEffectCheckbox = result.HoverEffect;

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

    first: true,

    currentData: null,

    russianTitle: null,

    currentScore: null,

    async init() {
        console.log(this.first, this.lastLocation, location.pathname)
        if (this.lastLocation !== window.location.pathname) {
            this.first = true;
            this.lastLocation = window.location.pathname;
            this.cleanUp();
        }

        if (this.first == false) return;

        this.first = false;

        const isAnime = /^\/anime/.test(location.pathname);

        const { fetchAnilistData, fetchShikiData, fetchMALData } = (await import("./extras/fetchQuery.js")).default;
        const getMediaId = (await import("./extras/getMediaId.js")).default;
        const calculateAverageScore = (await import("./extras/calculateShikiScore.js")).default;
        const {fetchDataForRelationsAnime} = (await import("./common/rusTitle.js")).default;

        let AnilistScore = null;
        let MALScore = null;
        let ShikiScore = null;

        const AnilistFetch = (await fetchAnilistData(getMediaId(), isAnime));
        if (!AnilistFetch) {
            return this.stopRunning();
        }

        const AnilistData = AnilistFetch.data.Media;
        console.log("Anilist data:", AnilistData);

        AnilistScore = AnilistData.averageScore;
        const malID = AnilistData.idMal;

        if (getconfig.MALlinkCheckbox || getconfig.ShikimoriLinkCheckbox || getconfig.KitsulinkCheckbox) {
            const {addLinks} = (await import("./common/addLinks.js")).default;
            
            addLinks(malID, isAnime, getconfig);
        }

        const ShikiFetch = fetchShikiData(malID, isAnime);
        const MALFetch = fetchMALData(malID, isAnime);
        const [ ShikiResponse, MALResponse ] = await Promise.allSettled([ShikiFetch, MALFetch]);

        if (ShikiResponse.status === "fulfilled") {
            const ShikiData = ShikiResponse.value.data[isAnime ? "animes" : "mangas"][0];
            console.log("Shikimori data:", ShikiData);

            ShikiScore = calculateAverageScore(ShikiData.scoresStats).toFixed(2);
            console.log("Calculated Shikimori score: " + ShikiScore);

            this.russianTitle = ShikiData.russian;
        } else {
            console.log("Fetching data from Shikimori is failed!");
        }

        if (MALResponse.status === "fulfilled") {
            const MALData = MALResponse.value.data;
            console.log("MAL data:", MALData);

            MALScore = MALData.score;
        } else {
            console.log("Fetching data from MAL is failed!");
        }

        fetchDataForRelationsAnime(getconfig);

        this.currentData = malID;
        this.currentScore = [AnilistScore, MALScore, ShikiScore];
        

        // TODO: сделать проверки, что есть данные и в случае чего выдавать ошибку, но не прерывать другие фишки
        if (getconfig.russianTitleCheckbox && this.russianTitle != null) {
            const { getRusTitle } = (await import("./common/rusTitle.js")).default;

            getRusTitle(this.russianTitle);
        }

        if (getconfig.anilistCheckbox || getconfig.malCheckbox || getconfig.shikimoriCheckbox) {
            const createScoreContainer = (await import("./common/getScore.js")).default;

            let isInHeader = getconfig.scoreHeaderCheckbox === 'Header' ? true : false;
            let place = document.querySelector(getconfig.scoreHeaderCheckbox === 'Header' ? 'h1[data-v-5776f768]' : '.rankings');
            if (!place) return;
            if (place.parentNode.querySelector(`.scores-container`)) {
                console.log("Score header already exists!");
                return;
            }

            let scoreContainer = await createScoreContainer(this.currentScore, false, isInHeader, getconfig);
            place.after(scoreContainer, place.nextSibling);
        }
    },

    cleanUp() {
        let actions = document.querySelector('.actions');
        actions.style.display = 'grid';

        let favoriteButton = document.querySelector('.favourite');
        actions.appendChild(favoriteButton.parentNode.removeChild(favoriteButton));

        const elements = $('.Span-Rus-Title, .scores-container, .Links, .Separate-Texts');
        for (const el of elements) el.remove();
        this.currentData = null;
    },
};

const observersLink = new MutationObserver(async () => {
    const { page } = (await import("./extras/general.js"));

    getconfig.init();
    if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/)) {
        const { waitForPageToBeVisible } = (await import("./extras/general.js"));
        await waitForPageToBeVisible();

        running.init();
    }

    if (getconfig.HoverEffectCheckbox) {
        const hoverIMG = (await import("./common/hoverImage.js")).default;
        
        hoverIMG();
    }
});

observersLink.observe(document, { childList: true, subtree: true });