const fetch = require("@11ty/eleventy-fetch");
const cheerio = require("cheerio");

module.exports = async () => {
    const packstack = {};

    const categoryData = {
        6: {
            "name": "Packning",
            "icon": "bag-personal",
            "color": "#3949ab",
        },
        7: {
            "name": "Skydd",
            "icon": "tent",
            "color": "#7cb342",
        },
        4: {
            "name": "Sovsystem",
            "icon": "sleep",
            "color": "#c51162",
        },
        1: {
            "name": "Kläder",
            "icon": "tshirt-crew",
            "color": "#5e35b1",
        },
        2: {
            "name": "Matlagning & vattenrening",
            "icon": "campfire",
            "color": "#ff861f",
        },
        202: {
            "name": "Elektronik & övriga tillbehör",
            "icon": "battery-charging",
            "color": "#ffd600",
        },
        8: {
            "name": "Säkerhets- & toalettartiklar",
            "icon": "medical-bag",
            "color": "#d91b1b",
        },
        15: {
            "name": "Fotografering",
            "icon": "camera",
            "color": "#119ae0",
        },
        204: {
            "name": "Förbrukningsvaror",
            "icon": "food-hot-dog",
            "color": "#ba6d54",
        },
        3: {
            "name": "Övrigt",
            "icon": "tools"
        }
    };

    const getPack = async (packUrl) => {
        let pack = {};
        try {
            const rawPage = await fetch(packUrl, {
                duration: "1d",
                type: "text",
                directory: ".cache",
            });

            const htmlPage = cheerio.load(rawPage);
            const rawJSON = JSON.parse(htmlPage('body > script#__NEXT_DATA__').text());
            const packData = rawJSON.props.pageProps.data;

            const categories = [];

            packData.items.forEach((item) => {
                let found = false;
                categories.forEach((category) => {
                    if (category.category_id === item.item.category.category_id) {
                        found = true;
                    }
                });
                if (!found) {
                    item.item.category.name = item.item.category.category.name;
                    if (typeof categoryData[item.item.category.category_id] !== 'undefined') {
                        Object.assign(item.item.category, categoryData[item.item.category.category_id]);
                    }
                    delete item.item.category['category'];
                    categories.push({...item.item.category});
                }
            });

            categories.sort((a, b) => a.sort_order - b.sort_order);

            categories.forEach((category => {
                const categoryItems = packData.items.filter((item) => category.category_id === item.item.category.category_id);
                categoryItems.sort((a, b) => a.sort_order - b.sort_order);
                category.items = [...categoryItems];
            }));

            const all_items = categories.map((arr) => {
                return arr.items;
            }).flat();

            pack.total_weight = all_items.reduce((result, item) => {
                return result + (item.item.weight * item.quantity)
            }, 0);

            pack.worn_weight = all_items.reduce((result, item) => {
                if (typeof item.worn !== 'undefined' && item.worn) {
                    return result + (item.item.weight * item.quantity)
                }
                return result;
            }, 0);

            pack.base_weight = all_items.reduce((result, item) => {
                if ((typeof item.worn === 'undefined' || !item.worn) && (typeof item.item.consumable === 'undefined' || !item.item.consumable)) {
                    return result + (item.item.weight * item.quantity)
                }
                return result;
            }, 0);

            pack.consumables_weight = all_items.reduce((result, item) => {
                if (typeof item.item.consumable !== 'undefined' && item.item.consumable) {
                    return result + (item.item.weight * item.quantity)
                }
                return result;
            }, 0);

            pack.big_three = all_items.reduce((result, item) => {

                if (typeof item.item.category.category_id !== 'undefined' && [6,7,4].includes(item.item.category.category_id)) {
                    return result + (item.item.weight * item.quantity)
                }
                return result;
            }, 0);

            categories.forEach((category) => {
                category.total_weight = category.items.reduce((result, item) => {
                    return result + (item.item.weight * item.quantity)
                }, 0);
            });

            pack.name = packData.title;
            pack.id = packData.id;
            pack.contents = categories;

            console.log('[' + '\x1b[34m%s\x1b[0m', 'Packstack' + '\x1b[0m' + ']:', 'Grabbed pack:', packData.title, '(' + packUrl + ')');

            return pack;
        } catch (err) {
            console.error('[' + '\x1b[34m%s\x1b[0m', 'Packstack' + '\x1b[0m' + ']:',err);
            return undefined;
        }
    };

    packstack.summer_2022 = await getPack('https://www.packstack.io/pack/209');
    packstack.summer_2023 = await getPack('https://www.packstack.io/pack/559');
    packstack.bikepacking_2023 = await getPack('https://www.packstack.io/pack/581');
    packstack.bankerydsleden_2022 = await getPack('https://www.packstack.io/pack/257');
    packstack.big_camera_kit = await getPack('https://www.packstack.io/pack/654');
    packstack.small_camera_kit = await getPack('https://www.packstack.io/pack/655');

    return packstack;

};
