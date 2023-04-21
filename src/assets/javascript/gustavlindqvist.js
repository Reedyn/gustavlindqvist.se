const gustavlindqvist = (() => {

    // Add js-class and remove no-js-class from <html>
    const isJS = (() => {
        const htmlElement = document.documentElement;

        htmlElement.classList.remove('no-js');
        htmlElement.classList.add('js');
    })();

    // Set theme to saved value if it exists
    const setSavedTheme = (() => {
        let theme = localStorage.getItem('theme');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.querySelector(`.theme-chooser.-${theme}`).classList.add('active');
        } else {
            document.querySelector(`.theme-chooser.-auto`).classList.add('active');
        }
    })();

    const createThemeChooser = (() => {
        const themeChooserToggle = document.getElementById('theme-chooser-toggle');
        const themeChooserContainer = document.getElementById('theme-chooser-container');
        const themeSelectors = document.querySelectorAll('.theme-chooser');

        themeChooserToggle.addEventListener('click', () => {
            themeChooserContainer.classList.toggle('hidden');
        });

        [...themeSelectors].forEach((themeSelector) => {
            themeSelector.addEventListener('click', (event) => {
                [...document.querySelectorAll('.theme-chooser.active')].forEach((btn) => { btn.classList.remove('active') });

                const selectedTheme = themeSelector.value;

                if(selectedTheme === 'auto') {
                    localStorage.removeItem('theme');
                    document.documentElement.removeAttribute('data-theme');
                } else {
                    localStorage.setItem('theme', selectedTheme);
                    document.documentElement.setAttribute('data-theme', selectedTheme);
                }

                themeSelector.classList.add('active')
            });
        });
    })();

    const initializeDayJS = (() => {
        dayjs.extend(dayjs_plugin_relativeTime);
        dayjs.locale('sv');
        [...document.querySelectorAll('.timeago')].forEach((element) => {
            if (typeof element.attributes.datetime !== 'undefined') {
                let newString = dayjs().to(element.attributes.datetime.value);

                if (typeof element.attributes.prefix === 'undefined') {
                    newString = newString.replace('för ','');
                }
                if (typeof element.attributes.firstletterupper !== 'undefined') {
                    newString = newString.charAt(0).toUpperCase() + newString.slice(1)
                }

                element.innerText = newString;
            }
        });
    })();

    return {
        isJS,
        initializeDayJS,
        setSavedTheme,
        createThemeChooser,
    };
})();
