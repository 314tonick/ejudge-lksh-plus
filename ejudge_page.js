function getChildrenLeafsList(elem) {
    if (elem.childElementCount == 0) {
        return [elem];
    }
    var res = [];
    for (elem2 of elem.children) {
        for (elem3 of getChildrenLeafsList(elem2)) {
            res.push(elem3);
        }
    }
    return res;
}

async function makeEjudgePageBetter() {
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
    console.log("Ejudge!");
    console.log(document.body);

    var style_nd = document.createElement("style");
    style_nd.textContent = `
.nProbEmpty {
    background: #224 !important;
}
.nProbEmpty a[href] {
    color: #fff !important;
}

.nProbCurrent {
    background: #66f !important;
}
.nProbCurrent a[href] {
    background: #66f !important;
    color: #fff !important;
}

.nProbOk {
    background: #3a3 !important;
}
.nProbOk a[href] {
    color: #fff !important;
}

.nProbBad {
    background: #a33 !important;
}
.nProbBad a[href] {
    color: #fff !important;
}

.nProbTrans {
    background: #883 !important;
}
.nProbTrans a[href] {
    color: #fff !important;
}

.line-numbers {
    color: "#fff" !important;
    background: #000 !important;
}

code[class*="language-"] {
    /* background: #3a3 !important; */
    /* color: "#fff" !important; */
    text-shadow: none !important;
}`;
    if (!DEFAULT_COLORS) {
        document.head.appendChild(style_nd);
        document.body.style["background"] = "#222";
        document.body.style["color"] = "#fff";
        document.getElementById("container").style["background"] = "#333";
        document.getElementById("l12-col").style["background"] = "#333";
        for (elem of document.getElementsByClassName("b1")) {
            elem.style["background"] = "#333";
            // console.log("TagName:", elem.tagName, ".");
            // console.log(elem);
            if (elem.tagName == "TH") {
                elem.style["color"] = "#77e";
                console.log(elem.style["text-shadow"]);
                elem.style["text-shadow"] = "0px 1px 0px #339";
            }
        }
        for (elem of document.getElementsByTagName("textarea")) {
            elem.style["background"] = "#222";
            elem.style["color"] = "#fff";
        }
    }
    if (!DEFAULT_COLORS) {
        for (elem of document.getElementsByClassName("info-table-line")) {
            console.log(elem);
            console.log(getChildrenLeafsList(elem));
            elem.style["box-shadow"] = "0px 2px 12px 5px #555";
            for (elem2 of getChildrenLeafsList(elem)) {
                elem2.style["background"] = "#333";
                elem2.style["color"] = "#fff";
            }
        }
        for (elem of document.getElementsByTagName("a")) {
            if (elem.classList.contains("tab")) {
                
            } else if (elem.classList.contains("menu")) {

            } else {
                elem.style["color"] = "#8f8";
            }
        }
    }
    if (!DEFAULT_COLORS) {
        for (elem of document.getElementsByTagName("code")) {
            var isACode = false;
            for (cls of elem.classList) {
                if (cls.startsWith("language-")) {
                    isACode = true;
                }
            }
            if (isACode) {
                elem.style["color"] = "#eee";
            }
        }
    }
}

makeEjudgePageBetter()