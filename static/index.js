"use strict";

const loader = document.querySelector(".loader");
loader.style.display = "none";

let triggerStop = false;
let offset = 0;

const FILE_LOCATION_LS = "file-location";
const HOST_LS = "host";
const IS_LOCAL_LS = "is-local";

let hostEle = document.querySelector("#host");
let fileLocationEle = document.querySelector("#file-location");

let isLocalEle = document.querySelector("#is-local");
let isLocalInitial =
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

// retrieves the logs from server
const getLogs = async () => {
  const isLocal = isLocalEle.checked;

  const data = new FormData();
  if (!isLocal) data.append("host", hostEle.value);
  data.append("location", fileLocationEle.value);
  data.append("start", offset);

  // promise will resolve when the network call succeeds
  const url = isLocal ? "/stream-local" : "/stream";
  let apiCall = fetch(url, { method: "POST", body: data });
  loader.style.display = "block";

  // promise will resolve when X seconds have passed
  const timeout = new Promise((res, _) => setTimeout(res, 2000, null));

  try {
    // waiting for both timeout and network call to finish
    const [res, _] = await Promise.all([apiCall, timeout]);
    if (!res.ok) {
      triggerStop = false;
      loader.style.display = "none";
      throw res.statusText;
    }

    const d = await res.text();
    offset += parseInt(d.length);
    document.querySelector(".logs").textContent += d;

    const logsWrapper = document.querySelector(".logs-wrapper");
    logsWrapper.scrollTop = logsWrapper.scrollHeight; // scroll to bottom of logs

    if (!triggerStop) loader.style.display = "none";
  } catch (err) {
    triggerStop = false;
    loader.style.display = "none";
    console.error(err);
  }
};

const handleSubmit = async () => {
  offset = 0;
  triggerStop = false;
  clearLogs();
  setLS();
  // await allows us to run this in the background without blocking the event loop
  while (!triggerStop) await getLogs();
};

const clearLogs = () => (document.querySelector(".logs").textContent = "");

const stopLogs = () => {
  triggerStop = true;
  document.querySelector(".loader").style.display = "none";
};
