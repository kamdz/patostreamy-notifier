function getJSON(url, cb) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    if (xhr.status != 200 || xhr.readyState != 4) return;
    cb(JSON.parse(xhr.responseText));
  }
  xhr.send();
};

var data = [];
let channels = [];

(function update() {
  getJSON("https://patostreamy.herokuapp.com/api/channels", (response) => {
    const active = response.filter((channel) => channel.online);
    data = active.map(({ title, thumbnail, streamUrl, platform, viewers }) => ({ title, thumbnail, streamUrl, platform, viewers }));
    const names = active.map(({ title }) => title);
    const fresh = names.filter(name => !channels.includes(name));

    const count = names.length;
    const badge = count > 0 ? String(count) : "";
    const popup = count > 0 ? "popup.html" : "";

    chrome.browserAction.setBadgeText({ text: badge });
    chrome.browserAction.setPopup({ popup: popup });
    chrome.browserAction.setTitle({ title: names.length > 1 ? `Aktualnie nadają: ${names.join(", ")}` : `${names[0]} nadaje` });

    if (fresh.length) {
      chrome.storage.sync.get(['notifications'], function (result) {
        if (result.notifications) {
          const text = fresh.length > 1 ? `${fresh.join(", ")} rozpoczęli transmisje` : `${fresh[0]} zaczął transmisję`;
          const options = {
            type: "basic",
            title: "Patostreamy",
            message: text,
            iconUrl: "icons/icon128.png"
          };
          chrome.notifications.create('patostream', options);
        }
      });
    }
    channels = names;

    setTimeout(update, 60000);
  });
})();