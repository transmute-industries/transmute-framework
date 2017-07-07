import * as moment from 'moment'

export default [
    {
        type: "HERO_STATS_CHANGED",
        payload: {
            hero: {
                name: 'bob',
                health: 100,
                inventory: ['stick'],
                gold: 100,
                spells: ['spark']
            }
        },
        meta: {
            id: 0,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024530
        }
    },
    {
        type: "HERO_STATS_CHANGED",
        payload: {
            hero: {
                name: 'bob',
                health: 90,
                inventory: ['stick', 'club'],
                gold: 120,
                spells: ['spark', 'bolt']
            }
        },
        meta: {
            id: 1,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024531
        }
    },
    {
        type: "HERO_STATS_CHANGED",
        payload: {
            hero: {
                name: 'bob',
                health: 70,
                inventory: ['club'],
                gold: 200,
                spells: ['spark', 'bolt']
            }
        },
        meta: {
            id: 2,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024532
        }
    },
    {
        type: "HERO_STATS_CHANGED",
        payload: {
            hero: {
                name: 'bob',
                health: 30,
                inventory: ['sword'],
                gold: 200,
                spells: ['spark', 'bolt', 'healing']
            }
        },
        meta: {
            id: 3,
            version: 'v0',
            txOrigin: '0xe609757c1c16d839c2c50bbe5447df6166134171',
            created: 1496024533
        }
    },

]