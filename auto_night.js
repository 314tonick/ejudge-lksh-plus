// async function makeDarkBackground() {
//     const storedData = await chrome.runtime.sendMessage({action: "get"});
//     var DEFAULT_COLORS = storedData.default_colors;
//     if (!DEFAULT_COLORS) {
//         var style_nd = document.createElement("style");
//     style_nd.textContent = `body:
// {
//     background: "#22f" !important
// }

// #main-cont:
// {
//     background: "#22f" !important
// }

// `;
//         document.head.appendChild(style_nd);
//         console.log("Something");
//     }
// }
// makeDarkBackground();