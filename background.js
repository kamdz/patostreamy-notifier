var data = [];
var channels = [];

(async function update() {
	const fetchUrl = await fetch('https://patostreamy.com/api/channels');
	const response = await fetchUrl.json();

	const active = response.filter((channel) => channel.online);
	data = active.map(({ title, thumbnail, streamUrl, platform, viewers }) => ({ title, thumbnail, streamUrl, platform, viewers }));
	const names = active.map(({ title }) => title);
	const fresh = names.filter(name => !channels.includes(name));

	const count = names.length;
	const badge = count > 0 ? String(count) : "";
	const popup = count > 0 ? "popup.html" : "";

	chrome.action.setBadgeText({ text: badge });
	chrome.action.setPopup({ popup: popup });
	chrome.action.setTitle({ title: names.length > 1 ? `Aktualnie nadają: ${names.join(", ")}` : `${names[0] || 'Nikt aktualnie nie'} nadaje` });

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

	data = JSON.stringify(data);
	chrome.storage.sync.set({data});

	setTimeout(update, 60000);
})();