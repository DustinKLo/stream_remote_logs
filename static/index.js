document.querySelector(".loader").style.display = "none";
let triggerStop = false;
let offset = 0;

const FILE_LOCATION_LS = "file-location";
const HOST_LS = "host";
var host = document.querySelector("#host");
var fileLocation = document.querySelector("#file-location");

host.value = localStorage.getItem(HOST_LS) || "";
fileLocation.value = localStorage.getItem(FILE_LOCATION_LS) || "";

const setLS = () => {
  localStorage.setItem(FILE_LOCATION_LS, fileLocation.value);
  localStorage.setItem(HOST_LS, host.value);
};

const getLogs = async () => {
  // promise will resolve when the network call succeeds
  const data = new FormData();
  data.append("host", host.value);
  data.append("location", fileLocation.value);
  data.append("start", offset);
  var apiCall = fetch("/stream", { method: "POST", body: data });
  document.querySelector(".loader").style.display = "block";

  // promise will resolve when X seconds have passed
  const timeout = new Promise((res, _) => setTimeout(res, 2000, null));

  Promise.all([apiCall, timeout])
    .then(([res, _]) => {
      if (res.ok) return Promise.resolve(res.text());
      else throw "response bad";
    })
    .then((d) => {
      offset += parseInt(d.length);
      document.querySelector("#logs").textContent += d;
      getLogs();
    })
    .catch((err) => {
      console.error(err);
    });

  /* using async await
  try {
    const [res, _] = await Promise.all([apiCall, timeout]);
    if (!res.ok) throw res.statusText;

    const d = await res.text();
    offset += parseInt(d.length);
    document.querySelector("#logs").textContent += d;
    getLogs();
  } catch (err) {
    console.error(err);
  }
  */
};

const handleSubmit = () => {
  clearLogs();
  setLS();
  getLogs();
};

const clearLogs = () => (document.querySelector("#logs").textContent = "");

const stopLogs = () => (triggerStop = true);
