function getRusTitle(rusTitle) {
    let EnglishTitle = document.querySelector('h1[data-v-5776f768]');
    let spanRusElement = document.querySelector('.Span-Rus-Title');
    let textSeparator = document.querySelector('.Separate-Texts');

    console.log('данные получены');

    if (!textSeparator) {
        let SeparateTexts = document.createElement('span');
        SeparateTexts.classList.add('Separate-Texts');
        SeparateTexts.textContent = ' • ';

        EnglishTitle.appendChild(SeparateTexts);
    }

    if (spanRusElement) { // Проверка, существует ли элемент
        console.log('проверка на существование элемента');
        if (spanRusElement.textContent === rusTitle) {
            console.log('проверка на совпадение');
            return;
        }
        console.log('проверка на совпадение не прошла');
        spanRusElement.textContent = rusTitle;
    } else {
        console.log('создание элемента');

        let SpanRus = document.createElement('span');
        SpanRus.classList.add('Span-Rus-Title');
        SpanRus.textContent = rusTitle;

        document.querySelector('.Separate-Texts').after(SpanRus);
        spanRusElement = SpanRus;
    }
}

export default getRusTitle;