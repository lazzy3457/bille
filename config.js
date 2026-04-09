// config.js
const Config = {
    user: {
        selectedBille: null,
        firstClickPos: null
    },
    physics: {
        baseSpeed: 0.05,
        friction: 0.985
    },
    settings: {
        sizeMin: 60,
        sizeMax:  100,
        nbBilleMin: 15,
        nbBilleMax: 30
    },
    billes: [],
    message: {
        explication : true
    }
};

export default Config;