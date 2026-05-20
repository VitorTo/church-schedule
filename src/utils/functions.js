import moment from "moment";

export const formatDateValue = function (value, format = "HH:mm:ss - DD/MM/YY") {
    return value && moment(value).format(format);
};

export const capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
};

export const isMobile = function () {
    return window.innerWidth < 769
};

export const getWorkers = function () {
    const saved = localStorage.getItem('churchWorkers');
    if (saved) {
        return JSON.parse(saved);
    }
    const defaultWorkers = [
        { id: 1, name: 'Adriana' },
        { id: 2, name: 'Amanda' },
        { id: 3, name: 'Antônio' },
        { id: 4, name: 'Celina' },
        { id: 5, name: 'Célia B' },
        { id: 6, name: 'Francisco G' },
        { id: 7, name: 'Francisco P' },
        { id: 8, name: 'Gracia' },
        { id: 9, name: 'Ítalo' },
        { id: 10, name: 'Madalena' },
        { id: 11, name: 'Maria C' },
        { id: 12, name: 'Maria L R' },
        { id: 13, name: 'Maria L G' },
        { id: 14, name: 'Neuma' },
        { id: 15, name: 'Nílza' },
        { id: 16, name: 'Ronei' },
        { id: 17, name: 'Cida' },
        { id: 18, name: 'Selma' },
        { id: 19, name: 'Vicente' },
        { id: 20, name: 'Vitor G' },
        { id: 21, name: 'Gustavo B' },
        { id: 22, name: 'Wesley' },
    ];
    localStorage.setItem('churchWorkers', JSON.stringify(defaultWorkers));
    return defaultWorkers;
};

export const saveWorkers = function (workers) {
    localStorage.setItem('churchWorkers', JSON.stringify(workers));
};