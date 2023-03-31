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
        }
    })();

    const createThemeChooser = (() => {
        const themeSelector = document.querySelector('#theme-chooser');
        const themeSelectorContainer = document.querySelector('#theme-chooser-container');
        const theme = localStorage.getItem('theme');
        themeSelector.value = (theme) ? theme : 'auto';

        themeSelector.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;

            if(selectedTheme === 'auto') {
                localStorage.removeItem('theme');
                document.documentElement.removeAttribute('data-theme');
            } else {
                localStorage.setItem('theme', event.target.value);
                document.documentElement.setAttribute('data-theme', event.target.value);
            }
        });

        themeSelectorContainer.classList.remove('hidden');
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
