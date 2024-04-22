const linkStyle = {
    alignItems: 'center',
    background: 'rgb(var(--color-red-400))',
    borderRadius: '5px',
    color: 'rgb(var(--color-white))',
    cursor: 'none', // 'pointer' when link is setted
    filter: 'grayscale(100%)', // 'none' when link is setted
    display: 'flex',
    fontSize: '1.4rem',
    fontFamily: 'Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    fontWeight: '800',
    height: '35px',
    justifyContent: 'center',
    transition: '.2s',
};

function createLinkDiv(iconUrl) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');

    Object.assign(link.style, linkStyle);

    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-wrap');
    iconContainer.style.padding = "0";
    iconContainer.style.margin = "0 5px";

    const icon = document.createElement('img');
    icon.classList.add('icon');
    icon.src = iconUrl;
    icon.width = '16';

    iconContainer.appendChild(icon);
    link.appendChild(iconContainer);

    return link;
}

function updateLinks(malID, isAnime) {
    let MyAnimeList = $('.MyAnimeList');
    let Shikimori = $('.Shikimori');

    if (malID && isAnime) { 
        if (MyAnimeList.length) {
            MyAnimeList.style.cursor = "pointer";
            MyAnimeList.style.filter = "none";
            MyAnimeList.href = `https://myanimelist.net/${isAnime ? 'anime' : 'manga'}/${malID}/`;
        }
        if (Shikimori.length) {
            Shikimori.style.cursor = "pointer";
            Shikimori.style.filter = "none";
            Shikimori.href = `https://shikimori.me/${isAnime ? 'animes' : 'mangas'}/${malID}/`;
        }
    } else {
        if (MyAnimeList.length) {
            MyAnimeList.style.cursor = "no-drop";
            MyAnimeList.style.filter = "grayscale(100%)";
        }
        if (Shikimori.length) {
            Shikimori.style.cursor = "no-drop";
            Shikimori.style.filter = "grayscale(100%)";
        }
    }
}

function addLinks(malID, isAnime, getconfig) {
    let actions = document.querySelector('.actions');
    console.log(actions);
    actions.style.display = 'block';

    let statusList = document.querySelector('.list');
    statusList.style.marginBottom = '10px';

    let DivLinks = document.createElement('div');
    DivLinks.classList.add('Links');
    DivLinks.style.display = "grid";
    DivLinks.style.gridTemplateColumns = "repeat(auto-fill, minmax(35px, 35px))";
    DivLinks.style.gap = '10px';

    let favoriteButton = document.querySelector('.favourite');
    DivLinks.appendChild(favoriteButton.parentNode.removeChild(favoriteButton));

    actions.append(DivLinks);

    if (getconfig.ShikimoriLinkCheckbox) {
        const shikiLink = createLinkDiv('https://shikimori.me/favicons/favicon-16x16.png');
        shikiLink.classList.add('Shikimori');

        shikiLink.style.background = 'rgb(255, 255, 255)';

        if (malID && isAnime) { 
            shikiLink.style.cursor = "pointer";
            shikiLink.style.filter = "none";
            shikiLink.href = `https://shikimori.me/${isAnime ? 'animes' : 'mangas'}/${malID}/`;
        } else {
            shikiLink.style.cursor = "no-drop";
            shikiLink.style.filter = "grayscale(100%)";
        }
        
        DivLinks.appendChild(shikiLink);
    }

    if (getconfig.MALlinkCheckbox) {
        const malLink = createLinkDiv('https://cdn.myanimelist.net/images/favicon.ico');
        malLink.classList.add('MyAnimeList');

        malLink.style.background = 'rgb(45, 80, 159)';

        if (malID && isAnime) { 
            malLink.style.cursor = "pointer";
            malLink.style.filter = "none";
            malLink.href = `https://myanimelist.net/${isAnime ? 'anime' : 'manga'}/${malID}/`;
        } else {
            malLink.style.cursor = "no-drop";
            malLink.style.filter = "grayscale(100%)";
        }

        DivLinks.appendChild(malLink);
    }

    if (getconfig.KitsulinkCheckbox) {
        console.log('Kitsu link is not implemented yet');
    }
}

export default {addLinks, updateLinks};