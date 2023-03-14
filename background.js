const formatBadge = channels =>
  channels.length > 0 ? String(channels.length) : '';
const formatTitle = channels =>
  channels.length > 1
    ? `Aktualnie nadają: ${channels.join(', ')}`
    : `${channels[0] || 'Nikt aktualnie nie'} nadaje`;
const formatNotification = channels =>
  channels.length > 1
    ? `${channels.join(', ')} rozpoczęli transmisje`
    : `${channels[0]} zaczął transmisję`;

const cache = { channelNames: [] };

(async function update() {
  const fetchUrl = await fetch('https://patostreamy.com/api/channels');
  const response = await fetchUrl.json();
  const activeChannels = response.filter(channel => channel.online);

  chrome.storage.local
    .set({ channels: JSON.stringify(activeChannels) })
    .then(() => {
      const activeChannelsNames = activeChannels.map(({ title }) => title);

      chrome.action.setBadgeText({ text: formatBadge(activeChannelsNames) });
      chrome.action.setPopup({
        popup: activeChannelsNames.length > 0 ? 'popup.html' : ''
      });
      chrome.action.setTitle({
        title: formatTitle(activeChannelsNames)
      });

      const newChannelNames = activeChannelsNames.filter(
        name => !cache.channelNames.includes(name)
      );

      if (newChannelNames.length) {
        cache.channelNames = activeChannelsNames;
        chrome.storage.sync.get(['notifications']).then(result => {
          if (result.notifications) {
            chrome.notifications.create('patostream', {
              type: 'basic',
              title: 'Patostreamy',
              message: formatNotification(newChannelNames),
              iconUrl: 'icons/icon128.png'
            });
          }
        });
      }
    });

  setTimeout(update, 60000);
})();
