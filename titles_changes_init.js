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
            const { fetchAnilistData, fetchShikiData_V2, fetchMALData } = (await import("./extras/fetchQuery.js")).default;
            const getMediaId = (await import("./extras/getMediaId.js")).default;
            const calculateAverageScore = (await import("./extras/calculateShikiScore.js")).default;

            const AnilistData = (await fetchAnilistData(getMediaId(), isAnime)).data.Media;
            console.log("Anilist data:");
            console.log(AnilistData);

            const malID = AnilistData.idMal;
            const AnilistScore = AnilistData.averageScore;

            const ShikiData = (await fetchShikiData_V2(malID, isAnime)).data[isAnime ? "animes" : "mangas"][0];
            console.log("Shikimori data:");
            console.log(ShikiData);

            const rusName = ShikiData.russian;
            const ShikiScore = calculateAverageScore(ShikiData.scoresStats).toFixed(2);
            console.log("Calculated Shikimori score: " + ShikiScore);

            const MALData = (await fetchMALData(malID, isAnime)).data;
            const MALScore = MALData.score;



            if (!AnilistData || !ShikiData || !MALData) {
                return this.stopRunning();
            }

            this.currentData = malID;
            this.currentDataShiki = rusName;
            this.currentScore = [AnilistScore, MALScore, ShikiScore];
        }

        if (getconfig.russianTitleCheckbox) {
            const getRusTitle = (await import("./common/rusTitle.js")).default;

            getRusTitle(this.currentDataShiki);
        }
        
        if (getconfig.MALlinkCheckbox || getconfig.ShikimoriLinkCheckbox || getconfig.KitsulinkCheckbox) {
            const addLinks = (await import("./common/addLinks.js")).default;

            addLinks(this.currentData, isAnime, getconfig);
        }

        if (getconfig.anilistCheckbox || getconfig.malCheckbox || getconfig.shikimoriCheckbox) {
            const getScore = (await import("./common/getScore.js")).default;

            await getScore(this.currentScore, getconfig);
        }

        return this.stopRunning();
    },

    cleanUp() {
        const elements = $('.MyAnimeList, .Shikimori, .Span-Rus-Title, .scores-container');
        for (const el of elements) el.remove();
        this.currentData = null;
    },
};

const observersLink = new MutationObserver(async () => {
    const page = (await import("./extras/page.js")).default;

    getconfig.init();
    if (page(/^\/(anime|manga)\/\d+\/[\w\d-_]+(\/)?$/)) {
        running.init();
    }

    if (getconfig.HoverEffectCheckbox) {
        const hoverIMG = (await import("./common/hoverImage.js")).default;
        
        hoverIMG();
    }
});

observersLink.observe(document, { childList: true, subtree: true });