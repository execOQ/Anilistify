function getMediaType() {
    let url = window.location.href;
    return url.split('/')[3].toUpperCase();
}

function getMediaId() {
    let url = window.location.href;
    return url.split('/')[4];
}

export default getMediaId;