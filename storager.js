const pr_is_ok_checkbox = document.getElementById("pr_is_ok");
const fire_in_the_hole_checkbox = document.getElementById("fire_in_the_hole");
const default_colors_checkbox = document.getElementById("default_colors");

console.log(pr_is_ok_checkbox);
console.log(fire_in_the_hole_checkbox);

chrome.runtime
    .sendMessage({action: "get"})
    .then(response => {
        pr_is_ok_checkbox.checked = response.pr_is_ok;
        fire_in_the_hole_checkbox.checked = response.fire_in_the_hole;
        default_colors.checked = response.default_colors;
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