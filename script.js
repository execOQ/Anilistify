document.addEventListener('DOMContentLoaded', function () {
    var HoverEffectCheckbox = document.querySelector('.Hover-Effect');

    var MALlinkCheckbox = document.querySelector('.MAL-link');
    var ShikimoriLinkCheckbox = document.querySelector('.Shikimori-link');
    var KitsulinkCheckbox = document.querySelector('.Kitsu-link');

    var russianTitleCheckbox = document.querySelector('.russianTitle-CheckBox');
    
    var scoreHeaderCheckbox = document.querySelector('.scoreHeaderCheckbox');
    var anilistCheckbox = document.querySelector('.anilistCheckbox');
    var anilistCheckboxIcon = document.querySelector('.anilistCheckbox-icon');
    var malCheckbox = document.querySelector('.malCheckbox');
    var shikimoriCheckbox = document.querySelector('.shikimoriCheckbox');

    var Infocreated = document.querySelector('.Info-created');
    var Infoupdated = document.querySelector('.Info-updated');
  
    // Загрузка сохраненных значений из хранилища при открытии всплывающего окна
    chrome.storage.sync.get(
      ['HoverEffect', 'MALlink', 'ShikimoriLink', 'KitsuLink', 'russianTitle', 'scoreHeader', 'anilist', 'anilistIcon', 'mal', 'shikimori', 'Infocreated', 'Infoupdated'],
      function (result) {
        HoverEffectCheckbox.checked = result.HoverEffect || false;

        MALlinkCheckbox.checked = result.MALlink || false;
        ShikimoriLinkCheckbox.checked = result.ShikimoriLink || false;
        KitsulinkCheckbox.checked = result.KitsuLink || false;

        russianTitleCheckbox.checked = result.russianTitle || false;

        scoreHeaderCheckbox.value = result.scoreHeader || 'In Header';
        anilistCheckbox.checked = result.anilist || false;
        anilistCheckboxIcon.checked = result.anilistIcon || false;
        malCheckbox.checked = result.mal || false;
        shikimoriCheckbox.checked = result.shikimori || false;

        Infocreated.checked = result.Infocreated || false;
        Infoupdated.checked = result.Infoupdated || false;

      }
    );
  
    // Сохранение значений в хранилище при нажатии на кнопку "Save"
    var saveButton = document.getElementById('btn');
    saveButton.addEventListener('click', function () {
        var HoverEffectChecked = HoverEffectCheckbox.checked;

        var MALlinkChecked = MALlinkCheckbox.checked;
        var ShikimoriLinkChecked = ShikimoriLinkCheckbox.checked;
        var KitsulinkChecked = KitsulinkCheckbox.checked;

        var russianTitleChecked = russianTitleCheckbox.checked;

        var scoreHeaderChecked = scoreHeaderCheckbox.value;
        var anilistChecked = anilistCheckbox.checked;
        var anilistCheckboxIconChecked = anilistCheckboxIcon.checked;
        var malChecked = malCheckbox.checked;
        var shikimoriChecked = shikimoriCheckbox.checked;

        var InfocreatedChecked = Infocreated.checked;
        var InfoupdatedChecked = Infoupdated.checked;
  
        // Сохранение значений в хранилище
        chrome.storage.sync.set(
            {
            HoverEffect: HoverEffectChecked,
            
            MALlink: MALlinkChecked,
            ShikimoriLink: ShikimoriLinkChecked,
            KitsuLink: KitsulinkChecked,

            russianTitle: russianTitleChecked,

            scoreHeader: scoreHeaderChecked,
            anilist: anilistChecked,
            anilistIcon: anilistCheckboxIconChecked,
            mal: malChecked,
            shikimori: shikimoriChecked,

            Infocreated: InfocreatedChecked,
            Infoupdated: InfoupdatedChecked,

            },
            function () {
                console.log('Values saved to storage.');

                let status = document.querySelector('.status');
                status.style.opacity = '1';
                status.style.color = 'green';
                status.textContent = 'Options saved.';
                setTimeout(function () {
                    status.textContent = '';
                }, 2050);
            }
        );
    });
});
  
