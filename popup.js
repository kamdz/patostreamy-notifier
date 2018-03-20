window.onload = () => {
  const data = chrome.extension.getBackgroundPage().data;
  document.getElementById("list").innerHTML = "";
  data.forEach((channel) => {
    const text = `<li><div><a target="_blank" href="${channel.streamUrl}"><img src="${channel.thumbnail}" title="${channel.platform}" /></a></div><div><a target="_blank" href="${channel.streamUrl}">${channel.title}</a><br><i>${channel.viewers} widzów</i></div></li>`;
    document.getElementById("list").innerHTML += text;
  });
  chrome.storage.sync.get(['notifications'], function (result) {
    document.getElementById("notifications").checked = result.notifications;
  });
  document.getElementById("notifications").addEventListener('change', function () {
    chrome.storage.sync.set({ notifications: this.checked });
  });
};