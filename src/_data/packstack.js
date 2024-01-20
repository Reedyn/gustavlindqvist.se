const fetch = require("@11ty/eleventy-fetch");
const cheerio = require("cheerio");

module.exports = async () => {
    const packstack = {};

    const categoryData = {
        6: {
            "name": "Packning",
            "icon": "bag-personal",
            "color": "oklch(45% 0.16 272)",
        },
        7: {
            "name": "Skydd",
            "icon": "tent",
            "color": "oklch(70% 0.155 131)",
        },
        4: {
            "name": "Sovsystem",
            "icon": "sleep",
            "color": "oklch(54% 0.2 3)",
        },
        1: {
            "name": "Kläder",
            "icon": "tshirt-crew",
            "color": "oklch(45% 0.18 293)",
        },
        2: {
            "name": "Matlagning & vattenrening",
            "icon": "campfire",
            "color": "oklch(74% 0.18 54)",
        },
        202: {
            "name": "Elektronik & övriga tillbehör",
            "icon": "battery-charging",
            "color": "oklch(88% 0.18 95)",
        },
        8: {
            "name": "Säkerhets- & toalettartiklar",
            "icon": "medical-bag",
            "color": "oklch(56% 0.22 28)",
        },
        15: {
            "name": "Fotografering",
            "icon": "camera",
            "color": "oklch(65% 0.15 240)",
        },
        204: {
            "name": "Förbrukningsvaror",
            "icon": "food-hot-dog",
            "color": "oklch(61% 0.10 39)",
        },
        3: {
            "name": "Övrigt",
            "icon": "tools"
        }
    };

    const getPack = async (packId, shareId) => {
        let pack = {};
        const packUrl = `https://api.packstack.io/pack/trip/${packId}`
        try {
            const rawPackData = await fetch(packUrl, {
                duration: "1s",
                type: "json",
                directory: ".cache",
            });

            const packData = rawPackData[0]

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
            pack.shareLink = `https://packstack.io/pack/${shareId}`

            console.log('[' + '\x1b[34m%s\x1b[0m', 'Packstack' + '\x1b[0m' + ']:', 'Grabbed pack:', packData.title, '(' + packUrl + ')');

            return pack;
        } catch (err) {
            console.error('[' + '\x1b[34m%s\x1b[0m', 'Packstack' + '\x1b[0m' + ']:',err);
            return undefined;
        }
    };

    packstack.bankerydsleden_2022 = await getPack('368', '020cc93d-2d4e-43c0-9df4-c1ccb63c90eb');
    packstack.summer = await getPack('455', '5f4edc0b-ddca-4a64-a97f-ee313f66e6bd');
    packstack.summer_2022 = await getPack('369', 'dc516757-bc41-4304-a29e-5dadc9dcf50e');
    packstack.summer_2023 = await getPack('367', '5f4edc0b-ddca-4a64-a97f-ee313f66e6bd');
    packstack.bikepacking_2023 = await getPack('370', '10c47671-c9f4-414e-b07d-2d796eb1c3e0');
    packstack.big_camera_kit = await getPack('372', '12baa3b2-8104-4c26-9532-acb721f05240');
    packstack.small_camera_kit = await getPack('371', 'c8848465-155d-4b9e-ac99-ddf43d8cbdbb');

    return packstack;

};
