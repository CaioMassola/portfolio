var html = document.querySelector("html")
var getStyles = (element, style) => window.getComputedStyle(element).getPropertyValue(style)

var initialColors = {
    bg: getStyles(html, "--bg"),
    colorText: getStyles(html, "--color-text"),
    colorHover: getStyles(html, "--color-hover"),
    colorTextBg: getStyles(html, "--color-textbg"),
    name: 'light'
}

var darkMode = {
    bg: "#202125",
    colorText: "#ffffff",
    colorHover: "#38CADE",
    colorTextBg: "#000000",
    name: 'dark'
}

function theme() {

    var theme = document.getElementById("theme_1").innerHTML;

    if (theme == 'dark_mode') {
        theme = document.getElementById("theme_1").innerHTML = "light_mode";
        theme = document.getElementById("theme_2").innerHTML = "light_mode";

        changeColors(darkMode, html)
    } else {
        theme = document.getElementById("theme_1").innerHTML = "dark_mode";
        theme = document.getElementById("theme_2").innerHTML = "dark_mode";
        changeColors(initialColors, html)
    }
}

function transformKey(key) {
    return "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()
}

function changeColors(colors, html) {

    Object.keys(colors).map(key => html.style.setProperty(transformKey(key), colors[key]))
    console.log(colors)
}
