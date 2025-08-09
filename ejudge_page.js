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

function applyForAllLeafs(elem, func) {
    if (!(elem instanceof Element)) {
        for (var ele of elem) {
            applyForAllLeafs(ele, func);
        }
    } else {
        for (var el of getChildrenLeafsList(elem)) {
            func(el);
        }
    }
}

function applyForAll(elems, func) {
    for (var el of elems) {
        func(el);
    }
}

async function makeEjudgePageBetter() {
    const storedData = await chrome.runtime.sendMessage({action: "get"});
    console.log(storedData);
    var SORT_BY_ALL_OK = storedData.pr_is_ok;
    var ADD_GD_FACES = storedData.fire_in_the_hole;
    var DEFAULT_COLORS = storedData.default_colors;
    var AUTOREFRESH = storedData.autorefresh;
    var AUTOREFRESH_TIME = storedData.autorefresh_time;
    console.log("Ejudge!");
    
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
            if (elem.tagName == "TH") {
                elem.style["color"] = "#77e";
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
    for (elem of document.getElementsByTagName("code")) {
        var isACode = false;
        for (cls of elem.classList) {
            if (cls.startsWith("language-")) {
                isACode = true;
            }
        }
        if (isACode) {
            if (!DEFAULT_COLORS) {
                elem.style["color"] = "#eee";
            }
            var new_button = document.createElement("button");
            new_button.onclick = () => navigator.clipboard.writeText(elem.textContent);
            new_button.textContent = "Скопировать код";
            new_button.style = "font-size: 20px; padding: 10px 15px; background: #111; color: #eee";
            elem.parentElement.insertAdjacentElement("beforeBegin", new_button);
        }
    }

    console.log(document.URL);
    
    if (document.URL.includes("action=37")) {
        console.log("i am here");
        var tbls = document.getElementsByClassName("table");
        console.log(tbls);
        for (var tbl of tbls) {
            tbl = tbl.children[0];
            var res = 0, test = -1;
            var nd = tbl.children[0];
            if (nd.childElementCount < 3 || !nd.children[2].textContent.startsWith("Время")) {
                continue;
            }
            for (var ln of tbl.children) {
                if (ln.children[2].textContent.match(/^[0-9]+(\.[0-9]+)$/)) {
                    var tm = parseFloat(ln.children[2].textContent);
                    if (tm > res) {
                        res = tm;
                        test = ln.children[0].textContent;
                    }
                }
            }
            var maxTm = document.createElement("h4");
            maxTm.textContent = "Максимальное время работы: " + res + " секунд";
            maxTm.title = "Максимальное время среди пройденных тестов.";
            maxTm.style["margin"] = "0px 0px 0px 0px";
            maxTm.style["color"] = "#eee";
            var maxTmTest = document.createElement("h5");
            maxTmTest.textContent = "на тесте №" + test + ".";
            maxTmTest.style["margin"] = "0px 0px 15px 0px";
            maxTmTest.style["color"] = "#888";
            tbl.parentElement.insertAdjacentElement("beforeBegin", maxTm);
            tbl.parentElement.insertAdjacentElement("beforeBegin", maxTmTest);
        }
    }
    if (document.getElementsByClassName("main_phrase")[0].textContent.includes("В доступе отказано")) {
        document.getElementById("main-menu").style["background"] = "linear-gradient(to bottom,  rgba(155, 26, 0, 1) 0%,rgba(145, 0, 0, 1) 25%,rgba(135, 0, 0, 1) 40%, 67%,rgba(135, 0, 0, 1) 80%,rgba(155, 0, 0, 1) 100%)";
        applyForAll(document.getElementsByClassName("current"), (el) => el.style = "background: linear-gradient(to bottom,  rgba(155, 26, 0, 1) 0%,rgba(145, 0, 0, 1) 25%,rgba(135, 0, 0, 1) 40%, 67%,rgba(135, 0, 0, 1) 80%,rgba(155, 0, 0, 1) 100%) !important");
        var img = document.getElementById("l11").children[0];
        img.src = chrome.runtime.getURL("icons/extreme_demon_face.png");
        img.parentElement.style["vertical-align"] = "left";
        img.style = "scale: 0.6; position:absolute; left:-10%; top:50%; transform:translateY(-75%)";
        var txt = document.getElementsByClassName("main_phrase")[0].textContent;
        txt = txt.substring(0, txt.length - 18) + "CBF detected, loser!";
        document.getElementsByClassName("main_phrase").textContent = txt;
        var main = document.getElementsByClassName("l14")[0];
        main.children[0].children[0].textContent = "CBF detected, loser!";
        main.children[1].textContent = "Clicks beetween frames is illegitimate and will not be allowed for use in Lksh Ejudge. Please diable the mod in order to continue solving.";
        main.children[2].remove();
        main.children[2].remove();
        document.getElementById("footer").children[1].textContent = "Copyright © 2000-2023 Congregation.";
        return;
    }

    if (!DEFAULT_COLORS) {
        for (var tbl of document.getElementsByClassName("table")) {
            tbl.style["box-shadow"] = "none";
        }
        var main_menu = document.getElementById("main-menu");
        // applyForAllLeafs(main_menu, (e) => {e.style["background"] = "linear-gradient(to bottom,  rgba(50, 66, 70, 1) 0%,rgba(57, 109, 140, 1) 5%,rgba(52, 95, 131, 1) 40%,rgba(29, 85, 131, 1) 65%,rgba(57, 109, 140, 1) 95%)";});
        if (main_menu == undefined) {
            main_menu = document.getElementsByClassName("user_actions")[0];
        } else {
            applyForAllLeafs(main_menu, (e) => {e.style["color"] = "#eee"});
            applyForAllLeafs(main_menu, (e) => {e.style["text-shadow"] = "none"});
        }
        main_menu.style.background = "linear-gradient(to bottom,  rgba(50, 66, 70, 1) 0%,rgba(57, 109, 140, 1) 5%,rgba(52, 95, 131, 1) 40%,rgba(29, 85, 131, 1) 65%,rgba(57, 109, 140, 1) 95%)";
        main_menu.style["box-shadow"] = "none";
        applyForAll(document.getElementsByClassName("current"), (el) => {el.style = "background: linear-gradient(to bottom,  rgba(68, 50, 70, 1) 0%,rgba(136, 57, 140, 1) 5%,rgba(131, 52, 130, 1) 40%,rgba(131, 29, 128, 1) 65%,rgba(139, 57, 140, 1) 95%) !important"});

        applyForAll(document.getElementsByClassName("tab"), (el) => el.style["color"] = "#eee");

        var statusLn = document.getElementById("statusLine");
        if (statusLn != undefined) {
            applyForAllLeafs(statusLn, (el) => el.style["color"] = "#eee");
            statusLn.style["color"] = "#eee";
            setInterval(() => {
                if (statusLn.classList.contains("server_status_on")) {
                    statusLn.style["background"] = "linear-gradient(to bottom,  rgba(0,155,0,1) 0%,rgba(0,145,0,1) 25%,rgba(0,135,0,1) 40%, 67%,rgba(0,135,0,1) 80%,rgba(0,155,0,1) 100%)";
                } else if (statusLn.classList.contains("server_status_error")) {
                    statusLn.style["background"] = "linear-gradient(to bottom,  rgba(155, 26, 0, 1) 0%,rgba(145, 0, 0, 1) 25%,rgba(135, 0, 0, 1) 40%, 67%,rgba(135, 0, 0, 1) 80%,rgba(155, 0, 0, 1) 100%)";
                } else if (statusLn.classList.contains("server_status_alarm")) {
                    statusLn.style["background"] = "linear-gradient(to bottom,  rgba(155, 155, 0, 1) 0%,rgba(131, 131, 0, 1) 25%,rgba(135, 135, 0, 1) 40%, 67%,rgba(110, 110, 0, 1) 80%,rgba(147, 147, 0, 1) 100%)";
                }
            }, 50);
        }
    }

    var send_button = document.getElementsByName("action_40")[0];
    var input_field = document.getElementsByName("text_form")[0]
    if (send_button != undefined && input_field != undefined) {
        var new_button = document.createElement("button");
        new_button.textContent = "Вставить и отправить!";
        new_button.style = "font-size: 13px; padding: 3px 5px";
        new_button.onclick = async () => {
            input_field.value = await navigator.clipboard.readText();
            send_button.click();
        };
        var tbl = send_button.parentElement.parentElement.parentElement;
        var tr = tbl.insertRow();
        tr.insertCell(0).textContent = "Отправить с буфера";
        tr.insertCell(1).appendChild(new_button);
        tr.children[0].classList.add("b0");
        tr.children[1].classList.add("b0");
        // tr.insertCell().appendChild(send_button).style = "padding: 0px 10px";
        // tr.insertCell().appendChild(new_button).style = "padding: 0px 10px";
        // plc.appendChild(tbl);
    }

    setInterval(() => {
        var nd = document.getElementById("statusString");
        if (nd != null && nd.textContent.includes("ТЕСТИРОВАНИЕ") && AUTOREFRESH) {
            setTimeout(() => chrome.runtime.sendMessage({action: "reload"}), AUTOREFRESH_TIME);
        }
    }, 50);
}

makeEjudgePageBetter()