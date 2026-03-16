// Workshop configuration
const WORKSHOPS = {
  "1": {
    name: "Tuesday - Building AI Skills and Agents with Joule Studio",
    needsGroup: true,
    invalidGroups: [[35, 38]],
    jouleUrl: "https://joule-studio-lasvegas-insider-js-dbw-eu10.eu10.build.cloud.sap/lobby",
    exerciseUrl: "https://developers.sap.com/mission.joule-studio-codejam.html"
  },
  "2": {
    name: "Wednesday - Getting Started with Joule for Developers",
    needsGroup: false,
    systemUrl: "https://www.sap.com/products/technology-platform/build/trial.html",
    exerciseUrl: "https://github.com/SAP-samples/teched2025-AD160"
  },
  "3": {
    name: "Wednesday - Building AI Skills and Agents with Joule Studio",
    needsGroup: true,
    invalidGroups: [[8, 11]],
    jouleUrl: "https://joule-studio-lasvegas-insider-2-js-dbw-eu10.eu10.build.cloud.sap/lobby",
    exerciseUrl: "https://developers.sap.com/mission.joule-studio-codejam.html"
  }
};

function show(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove("hidden"); el.classList.add("fade-in"); }
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add("hidden"); el.classList.remove("fade-in"); }
}

function onWorkshopChange() {
  const workshopVal = document.getElementById("workshop-select").value;
  const groupInput = document.getElementById("group-input");

  // Reset group input and results
  groupInput.value = "";
  groupInput.classList.remove("input-error", "input-ok");
  hide("group-error");
  hide("result-section");
  hide("creds-block");
  hide("workshop2-block");

  if (!workshopVal) {
    hide("group-section");
    return;
  }

  const workshop = WORKSHOPS[workshopVal];
  if (!workshop) { hide("group-section"); return; }

  if (workshop.needsGroup) {
    show("group-section");
  } else {
    hide("group-section");
    // Workshop 2 - show results directly
    showWorkshop2Results(workshop);
  }
}

function validateGroupNumber(val, workshopVal) {
  if (!/^\d{3}$/.test(val)) {
    return "Please enter exactly 3 digits with leading zeros (e.g. 001, 042).";
  }
  const num = parseInt(val, 10);
  if (num < 1 || num > 199) {
    return "Group number must be between 001 and 199.";
  }
  const workshop = WORKSHOPS[workshopVal];
  if (workshop && workshop.invalidGroups) {
    for (const [lo, hi] of workshop.invalidGroups) {
      if (num >= lo && num <= hi) {
        const loStr = String(lo).padStart(3, "0");
        const hiStr = String(hi).padStart(3, "0");
        return `Group numbers ${loStr}–${hiStr} are not valid for this workshop. Please check your group number.`;
      }
    }
  }
  return null; // valid
}

function onGroupInput() {
  const workshopVal = document.getElementById("workshop-select").value;
  const groupInput = document.getElementById("group-input");
  const val = groupInput.value.replace(/\D/g, "").slice(0, 3);
  groupInput.value = val;

  // Hide results while editing
  hide("result-section");
  hide("creds-block");

  if (val.length === 3) {
    const error = validateGroupNumber(val, workshopVal);
    if (error) {
      groupInput.classList.add("input-error");
      groupInput.classList.remove("input-ok");
      const errEl = document.getElementById("group-error");
      errEl.textContent = error;
      show("group-error");
    } else {
      groupInput.classList.remove("input-error");
      groupInput.classList.add("input-ok");
      hide("group-error");
      showGroupResults(val, workshopVal);
    }
  } else {
    groupInput.classList.remove("input-error", "input-ok");
    hide("group-error");
  }
}

function onGroupBlur() {
  const workshopVal = document.getElementById("workshop-select").value;
  const groupInput = document.getElementById("group-input");
  const val = groupInput.value;

  if (val.length > 0 && val.length < 3) {
    groupInput.classList.add("input-error");
    groupInput.classList.remove("input-ok");
    const errEl = document.getElementById("group-error");
    errEl.textContent = "Group number must be exactly 3 digits (e.g. 001, 042).";
    show("group-error");
  }
}

function showGroupResults(groupNum, workshopVal) {
  const workshop = WORKSHOPS[workshopVal];
  if (!workshop) return;

  const username = "joulestudio-" + groupNum + "@sap.com";

  document.getElementById("res-username").textContent = username;

  const jouleLink = document.getElementById("res-joule");
  jouleLink.href = workshop.jouleUrl;
  jouleLink.textContent = workshop.jouleUrl;

  show("result-section");
  show("creds-block");
  hide("workshop2-block");
}

function showWorkshop2Results(workshop) {
  show("result-section");
  show("workshop2-block");
  hide("creds-block");
}

function copyText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.textContent || el.innerText;
  navigator.clipboard.writeText(text).then(() => {
    // Find the button after this element
    const row = el.closest(".info-row");
    const btn = row ? row.querySelector(".copy-btn") : null;
    if (btn) {
      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 2000);
    }
  }).catch(() => {
    // Fallback for older browsers
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  });
}
