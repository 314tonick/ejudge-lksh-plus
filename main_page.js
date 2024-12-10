function makeMainPageBetter() {
    // document.body.style['background'] = "#333";
    console.log("I am here!!!");
    for (var elem of document.getElementsByTagName("a")) {
        if (elem.title == "Условия задач") {
            elem.classList.add("statements");
        }
        console.log(elem.href);
        if (elem.href.match(/standings\/stand.*\.php/) && elem.parentElement.parentElement.classList.contains("section__title")) {
            var pr = elem.parentNode.parentNode;
            pr.removeChild(elem.parentNode);
            var nd = document.createElement("a");
            nd.href = "standings/stand.php";
            nd.classList.add("standings-link");
            nd.textContent = "ТАБЛИЧКА";
            nd.target = "_blank";
            pr.appendChild(nd);
        }
    }
    for (var elem of document.getElementsByClassName("parallel-name")) {
        if (elem.parentNode.classList.contains("current")) {
            elem.classList.add("current-parallel-name");
        }
    } 
    // var nd = document.createElement("link");
    // nd.rel = "stylesheet";
    // nd.href = "main_page.css";
}

if (!location.href.match(/\/standings\/stand.*php\/?/)) {
    if (!location.href.match("\/cgi-bin\/new-client")) {
        makeMainPageBetter();
    }
}