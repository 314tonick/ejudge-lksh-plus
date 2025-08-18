async function makeStandingsBetter() {
    const storedData = await chrome.runtime.sendMessage({action: "get"});
    console.log(storedData);
    for (var prptr in storedData) {
        console.log(prptr);
    }
    var SORT_BY_ALL_OK = storedData.pr_is_ok;
    var ADD_GD_FACES = storedData.fire_in_the_hole;
    var DEFAULT_COLORS = storedData.default_colors;
    var SHOW_CHEATERS = storedData.show_cheaters;
    console.log(SORT_BY_ALL_OK);
    console.log(ADD_GD_FACES);
    console.log(DEFAULT_COLORS);

    function compareTuples(a, b) {
        // Sizes are the same.
        for (var i = 0; i < a.length; ++i) {
            if (a[i] < b[i]) {
                return -1;
            } else if (a[i] > b[i]) {
                return 1;
            }
        }
        return 0;
    }
    function makeGoodTitle(a) {
        if (a.title == "") {
            return;
        }
        txt = a.title;
        a.title = "";
        var title_node = document.createElement("pre");
        title_node.classList.add("parenthover");
        title_node.textContent = txt;
        a.appendChild(title_node);
    }
    if (document.getElementsByClassName("modifiedByEjudgeStandings+").length > 0) {
        return;
    }
    function isAProblem(node) {
        for (var cls of node.classList) {
            if (cls.startsWith("exam")) {
                return false;
            }
        }
        return node.classList.contains("verdict");
    }
    // document.body.append
    document.body.classList.add = "modifiedByEjudgeStandings+";
    if (!DEFAULT_COLORS) {
        document.body.style.background = "#444";
    }
    document.body.style.fontSize = "16px";
    var style_nd_phover = document.createElement("style");
    style_nd_phover.textContent = `
.parenthover {
    z-index: 1;
    display: none;
    position: absolute;
    top: 0;
    background-color: rgba(68, 68, 68, 0.75);
    color: rgb(255, 255, 255);
    font-family: garamond;
    font-weight: bold;
    font-size: 16px;
    border: 1px solid black;
}
td:has(.parenthover) {
    position: relative;
}
td:hover > .parenthover {
    display: block
}`;

    var style_nd = document.createElement("style");
    style_nd.textContent = `
.exam_5 {
    background: #492 !important;
    color: black !important
}
.exam_4 {
    background: #792 !important;
    color: black !important
}
.exam_3 {
    background: #aa2 !important;
    color: black !important
}
.exam_2 {
    background: #843 !important;
    color: black !important
}
`;

    if (!DEFAULT_COLORS) {
        document.head.appendChild(style_nd);
    }
    document.head.append(style_nd_phover);
    for (elem of document.getElementsByClassName("fixed-users")) {
        elem.remove();
    }
    var tbl = document.getElementsByClassName("results");
    if (tbl.length == 0) {
        return;
    } else {
        tbl = tbl[0];
    }
    tbl.classList.add("modifiedByEjudgeStandings+");
    if (!DEFAULT_COLORS) {
        tbl.style.color = "#fff";
        tbl.style.background = "#444";
    }
    var styles = {
        "NO": {"background": "#444", "color": "#444"},
        "OK": {"background": "#251", "color": "#111"},
        "PR": {"background": "#572", "color": "#111"},
        "WA": {"background": "#833", "color": "#111"},
        "TL": {"background": "#535", "color": "#111"},
        "PE": {"background": "#844", "color": "#111"},
        "RT": {"background": "#611", "color": "#111"},
        "RJ": {"background": "#267", "color": "#111"},
        "IG": {"background": "#267", "color": "#111"},
        "DQ": {"background": "#111", "color": "#111"},
        "CF": {"background": "#415", "color": "#111"}
    }
    var okVerdicts = ["OK"];
    if (SORT_BY_ALL_OK) {
        var okVerdicts = ["OK", "PR", "RJ"];
    }
    var tbl = tbl.children[0];
    console.log(tbl);
    var notprob = 0, solind = 0, penind = -1;
    while (!isAProblem(tbl.children[2].children[notprob])) {
        if (tbl.children[2].children[notprob].classList.contains("solved")) {
            solind = notprob;
        }
        if (tbl.children[2].children[notprob].classList.contains("attempts")) {
            penind = notprob;
        }
        notprob++;
    }
    if (penind == -1) {
        var penNd = document.createElement("td");
        penNd.classList.add("attempts-header");
        penNd.textContent = "P";
        penNd.title = "Общее число попыток";
        penNd.rowSpan = 2;
        tbl.children[0].insertBefore(penNd, tbl.children[0].children[solind + 1]);
        for (var i = 2; i < tbl.childElementCount; ++i) {
            var penNd2 = document.createElement("td");
            penNd2.classList.add("attempts");
            penNd2.textContent = "-228";
            tbl.children[i].insertBefore(penNd2, tbl.children[i].children[solind + 1]);
        }
        penind = solind + 1;
        notprob++;
    }
    var num_solved = new Array(tbl.children[1].childElementCount);
    num_solved.fill(0);
    var task_strings = new Array();
    var task_strings_contest = new Array();
    var task_strings_long = new Array();
    var contest_num = tbl.children[0].childElementCount - notprob;
    for (var j = notprob; j < tbl.children[0].childElementCount; ++j) {
        for (var k = 0; k < tbl.children[0].children[j].colSpan; ++k) {
            task_strings_contest.push(contest_num);
            task_strings.push(contest_num + String.fromCharCode(65 + k));
            task_strings_long.push(tbl.children[0].children[j].textContent + ", " + String.fromCharCode(65 + k));
        }
        var crnd = tbl.children[0].children[j];
        if (j + 1 != tbl.children[0].childElementCount) {
            crnd.style["border-right-width"] = "5px";
            crnd.title = "";
        }
        crnd.style['max-width'] = 33 * crnd.colSpan + "px";
        crnd.title = crnd.textContent;
        var max_lng = parseInt(crnd.colSpan * 3.7);
        if (crnd.textContent.length > max_lng) {
            crnd.textContent = crnd.textContent.substr(0, max_lng) + "...";
        }
        crnd.style["border-left-width"] = "5px";
        contest_num--;
    }
    var items = new Array();
    var new_nd = document.createElement("td");
    new_nd.rowSpan = ADD_GD_FACES ? 4 : 3;
    new_nd.title = "PR + RJ";
    new_nd.classList.add("solved_header");
    new_nd.classList.add("half_solved_header");
    new_nd.textContent = "pr";
    tbl.children[0].insertBefore(new_nd, tbl.children[0].children[solind + 1]);
    // penind++;
    console.log("SolInd:", solind);
    console.log("PenInd:", penind);   
    for (var i = 2; i < tbl.childElementCount; ++i) {
        var all_solved = 0, all_penalty = 0, pr_num = 0;
        var row = tbl.children[i];
        for (var j = notprob; j < row.childElementCount; ++j) {
            var element = row.children[j];
            element.style.maxWidth = "25px";
            var verd = element.classList[1];
            if (verd == "PR" || verd == "RJ") {
                pr_num++;
            }
            if (styles[verd] != undefined) {
                if (!DEFAULT_COLORS) {
                    for (key in styles[verd]) {
                        element.style[key] = styles[verd][key];
                    }
                }
                if (j + 1 != row.childElementCount && task_strings_contest[j - notprob] != task_strings_contest[j - notprob + 1]) {
                    row.children[j].style["border-right-width"] = "5px";
                }
                if (j == notprob || task_strings_contest[j - notprob] != task_strings_contest[j - notprob - 1]) {
                    row.children[j].style["border-left-width"] = "5px";
                }
            }
            
            if (element.textContent.at(-1) == " ") {
                element.textContent = element.textContent.substr(0, element.textContent.length - 1);
            }
            if (element.textContent.length >= notprob) {
                element.style.fontSize = "12px";
            }
            var num_att = 0;
            if (verd == "NO") {
                element.title = task_strings[j - notprob] + ": no att.";
            } else if (verd == "DQ") {
                element.title = task_strings[j - notprob] + ": DQ, lol";
            } else if (element.textContent.length == 1) {
                if (verd == "PR") {
                    element.title = task_strings[j - notprob] + ": PR, 0 wrong";
                } else if (verd == "OK") {
                    element.title = task_strings[j - notprob] + ": OK, 0 wrong";
                } else if (verd == "RJ") {
                    element.title = task_strings[j - notprob] + ": RJ, 0 wrong";
                } else if (verd == "CF") {
                    element.title = task_strings[j - notprob] + ": CF, 0 wrong";
                } else {
                    element.title = task_strings[j - notprob] + ": ??, 0 wrong";
                }
            } else {
                var num_att = parseInt(element.textContent.substr(1 + (verd == "PR")));
                if (verd == "OK") {
                    element.title = task_strings[j - notprob] + ": OK, " + num_att + " wrong att.";
                } else if (verd == "PR" && element.textContent.length == 1) {
                    element.title = task_strings[j - notprob] + ": PR, " + num_att + " wrong att.";
                } else {
                    element.title = task_strings[j - notprob] + ": " + verd + ", " + num_att + "att.";
                    if (verd == "RJ") {
                        num_att--;
                    }
                }
            }
            if (okVerdicts.indexOf(verd) != -1) {
                num_solved[j - notprob]++;
                all_solved++;
                all_penalty += num_att;
            }
            // makeGoodTitle(element);
        }
        var new_nd = document.createElement("td");
        new_nd.textContent = pr_num;
        row.insertBefore(new_nd, row.children[penind]);
        items.push([-all_solved, all_penalty, row.children[1].textContent, i - 2]);
        if (SORT_BY_ALL_OK) {
            row.children[solind].textContent = all_solved;
            row.children[penind + 1].textContent = all_penalty;
        }
        row.children[notprob].style["border-right-width"] = "5px";
    }
    // penind++;
    tbl.children[0].children[notprob].style["border-right-width"] = "5px";
    for (var j = 0; j < notprob + 1; ++j) {
        tbl.children[0].children[j].style["border-bottom-width"] = "5px";
        tbl.children[0].children[j].rowSpan = ADD_GD_FACES ? 4 : 3;
    }
    if (SORT_BY_ALL_OK) {
        tbl.children[0].children[solind].title = "OK + PR + RJ";
        items.sort(compareTuples);
        var nodes = new Array(items.length);
        console.log(items);
        for (var i = 0; i < items.length; ++i) {
            nodes[i] = tbl.children[i + 2];
        }
        items.reverse();
        for (var i = 0; i < items.length; ++i) {
            tbl.insertBefore(nodes[items[i][3]], tbl.children[2]);
        }
        for (var i = 0; i < items.length; ++i) {
            tbl.children[i + 2].children[0].textContent = i + 1;
        }
    }
    var names = [];
    for (var i = 2; i < tbl.childElementCount; ++i) {
        names.push(tbl.children[i].children[1].textContent);
    }
    console.log(names);
    var newRow = document.createElement("tr");
    tbl.insertBefore(newRow, tbl.children[2]);
    if (ADD_GD_FACES) {
        var newRow2 = document.createElement("tr");
        tbl.insertBefore(newRow2, tbl.children[3]);
    }
    for (var j = 0; j < tbl.children[1].childElementCount; ++j) {
        tbl.children[1].children[j].style.minWidth = "25px";
        var nd = document.createElement("td");
        nd.style.fontSize = "13px";
        nd.style.maxHeight = "12px";
        nd.classList.add("problem");
        nd.textContent = num_solved[j];
        newRow.appendChild(nd);
        if (ADD_GD_FACES) {
            var nd2 = document.createElement("td");
            nd2.classList.add("problem");
            // nd2.style['text-align'] = "center";
            var img = document.createElement("img");
            img.style['width'] = "25px";
            // img.style['height'] = "25px";
            var per = Math.ceil(num_solved[j] / (tbl.childElementCount - 3) * 100);
            if (per == 0) {
                var url = "icons/silent_demon_face.png";
                var title = "Silent Demon";
            } else if (per <= 3) {
                var url = "icons/extreme_demon_face.png";
                var title = "Extreme Demon";
            } else if (per <= 6) {
                var url = "icons/insane_demon_face.png";
                var title = "Insane Demon";
            } else if (per <= 9) {
                var url = "icons/hard_demon_face.png";
                var title = "Hard Demon";
            } else if (per <= 12) {
                var url = "icons/medium_demon_face.png";
                var title = "Medium Demon";
            } else if (per <= 15) {
                var url = "icons/easy_demon_face.png";
                var title = "Easy Demon";
            } else if (per <= 27) {
                var url = "icons/insane_face.png";
                var title = "Insane";
            } else if (per <= 39) {
                var url = "icons/harder_face.png";
                var title = "Harder";
            } else if (per <= 51) {
                var url = "icons/hard_face.png";
                var title = "Hard";
            } else if (per <= 63) {
                var url = "icons/normal_face.png";
                var title = "Normal";
            } else if (per <= 75) {
                var url = "icons/easy_face.png";
                var title = "Easy";
            } else {
                var url = "icons/auto_face.png";
                var title = "Auto";
            }
            img.src = chrome.runtime.getURL(url);
            nd2.title = title;
            nd2.appendChild(img);
            newRow2.appendChild(nd2);
        }
        if (j + 1 != tbl.children[1].childElementCount && task_strings_contest[j] != task_strings_contest[j + 1]) {
            tbl.children[1].children[j].style["border-right-width"] = "5px";
            nd.style["border-right-width"] = "5px";
            if (ADD_GD_FACES) {
                nd2.style["border-right-width"] = "5px";
            }
        }
        if (j == 0 || task_strings_contest[j] != task_strings_contest[j - 1]) {
            tbl.children[1].children[j].style["border-left-width"] = "5px";
            nd.style["border-left-width"] = "5px";
            if (ADD_GD_FACES) {
                nd2.style["border-left-width"] = "5px";
            }
        }
        if (ADD_GD_FACES) {
            nd2.style["border-bottom-width"] = "5px";
        } else {
            nd.style["border-bottom-width"] = "5px";
        }
    }
    for (tbl2 of document.getElementsByClassName("subm_list")) {
        if (!DEFAULT_COLORS) {
            tbl2.style.color = "#fff";
            tbl2.style.background = "#444";
        }
        tbl2 = tbl2.children[0];
        for (row of tbl2.children) {
            if (row.childElementCount < 4) {
                continue;
            }
            var element = row.children[3];
            var verd = element.classList[1];
            if (styles[verd] != undefined) {
                if (!DEFAULT_COLORS) {
                    for (key in styles[verd]) {
                        element.style[key] = styles[verd][key];
                    }
                }
            }
            var i = names.indexOf(row.children[2].textContent);
            var j = task_strings_long.indexOf(row.children[1].textContent);
            if (i != -1 && j != -1) {
                var node = tbl.children[i + 3 + ADD_GD_FACES].children[j + notprob + 1];
                node.title = node.title + "\n[" + row.children[3].classList[1] + "] - " + row.children[0].textContent;
            } else {
                console.log("Extension bugged on ", node);
            }
        }
    }
    console.log(SHOW_CHEATERS);
    if (!SHOW_CHEATERS) {
        for (var i = 3 + ADD_GD_FACES; i < tbl.childElementCount; ++i) {
            if (tbl.children[i].children[1].textContent.search("Марченко") != -1) {
                var nd = tbl.children[i].children[1];
                nd.textContent = nd.textContent.replace(/Марченко .*$/, "<cheater name was hidden>");
                tbl.children[i].children[2].textContent = "-∞";
                var nnd = tbl.children[i];
                nnd.remove();
                tbl.appendChild(nnd);
            }
        }
        for (var i = 3 + ADD_GD_FACES; i < tbl.childElementCount; ++i) {
            tbl.children[i].children[0].textContent = i - (3 + ADD_GD_FACES) + 1;
        }
    }

    for (element of document.getElementsByTagName("td")) {
        makeGoodTitle(element);
    }
}

makeStandingsBetter();
