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

function get_or_execute(func_or_val, val) {
    if (func_or_val instanceof Function) {
        return func_or_val(val);
    }
    return func_or_val;
}

async function makeEjudgePageBetter() {
    const storedData = await chrome.runtime.sendMessage({action: "get"});
    console.log(storedData);
    var SORT_BY_ALL_OK = storedData.pr_is_ok;
    var ADD_GD_FACES = storedData.fire_in_the_hole;
    var DEFAULT_COLORS = storedData.default_colors;
    var AUTOREFRESH = storedData.autorefresh;
    var AUTOREFRESH_TIME = storedData.autorefresh_time;
    var LOOK_FOR_TESTING = storedData.look_for_testing;

    if (LOOK_FOR_TESTING) {
        const tabdata = await chrome.runtime.sendMessage({action: "get_for_tab"});
        const untested_prev = tabdata != undefined && tabdata.untested != undefined ? tabdata.untested : [];
        var untested_new = [];
        const RUNNING_VERDICTS = ["Компилируется...", "Выполняется...", "Compiling...", "Running..."];
        const VERD_NAMES = {
            "OK": "OK",
            "Ошибка выполнения": "RE",
            "Неправильный ответ": "WA",
            "Превышено максимальное время работы": "TL",
            "Ошибка компиляции": "CE",
            "Нарушение правил оформления программ": "SV",
            "Ожидает подтверждения": "OK",
            "Неполное решение": "PS",
            "Неполное решение 0 баллов": "PS0"
        };
        const VERD_DATA = {
            "OK": {"color": "#2c2", "more_info": false, "desc": "GG"},
            "WA": {"color": "#c33", "more_info": true, "desc": "Неправильный ответ."},
            "TL": {"color": "#858", "more_info": true, "desc": "Превышено время исполнения."},
            "RE": {"color": "#911", "more_info": true, "desc": "Ошибка исполнения."},
            "PS": {"color": (score)=>{
                if (score <= 10) {
                    return "#b33";
                } else if (score <= 20) {
                    return "#a54";
                } else if (score <= 30) {
                    return "#a74";
                } else if (score <= 40) {
                    return "#a84";
                } else if (score <= 50) {
                    return "#aa5";
                } else if (score <= 60) {
                    return "#8a5";
                } else if (score <= 70) {
                    return "#6a5";
                } else if (score <= 80) {
                    return "#4a4";
                } else if (score <= 90) {
                    return "#3b3";
                } else {
                    return "#2c2";
                }
            }, "more_info": true, "desc": "Частичное решение."},
            "CE": {"color": "#f33", "more_info": false, "desc": "Ошибка компиляции."},
            "SV": {"color": "#f33", "more_info": false, "desc": "Код-стайла не существует."},
            "PS0": {"color": "#c33", "more_info": false, "desc": "0 баллов. Skill Issue"},
            "??": {"color": "#eee", "more_info": true, "desc": "Неизвестный вердикт. Обратитесь к создателю расширения."}
        };
        var to_inform = [];
        for (var tbl of document.getElementsByClassName("table")) {
            var olymp_mode = false;
            if (tbl.childElementCount == 0) continue;
            tbl = tbl.children[0];
            if (tbl.tagName != "TBODY") continue;
            for (var row of tbl.children) {
                if (row.childElementCount < 7) continue;
                if (row.children[0].tagName == "TH") {
                    if (row.children[7].textContent == "Баллы" || row.children[7].textContent == "Score") {
                        olymp_mode = true;
                    }
                    continue;
                }
                var verd = row.children[5].textContent;
                var runid = row.children[0].textContent;
                var testnum = row.children[6].textContent;
                var score = row.children[7].textContent;
                if (RUNNING_VERDICTS.includes(verd)) {
                    untested_new.push(runid);
                } else if (untested_prev.includes(runid)) {
                    if (verd == "Неполное решение" && score == "0") {
                        verd = "Неполное решение 0 баллов";
                    }
                    to_inform.push({id: runid, verd: VERD_NAMES[verd] == undefined ? "??" : VERD_NAMES[verd], test: testnum, score: score});
                }
            }
            // <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;color:green;z-index:9999;font-size:50px">VERY BIG TEXT</div>
        }
        chrome.runtime.sendMessage({action: "set_for_tab", data: {untested: untested_new}});
        // to_inform.push({id:179,verd:"PS",score:78});
        // to_inform.push({id:228,verd:"PS",score:13});
        // to_inform.push({id:444,verd:"PS0",score:0});
        if (to_inform.length > 0) {
            var centered = document.createElement("div");
            centered.classList.add("ejplus-centered");
            var incentered = document.createElement("div");
            incentered.classList.add("ejplus-in-centered");
            olymp_mode = true;
            for (var att of to_inform) {
                var par = document.createElement("div");
                par.style.color = get_or_execute(VERD_DATA[att.verd].color, (olymp_mode ? att.score : att.test));
                var bignd = document.createElement("p");
                bignd.textContent = att.verd + (VERD_DATA[att.verd].more_info ? (olymp_mode ? " " + att.score + " баллов" : " " + att.test) : "");
                bignd.style.fontSize = "60px";
                bignd.style.fontWeight = "bold";
                var midnd1 = document.createElement("p");
                midnd1.textContent = "Посылка №" + att.id + " протестировалась.";
                midnd1.style.fontSize = "20px";
                var midnd2 = document.createElement("p");
                midnd2.textContent = VERD_DATA[att.verd].desc;
                midnd2.style.fontSize = "37px";
                var clickescnode = document.createElement("p");
                clickescnode.textContent = "Нажмите ESC, чтобы закрыть."
                clickescnode.style.fontStyle = "10px";
                par.appendChild(bignd);
                par.appendChild(midnd1);
                par.appendChild(midnd2);
                par.appendChild(clickescnode);
                // var sfxnd = document.createElement("audio");
                // sfxnd.src = chrome.runtime.getURL("sfx/metal-pipe.mp3");
                // sfxnd.muted = false;
                // sfxnd.volume = 0.8;
                // par.appendChild(sfxnd);
                // sfxnd.play();

                incentered.appendChild(par);
            }
            setTimeout(()=>{centered.remove()}, 3000);
            document.addEventListener("keydown", (event) => {
                if (event.key == "Escape") {
                    centered.remove();
                }
            });
            
            centered.appendChild(incentered);
            document.body.appendChild(centered);
        }
    }

    console.log("Ejudge!");
    
    if (!DEFAULT_COLORS) {
        document.getElementById("container").style["background"] = "#333";
        document.getElementById("container").style["box-shadow"] = "none";
        document.getElementById("l12-col").style["background"] = "#333";
        for (elem of document.getElementsByClassName("b1")) {
            elem.style["background"] = "#333";
            if (elem.tagName == "TH") {
                elem.style["color"] = "#77e";
                elem.style["text-shadow"] = "0px 1px 0px #339";
            }
            if (elem.tagName == "TD") {
                elem.style["color"] = "#fff";
            }
        }
        for (elem of document.getElementsByClassName("b0")) {
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
    
    if (document.URL.includes("action=37")) {
        var tbls = document.getElementsByClassName("table");
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