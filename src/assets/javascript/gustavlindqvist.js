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
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('theme-toggle__checkbox').checked = true;
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                localStorage.setItem('theme', 'dark');
                document.getElementById('theme-toggle__checkbox').checked = true;
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
                document.getElementById('theme-toggle__checkbox').checked = false;
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
    })();

    const createThemeChooser = (() => {
        const themeToggle = document.getElementById('theme-toggle__checkbox');
        const colorSchemeSetting = window.matchMedia("(prefers-color-scheme: dark)");

        themeToggle.addEventListener('change', (event) => {
            if(event.target.checked) {
                localStorage.setItem('theme', 'dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });

        colorSchemeSetting.addEventListener('change', (event) => {
            if(event.matches) {
                localStorage.setItem('theme', 'dark');
                document.getElementById('theme-toggle__checkbox').checked = true;
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
                document.getElementById('theme-toggle__checkbox').checked = false;
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });


    })();

    const initializeDayJS = (() => {
        dayjs.extend(dayjs_plugin_relativeTime);
        dayjs.locale('sv');
        [...document.querySelectorAll('.timeago')].forEach((element) => {
            if (typeof element.getAttribute('datetime') !== 'undefined') {
                let newString = dayjs().to(element.attributes.datetime.value);

                if (typeof element.getAttribute('prefix') === 'undefined') {
                    newString = newString.replace('för ','');
                }
                if (typeof element.getAttribute('data-firstletterupper') !== 'undefined' && element.getAttribute('data-firstletterupper')) {
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
