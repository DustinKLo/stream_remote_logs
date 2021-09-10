"use strict";

document.querySelector(".loader").style.display = "none";

let triggerStop = false;
let offset = 0;

const FILE_LOCATION_LS = "file-location";
const HOST_LS = "host";
const IS_LOCAL_LS = "is-local";

var hostEle = document.querySelector("#host");
var fileLocationEle = document.querySelector("#file-location");

var isLocalEle = document.querySelector("#is-local");
var isLocalInitial =
  localStorage.getItem(IS_LOCAL_LS) === "true" ? true : false;

isLocalEle.checked = isLocalInitial;
if (isLocalInitial)
  document.querySelector("#host-wrapper").style.display = "none";

hostEle.value = localStorage.getItem(HOST_LS) || "";
fileLocationEle.value = localStorage.getItem(FILE_LOCATION_LS) || "";

const toggleHost = () => {
  const host = document.querySelector("#host-wrapper");
  if (isLocalEle.checked) host.style.display = "none";
  else host.style.display = "inline-block";
};

const setLS = () => {
  localStorage.setItem(FILE_LOCATION_LS, fileLocationEle.value);
  localStorage.setItem(HOST_LS, hostEle.value);
  localStorage.setItem(IS_LOCAL_LS, isLocalEle.checked);
};

const getLogs = async () => {
  const isLocal = isLocalEle.checked;

  const data = new FormData();
  if (!isLocal) data.append("host", hostEle.value);
  data.append("location", fileLocationEle.value);
  data.append("start", offset);

  // promise will resolve when the network call succeeds
  if (isLocal)
    var apiCall = fetch("/stream-local", { method: "POST", body: data });
  else var apiCall = fetch("/stream", { method: "POST", body: data });
  document.querySelector(".loader").style.display = "block";

  // promise will resolve when X seconds have passed
  const timeout = new Promise((res, _) => setTimeout(res, 2000, null));

  Promise.all([apiCall, timeout])
    .then(([res, _]) => {
      if (!res.ok) {
        triggerStop = false;
        document.querySelector(".loader").style.display = "none";
        throw "response bad";
      }
      return Promise.resolve(res.text());
    })
    .then((d) => {
      offset += parseInt(d.length);
      document.querySelector(".logs").textContent += d;

      const logsWrapper = document.querySelector(".logs-wrapper");
      logsWrapper.scrollTop = logsWrapper.scrollHeight;
      if (!triggerStop) {
        document.querySelector(".loader").style.display = "none";
        getLogs();
      }
    })
    .catch((err) => {
      triggerStop = false;
      document.querySelector(".loader").style.display = "none";
      console.error(err);
    });

  /* using async await
  try {
    const [res, _] = await Promise.all([apiCall, timeout]);
    if (!res.ok) {
      triggerStop = false;
      document.querySelector(".loader").style.display = "none";
      throw res.statusText;
    }

    const d = await res.text();
    offset += parseInt(d.length);
    document.querySelector(".logs").textContent += d;

    const logsWrapper = document.querySelector(".logs-wrapper");
    logsWrapper.scrollTop = logsWrapper.scrollHeight;
    if (!triggerStop) {
      document.querySelector(".loader").style.display = "none";
      getLogs();
    }
  } catch (err) {
    triggerStop = false;
    document.querySelector(".loader").style.display = "none";
    console.error(err);
  }
  */
};

const handleSubmit = () => {
  offset = 0;
  triggerStop = false;
  clearLogs();
  setLS();
  getLogs();
};

const clearLogs = () => (document.querySelector(".logs").textContent = "");

const stopLogs = () => {
  triggerStop = true;
  document.querySelector(".loader").style.display = "none";
};
