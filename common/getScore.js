async function createScoreContainer(scores, iconInsteadOfText = false, isInHeader = true, getconfig) {
    let newNode = document.createElement('div');
    newNode.classList.add(`scores-container`);
    
    if (isInHeader) {  
        newNode.style.marginTop = "10px";
    } else { // sidebar
        newNode.style.marginBottom = "16px";
        newNode.style.background = "rgb(var(--color-foreground))";
        newNode.style.borderRadius = "3px";
        newNode.style.display = "block";
        newNode.style.padding = "18px";
        newNode.style.width = "100%";
        
        let typeDiv = document.createElement('div');
        typeDiv.textContent = 'Scores';
        typeDiv.style.fontSize = '1.3rem';
        typeDiv.style.fontWeight = '500';
        typeDiv.style.paddingBottom = '5px';
        newNode.appendChild(typeDiv);
    }
    
    if (getconfig.anilistCheckbox) {
        let AnilistDiv = document.createElement('div');
        AnilistDiv.classList.add('Anilist-Container');
        
        let AnilistScore = document.createElement('span');
        AnilistScore.classList.add('AnilistScore', 'span-score');
        if (scores[0] === null || scores[0] == undefined) {
            AnilistScore.textContent = 'No score on AniList';
        }
        
        AnilistDiv.style.display = "inline-block"; // if header
        
        if (!isInHeader) {
            AnilistDiv.style.display = "block";
            AnilistDiv.style.marginBottom = "5px";
            AnilistDiv.style.marginLeft = "10px";
            AnilistScore.style.fontSize = "1.2rem";
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

        newNode.appendChild(AnilistDiv);
    }

    if (getconfig.malCheckbox) {
        let MALScore = document.createElement('span');
        MALScore.classList.add('MALScore', 'span-score');
        if (scores[1] === null || scores[1] == undefined) {
            MALScore.textContent = 'No score on MyAnimeList';
        }
        MALScore.textContent = scores[1] + ` on ${iconInsteadOfText ? "" : "MyAnimeList"}`;
        
        MALScore.style.marginLeft = "10px";
        
        if (!isInHeader) {
            MALScore.style.display = "block";
            MALScore.style.marginBottom = "5px";
            MALScore.style.fontSize = "1.2rem";
        }
        
        if (iconInsteadOfText) {
            const malLink = createLinkDiv('https://cdn.myanimelist.net/images/favicon.ico');
            malLink.classList.add('MyAnimeList');
            malLink.style.display = "inline-block";
            MALScore.appendChild(malLink);
        }

        newNode.appendChild(MALScore);
    }

    if (getconfig.shikimoriCheckbox) {
        let ShikiScore = document.createElement('span');
        ShikiScore.classList.add('ShikiScore', 'span-score');
        if (scores[2] === null || scores[2] == undefined || scores[2] === '0.0') {
            ShikiScore.textContent = 'No score on Shikimori';
        }
        ShikiScore.textContent = scores[2] + ` on ${iconInsteadOfText ? "" : "Shikimori"}`;
        ShikiScore.style.marginLeft = "10px";
        
        if (!isInHeader) {
            ShikiScore.style.display = "block";
            ShikiScore.style.fontSize = "1.2rem";
        }

        if (iconInsteadOfText) {
            const shikiLink = createLinkDiv('https://shikimori.me/favicons/favicon-16x16.png');
            shikiLink.classList.add('Shikimori');
            shikiLink.style.display = "inline-block";
            ShikiScore.appendChild(shikiLink);
        }

        newNode.appendChild(ShikiScore);
    }
    
    return newNode;
}

function createLinkDiv(iconUrl) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-wrap');
    iconContainer.style.padding = "0";
    iconContainer.style.margin = "0 5px";

    const icon = document.createElement('img');
    icon.classList.add('icon');
    icon.src = iconUrl;
    icon.width = '14';

    iconContainer.appendChild(icon);

    return iconContainer;
}

export default createScoreContainer;