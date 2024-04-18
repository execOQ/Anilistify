async function getScore(scores, getconfig)  {
    let Anilist = $('.AnilistScore');
    let MyAnimeList = $('.MALScore');
    let Shikimori = $('.ShikiScore'); 

    let EnglishTitle = document.querySelector('p[data-v-5776f768]');
    let Sidebar = document.querySelector('.rankings');
    
    if (MyAnimeList.length || Shikimori.length || Anilist.length) return;
    if (!EnglishTitle || !Sidebar) return;

    let newNode = document.createElement('div');
    newNode.classList.add('scores-container');

    if (getconfig.scoreHeaderCheckbox === 'Sidebar') {
        let typeDiv = document.createElement('div');
        typeDiv.textContent = 'Scores';
        typeDiv.style.fontSize = '1.3rem';
        typeDiv.style.fontWeight = '500';
        typeDiv.style.paddingBottom = '5px';
        newNode.appendChild(typeDiv);
    }

    let AnilistDiv = document.createElement('div');
    AnilistDiv.classList.add('Anilist-Container');

    let AnilistScore = document.createElement('span');
    AnilistScore.classList.add('AnilistScore', 'span-score');
    if (scores[0] === null || scores[0] == undefined) {
        AnilistScore.textContent = 'No score on AniList';
    }

    if (getconfig.anilistIcon) {
        const svg = (await import("../extras/svg.js")).default;

        let iconMarkup;

        if (scores[0] === null || scores[0] == undefined) {
            iconMarkup = svg.straight;
        } else if (scores[0] >= 75) {
            iconMarkup = svg.smile;
        } else if (scores[0] >= 60) {
            iconMarkup = svg.straight;
        } else {
            iconMarkup = svg.frown;
        }

        let iconSpan = document.createElement('span');
        iconSpan.classList.add('icon-score');
        iconSpan.innerHTML = iconMarkup + ' ';

        AnilistDiv.appendChild(iconSpan);

        AnilistScore.textContent = scores[0] + '%';
    } else {
        AnilistScore.textContent = scores[0] + '% on AniList';
    }

    AnilistDiv.appendChild(AnilistScore);


    let MALScore = document.createElement('span');
    MALScore.classList.add('MALScore', 'span-score');
    if (scores[1] === null || scores[1] == undefined) {
        MALScore.textContent = 'No score on MyAnimeList';
    }
    MALScore.textContent = scores[1] + ' ' + 'on MyAnimeList';


    let ShikiScore = document.createElement('span');
    ShikiScore.classList.add('ShikiScore', 'span-score');
    if (scores[2] === null || scores[2] == undefined || scores[2] === '0.0') {
        ShikiScore.textContent = 'No score on Shikimori';
    }
    ShikiScore.textContent = scores[2] + ' ' + 'on Shikimori';


    if (getconfig.anilistCheckbox) {
        newNode.appendChild(AnilistDiv);
    }

    if (getconfig.malCheckbox) {
        newNode.appendChild(MALScore);
    }

    if (getconfig.shikimoriCheckbox) {
        newNode.appendChild(ShikiScore);
    }



    if (getconfig.scoreHeaderCheckbox === 'Header') {  
        newNode.style.marginTop = "10px";

        AnilistDiv.style.display = "inline-block";

        MALScore.style.marginLeft = "10px";
        ShikiScore.style.marginLeft = "10px";

        EnglishTitle.parentNode.insertBefore(newNode, EnglishTitle);
    }
    
    if (getconfig.scoreHeaderCheckbox === 'Sidebar') {
        newNode.style.marginBottom = "16px";
        newNode.style.background = "rgb(var(--color-foreground))";
        newNode.style.borderRadius = "3px";
        newNode.style.display = "block";
        newNode.style.padding = "18px";
        newNode.style.width = "100%";
        

        AnilistDiv.style.display = "block";
        AnilistDiv.style.marginBottom = "5px";
        MALScore.style.display = "block";
        MALScore.style.marginBottom = "5px";
        ShikiScore.style.display = "block";

        AnilistScore.style.fontSize = "1.2rem";
        MALScore.style.fontSize = "1.2rem";
        ShikiScore.style.fontSize = "1.2rem";
        

        Sidebar.parentNode.insertBefore(newNode, Sidebar);
    }
}

export default getScore;