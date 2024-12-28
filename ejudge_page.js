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

function makeEjudgePageBetter() {
    console.log("Ejudge!");
    console.log(document.body);
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

makeEjudgePageBetter()