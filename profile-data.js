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

    InfocreatedCheckbox: null,

    InfoupdatedCheckbox: null,


    async init() {
        const self = this; // Сохраняем ссылку на объект getconfig
    
        chrome.storage.sync.get(
            ['Links', 'MALlink', 'ShikimoriLink', 'KitsuLink', 'russianTitle', 'scoreHeader', 'anilist', 'anilistIcon', 'mal', 'shikimori', 'Infocreated', 'Infoupdated'],
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

                self.InfocreatedCheckbox = result.Infocreated;
                self.InfoupdatedCheckbox = result.Infoupdated;

            }
        );
    }
}

const running = {
    lastLocation: window.location.pathname,

    running: false,

    runningProfile: false,

    currentData: null,

    currentDataShiki: null,

    currentScore: null,

    currentProfileData: null,


    stopRunningProfile() {
        this.runningProfile = false;
    },

    cleanUpProfile() {
        const elements = $('.CreatedAt, .UpdatedAt');
        for (const el of elements) el.remove();
        this.currentProfileData = null;
    },

    async profile() {

        if (this.runningProfile) return;

        this.runningProfile = true;

        if (this.lastLocation !== window.location.pathname) {
            console.log('last location not same');
            this.lastLocation = location.pathname;
            this.cleanUpProfile();
        }

        if (!this.currentProfileData) {
            console.log('current profile data not exists');
            const ProfileData = await fetchProfileData(getMediaId());
            const data = ProfileData.data.User.createdAt;
            const createdAt = ProfileData.data.User.updatedAt;

            if (!ProfileData) {
                return this.stopRunning();
            }

            this.currentProfileData = [data, createdAt];
        }

        if (getconfig.InfocreatedCheckbox || getconfig.InfoupdatedCheckbox) {
            console.log(this.currentProfileData);
            AddProfileDetails(this.currentProfileData)
        }


        return this.stopRunning();
    }
};

function getProfileData() {
    return `
    query ($name: String) {
        User(name: $name) {
            createdAt
            updatedAt
        }
    }   
    `;
}

function fetchProfileData(name) {
    const variables = {
        name: name
    };
    const url = 'https://graphql.anilist.co';
    let studioQuery = getProfileData();

    return fetchQuery(studioQuery, url, variables);
}

function AddProfileDetails(userID) {
    console.log('AddProfileDetails');

    let ProfileName = $('.nav-wrap');

    let CreatedAtExists = $('.CreatedAt');
    let UpdatedAtExists = $('.UpdatedAt');

    let createdAt = timeConverter(userID[0]);
    let updatedAt = timeConverter(userID[1]);

    let DataDiv = document.createElement('div');

    if (getconfig.InfocreatedCheckbox) {
        if (typeof(CreatedAtExists) == 'undefined' && CreatedAtExists == null) {
            if (CreatedAtExists === createdAt) {
                console.log('created at same');
                return;
            } 
            if (CreatedAtExists !== createdAt) {
                console.log('created at not same');
                CreatedAtExists = 'Created at: ' + createdAt;
            }
        } else {
            console.log('created at not exists');
            let CreatedAt = document.createElement('span');

            CreatedAt.classList.add('CreatedAt');
            CreatedAt.textContent = 'Created at: ' + createdAt;

            CreatedAt.style.fontSize = '1.2rem';
            CreatedAt.style.marginLeft = '10px';
            CreatedAt.style.background = "rgb(var(--color-foreground))";
            CreatedAt.style.borderRadius = "3px";
            CreatedAt.style.padding = "4px";

            DataDiv.appendChild(CreatedAt);
        }
    }


    if (getconfig.InfoupdatedCheckbox) {
        if (typeof(UpdatedAtExists) == 'undefined' && UpdatedAtExists == null) {
            if (UpdatedAtExists === updatedAt) {
                console.log("updated at exists");
                return;
            }
            if (UpdatedAtExists !== updatedAt) {
                console.log("updated at not same");
                UpdatedAtExists = 'Updated at: ' + updatedAt;
            }
        } else {
            console.log("updated at not exists");
            let UpdatedAt = document.createElement('span');

            UpdatedAt.classList.add('UpdatedAt');
            UpdatedAt.textContent = 'Updated at: ' + updatedAt;
            UpdatedAt.style.fontSize = '1.2rem';
            UpdatedAt.style.marginLeft = '10px';
            UpdatedAt.style.background = "rgb(var(--color-foreground))";
            UpdatedAt.style.borderRadius = "3px";
            UpdatedAt.style.padding = "4px";

            DataDiv.appendChild(UpdatedAt);
        }
    }

    console.log(ProfileName);
    console.log('creating div');
    ProfileName.appendChild(DataDiv);
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

const observersLink = new MutationObserver(() => {
    getconfig.init();
    if (page(/\/user\/\w+\/?$/i)) {
        running.profile();
    }
});

observersLink.observe(document, { childList: true, subtree: true });