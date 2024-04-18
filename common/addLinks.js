function addLinks(malID, isAnime, getconfig) {
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

export default addLinks;