function theme() {

    var theme = document.getElementById("theme_1").innerHTML;


    console.log(theme)

    if (theme == 'dark_mode') {
        theme = document.getElementById("theme_1").innerHTML = "light_mode";
        theme = document.getElementById("theme_2").innerHTML = "light_mode";
    } else {
        theme = document.getElementById("theme_1").innerHTML = "dark_mode";
        theme = document.getElementById("theme_2").innerHTML = "dark_mode";
    }

}