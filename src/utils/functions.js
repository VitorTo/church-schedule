import moment from "moment";

export const formatDateValue = function (value, format = "HH:mm:ss - DD/MM/YY") {
    return value && moment(value).format(format);
};

export const capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
};