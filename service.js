
const FIELDS = {
    pr_is_ok: false,
    fire_in_the_hole: false,
    default_colors: false,
    autorefresh: true,
    autorefresh_time: 200,
    show_cheaters: false
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

            default:
                throw new Error("Unknown action: " + request.action);
        }
    },
);
