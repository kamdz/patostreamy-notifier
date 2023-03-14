const formatListItem = channel =>
  `<li><div><a target="_blank" href="${channel.streamUrl}"><img src="${channel.thumbnail}" title="${channel.platform}" /></a></div><div><a target="_blank" href="${channel.streamUrl}">${channel.title}</a><br><i>${channel.viewers} widzów</i></div></li>`;

window.onload = () => {
  chrome.storage.local.get('channels').then(result => {
    document.getElementById('list').innerHTML = '';
    JSON.parse(result.channels).forEach(channel => {
      document.getElementById('list').innerHTML += formatListItem(channel);
    });
  });
  chrome.storage.sync.get(['notifications']).then(result => {
    document.getElementById('notifications').checked = result.notifications;
  });
  let f;
  document
    .getElementById('notifications')
    .addEventListener('change', event =>
      chrome.storage.sync.set({ notifications: event.target.checked })
    );
};
