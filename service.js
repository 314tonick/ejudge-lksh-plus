
const FIELDS = {
    pr_is_ok: false,
    fire_in_the_hole: false,
    default_colors: false,
    autorefresh: true,
    autorefresh_time: 200,
    show_cheaters: false,
    look_for_testing: true
};

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.action) {
            case "get":
                chrome.storage.local.get(FIELDS).then(sendResponse);
                return true;

            case "set":
                chrome.storage.local.set(request.data);
                return true;

            case "reload":
                try {
                    chrome.tabs.reload(sender.tab.id);
                    return true;
                } catch (e) {
                    return false;
                }
            
            case "set_for_tab":
                chrome.storage.session.set({[String(sender.tab.id)]: request.data});
                return true;

            case "get_for_tab":
                const key = String(sender.tab.id);
                chrome.storage.session.get({[String(sender.tab.id)]: {}}).then(result => {
                  sendResponse(result[key]);
                });;
                return true;

            default:
                throw new Error("Unknown action: " + request.action);
        }
    },
);

const ALLOWED_URLS = /http(s?):\/\/((ejudge\.lksh\.ru)|(ejudge-f\.d\.lksh\.ru)|(inf-open\.ru\/ej))\/.*/;

chrome.webNavigation.onCommitted.addListener(async (details) => {
  
    if (details.frameId !== 0) return;

    console.log(details.url);

    if (!ALLOWED_URLS.test(details.url)) {
        return;
    }
    
    const DEFAULT_COLORS = (await chrome.storage.local.get(FIELDS))["default_colors"];
    if (DEFAULT_COLORS) return;

    chrome.scripting.insertCSS({
        target: { tabId: details.tabId },
        files: ["dark.css"]
    });
});

