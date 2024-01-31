export const weekDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

export const getData = function(dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
};

export const getTime = function(timeUnix, timeZone) {
    const date = new Date((timeUnix + timeZone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes} ${period}`;
};

export const celsiusToFahrenheit = function(celsius) {
    return (celsius * 9/5) + 32;
};

export const fahrenheitToCelsius = function(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
};

export const mps_to_kmh = mps => {
    const mph = mps*3600;
    return mph/1000;
}

export const aqiText = {
    1:{
        level:"Good",
        message: "Air quality is considered satisfactory"
    },
    2:{
        level:"fair",
        message:"Air quality is acceptable"
    },
    3:{
        level:"Moderate",
        message:"May cause health effects to sensitive people"
    },
    4:{
        level:"Poor",
        message:"Everyone may begin to experince health effects"
    },
    5:{
        level:"VeryPoor",
        message:"Health warnings of emergency condition"
    }
}