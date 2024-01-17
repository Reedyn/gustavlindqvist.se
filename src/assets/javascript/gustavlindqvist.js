const gustavlindqvist = (() => {

    // Add js-class and remove no-js-class from <html>
    const isJS = (() => {
        const htmlElement = document.documentElement;

        htmlElement.classList.remove('no-js');
        htmlElement.classList.add('js');
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
