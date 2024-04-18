export const getconfig = {
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