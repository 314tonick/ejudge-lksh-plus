const pr_is_ok_checkbox = document.getElementById("pr_is_ok");
const fire_in_the_hole_checkbox = document.getElementById("fire_in_the_hole");
const default_colors_checkbox = document.getElementById("default_colors");
const autorefresh_time_input = document.getElementById("autorefresh_time");
const autorefresh_checkbox = document.getElementById("autorefresh_checkbox");
const show_cheaters_checkbox = document.getElementById("show_cheaters");
const look_for_testing_checkbox = document.getElementById("look_for_testing");

console.log(look_for_testing_checkbox);

chrome.runtime
    .sendMessage({action: "get"})
    .then(response => {
        pr_is_ok_checkbox.checked = response.pr_is_ok;
        fire_in_the_hole_checkbox.checked = response.fire_in_the_hole;
        default_colors.checked = response.default_colors;
        autorefresh_checkbox.checked = response.autorefresh;
        autorefresh_time_input.value = response.autorefresh_time;
        show_cheaters_checkbox.value = response.show_cheaters;
        look_for_testing_checkbox.checked = response.look_for_testing;
    },
);

pr_is_ok_checkbox.onchange = () => {
    chrome.runtime.sendMessage({action: "set",
            data: {pr_is_ok: pr_is_ok_checkbox.checked}
    });
    console.log("something");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
})};

fire_in_the_hole_checkbox.onchange = () => {
    chrome.runtime.sendMessage({action: "set",
            data: {fire_in_the_hole: fire_in_the_hole_checkbox.checked}
    });
    console.log("something");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
})};

default_colors_checkbox.onchange = () => {
    chrome.runtime.sendMessage({action: "set",
            data: {default_colors: default_colors_checkbox.checked}
    });
    console.log("something");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
})};

autorefresh_checkbox.onchange = () => {
    chrome.runtime.sendMessage({action: "set",
            data: {autorefresh: autorefresh_checkbox.checked}
    });
    console.log("something");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
})};

show_cheaters_checkbox.onchange = () => {
    chrome.runtime.sendMessage({action: "set",
            data: {show_cheaters: show_cheaters_checkbox.checked}
    });
    console.log("something");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
})};

look_for_testing_checkbox.onchange = () => {
    chrome.runtime.sendMessage({action: "set",
            data: {look_for_testing: look_for_testing_checkbox.checked}
    });
    console.log("something");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
})};


let prev_value = "";
function checkInt(e) {
    console.log(e);
    let value = e.target.value;
    
    if (value.match(/^[1-9][0-9]*$/)) {
        prev_value = value;
        chrome.runtime.sendMessage({action: "set",
            data: {autorefresh_time: value}});
        console.log("changed refresh time");
    } else {
        e.target.value = prev_value;
    }
    return;
}

autorefresh_time_input.addEventListener("input", checkInt);
