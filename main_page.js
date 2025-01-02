async function makeMainPageBetter() {
    // document.body.style['background'] = "#333";
    const storedData = await chrome.runtime.sendMessage({action: "get"});
    console.log(storedData);
    for (var prptr in storedData) {
        console.log(prptr);
    }
    var SORT_BY_ALL_OK = storedData.pr_is_ok;
    var ADD_GD_FACES = storedData.fire_in_the_hole;
    var DEFAULT_COLORS = storedData.default_colors;
    console.log(SORT_BY_ALL_OK);
    console.log(ADD_GD_FACES);
    console.log(DEFAULT_COLORS);
    var style_nd = document.createElement("style");
    style_nd.textContent = `
body {
    background: #222;
    color: #eee;
    font-family: garamond;
}

.lessons__lesson:first-child a[href] {
    color: #6f6 !important;
    border-bottom-color: #393 !important;
}

.lessons__lesson a[href] {
    color: #77f !important;
    border-bottom-color: #55a !important;
}

.statements {
    font-weight: bolder !important
}

.info a[href] {
    color: #7a7 !important;
}

.parallel-name {
    color: #dd3 !important;
    border-bottom-color: #aa2 !important;
}

.current-parallel-name {
    color: #eee !important;
    /* background: ; */
}

.standings-link {
    color: #ee4 !important;
    font-weight: bolder !important;
    float: right !important;
}

/* .links a[href] {
    color: #3f3 !important;
} */

.main-menu a[href] {
    color: #eee !important;
}

.important {
    color: #fff !important;
}

.schelude__item {
    color: #777 !important;
}`;
    if (!DEFAULT_COLORS) {
        document.head.appendChild(style_nd);
    }
    console.log("I am here!!!");
    if (!location.href.match(/[0123456789]\/$/) && !location.href.match(/[0123456789]$/)) {
        console.log("One of main pages");
        for (var elem of document.getElementsByTagName("a")) {
            if (!DEFAULT_COLORS) {
                elem.style["color"] = "#7a7";
                if (elem.parentNode.classList.contains("current")) {
                    elem.style["color"] = "#fff";
                }
            }
        }
    }
    for (var elem of document.getElementsByTagName("a")) {
        if (elem.title == "Условия задач") {
            elem.classList.add("statements");
        }
        console.log(elem.href);
        if (elem.href.match(/standings\/stand.*\.php/) && elem.parentNode.parentNode.classList.contains("section__title")) {
            var pr = elem.parentNode.parentNode;
            pr.removeChild(elem.parentNode);
            var nd = document.createElement("a");
            nd.href = "standings/stand.php";
            nd.classList.add("standings-link");
            nd.style["float"] = "right";
            nd.style["font-weight"] = "bolder";
            nd.style["color"] = DEFAULT_COLORS ? "#aa3" : "#ee4";
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