// Workshop configuration
const WORKSHOPS = {
  "1": {
    name: "Tuesday - Building AI Skills and Agents with Joule Studio",
    needsGroup: true,
    invalidGroups: [[35, 38]],
    password: "J!!lEs8P",
    jouleUrl: "https://joule-studio-lasvegas-insider-js-dbw-eu10.eu10.build.cloud.sap/lobby",
    exerciseUrl: "https://developers.sap.com/mission.joule-studio-codejam.html"
  },
  "2": {
    name: "Wednesday - Build SAP Fiori Apps with ABAP Cloud and SAP Joule for Developers",
    needsGroup: false,
    needsEmail: true,
    date: "Wednesday, March 18, 2026",
    time: "TBD",
    exerciseUrl: "https://github.com/SAP-samples/abap-platform-rap120"
  },
  "3": {
    name: "Wednesday - Getting Started with Joule for Developers",
    needsGroup: false,
    systemUrl: "https://www.sap.com/products/technology-platform/build/trial.html",
    systemLabel: "SAP Build Trial Access",
    exerciseUrl: "https://github.com/SAP-samples/teched2025-AD160"
  },
  "4": {
    name: "Wednesday - Building AI Skills and Agents with Joule Studio",
    needsGroup: true,
    invalidGroups: [[8, 11]],
    password: "J!!lEs8P",
    jouleUrl: "https://joule-studio-lasvegas-insider-2-js-dbw-eu10.eu10.build.cloud.sap/lobby",
    exerciseUrl: "https://developers.sap.com/mission.joule-studio-codejam.html"
  }
};

// EmailJS configuration — sign up free at https://www.emailjs.com/
// 1. Create an email service (Gmail, Outlook, etc.) and copy its Service ID.
// 2. Create a template; set the HTML body to {{{html_content}}}, the To field
//    to {{to_email}}, and the Subject to: New Workshop Registration – {{workshop_name}}
// 3. Copy your Public Key from Account > API Keys.
const EMAILJS_CONFIG = {
  serviceId:  "service_rtk75u2",
  templateId: "template_p0wu96g",
  publicKey:  "KPMn76MbU2s75Fb5W",
  toEmail:    "Rich.Heilman@sap.com"
};

function populateWorkshopSelect() {
  const select = document.getElementById("workshop-select");
  if (!select) return;
  Object.keys(WORKSHOPS).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = WORKSHOPS[key].name;
    select.appendChild(option);
  });
}

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
  const emailInput = document.getElementById("email-input");

  // Reset group input and results
  groupInput.value = "";
  groupInput.classList.remove("input-error", "input-ok");
  hide("group-error");

  // Reset email input
  emailInput.value = "";
  emailInput.classList.remove("input-error", "input-ok");
  hide("email-error");

  hide("result-section");
  hide("creds-block");
  hide("workshop2-block");
  hide("workshop-fiori-block");

  if (!workshopVal) {
    hide("group-section");
    hide("email-section");
    return;
  }

  const workshop = WORKSHOPS[workshopVal];
  if (!workshop) { hide("group-section"); hide("email-section"); return; }

  if (workshop.needsGroup) {
    show("group-section");
    hide("email-section");
  } else if (workshop.needsEmail) {
    hide("group-section");
    show("email-section");
  } else {
    hide("group-section");
    hide("email-section");
    // No group or email needed — show results directly
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

function onGroupKeyDown(e) {
  if (e.key === "Enter") {
    onGroupInput();
  }
}

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function onEmailInput() {
  const workshopVal = document.getElementById("workshop-select").value;
  const emailInput = document.getElementById("email-input");
  const val = emailInput.value.trim();

  // Hide results while editing
  hide("result-section");
  hide("workshop-fiori-block");

  if (val.length === 0) {
    emailInput.classList.remove("input-error", "input-ok");
    hide("email-error");
  } else if (validateEmail(val)) {
    emailInput.classList.remove("input-error");
    emailInput.classList.add("input-ok");
    hide("email-error");
    showFioriResults(workshopVal);
  } else {
    // Don't show error while typing — wait for blur
    emailInput.classList.remove("input-error", "input-ok");
    hide("email-error");
  }
}

function onEmailBlur() {
  const emailInput = document.getElementById("email-input");
  const val = emailInput.value.trim();
  if (val.length > 0 && !validateEmail(val)) {
    emailInput.classList.add("input-error");
    emailInput.classList.remove("input-ok");
    const errEl = document.getElementById("email-error");
    errEl.textContent = "Please enter a valid email address.";
    show("email-error");
  }
}

function showGroupResults(groupNum, workshopVal) {
  const workshop = WORKSHOPS[workshopVal];
  if (!workshop) return;

  const username = "joulestudio-" + groupNum + "@sap.com";

  document.getElementById("res-username").textContent = username;
  document.getElementById("res-password").textContent = workshop.password || "";

  const jouleLink = document.getElementById("res-joule");
  jouleLink.href = workshop.jouleUrl;
  jouleLink.textContent = workshop.jouleUrl;

  const exLink = document.getElementById("res-exercise");
  exLink.href = workshop.exerciseUrl;
  exLink.textContent = workshop.exerciseUrl.replace(/^https?:\/\//, "");

  show("result-section");
  show("creds-block");
  hide("workshop2-block");
  hide("workshop-fiori-block");
  document.getElementById("result-section").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showFioriResults(workshopVal) {
  const workshop = WORKSHOPS[workshopVal];
  if (!workshop) return;

  const exLink = document.getElementById("res-exercise-fiori");
  exLink.href = workshop.exerciseUrl;
  exLink.textContent = workshop.exerciseUrl
    ? workshop.exerciseUrl.replace(/^https?:\/\//, "")
    : "—";
  // Reset register button for each new valid email entry
  const btn = document.getElementById("register-btn");
  const status = document.getElementById("register-status");
  btn.disabled = false;
  btn.textContent = "Request Access";
  btn.classList.remove("register-btn-sent");
  status.textContent = "";
  status.className = "register-status";
  show("result-section");
  show("workshop-fiori-block");
  hide("creds-block");
  hide("workshop2-block");
  document.getElementById("result-section").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showWorkshop2Results(workshop) {
  const sysLink = document.getElementById("res-system");
  sysLink.href = workshop.systemUrl;
  sysLink.textContent = workshop.systemLabel || workshop.systemUrl.replace(/^https?:\/\//, "");

  const exLink = document.getElementById("res-exercise2");
  exLink.href = workshop.exerciseUrl;
  exLink.textContent = workshop.exerciseUrl.replace(/^https?:\/\//, "");

  show("result-section");
  show("workshop2-block");
  hide("creds-block");
  hide("workshop-fiori-block");
  document.getElementById("result-section").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(email, workshop) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F5F6F7;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F6F7;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
      <tr>
        <td style="background-color:#0040B0;padding:20px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color:#0070F2;border-radius:4px;padding:4px 9px;"><span style="color:#ffffff;font-size:17px;font-weight:900;letter-spacing:-0.5px;">SAP</span></td>
            <td style="padding:0 14px;"><span style="color:rgba(255,255,255,0.4);font-size:20px;">|</span></td>
            <td><span style="color:#ffffff;font-size:13px;font-weight:600;">SAP Insider Las Vegas 2026</span></td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="background-color:#0070F2;padding:9px 28px;">
          <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Hands-On Workshop Registration</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 28px 28px;">
          <h2 style="color:#1D2D3E;font-size:19px;font-weight:700;margin:0 0 6px 0;">New Workshop Registration</h2>
          <p style="color:#556B82;font-size:14px;line-height:1.6;margin:0 0 24px 0;">An attendee has submitted their SAP Universal ID for the following workshop at SAP Insider Las Vegas 2026.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #D9D9D9;border-collapse:collapse;">
            <tr>
              <td style="width:130px;padding:12px 16px;background-color:#E8F3FE;border-bottom:1px solid #D9D9D9;border-right:1px solid #D9D9D9;font-size:11px;font-weight:700;color:#556B82;text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;">Workshop</td>
              <td style="padding:12px 16px;background-color:#E8F3FE;border-bottom:1px solid #D9D9D9;font-size:14px;font-weight:600;color:#1D2D3E;">${escapeHtml(workshop.name)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #D9D9D9;border-right:1px solid #D9D9D9;font-size:11px;font-weight:700;color:#556B82;text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;">Date</td>
              <td style="padding:12px 16px;border-bottom:1px solid #D9D9D9;font-size:14px;color:#1D2D3E;">${escapeHtml(workshop.date || "\u2014")}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background-color:#F5F6F7;border-bottom:1px solid #D9D9D9;border-right:1px solid #D9D9D9;font-size:11px;font-weight:700;color:#556B82;text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;">Time</td>
              <td style="padding:12px 16px;background-color:#F5F6F7;border-bottom:1px solid #D9D9D9;font-size:14px;color:#1D2D3E;">${escapeHtml(workshop.time || "\u2014")}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #D9D9D9;border-right:1px solid #D9D9D9;font-size:11px;font-weight:700;color:#556B82;text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;">Attendee Email</td>
              <td style="padding:12px 16px;border-bottom:1px solid #D9D9D9;font-size:14px;font-weight:600;color:#0070F2;" data-email="${escapeHtml(email)}">${escapeHtml(email)}&nbsp;&nbsp;<button onclick="(function(btn){navigator.clipboard.writeText(btn.closest('td').dataset.email).then(function(){var t=btn.textContent;btn.textContent='Copied!';btn.style.background='#30914C';setTimeout(function(){btn.textContent=t;btn.style.background='#0070F2';},2000)}).catch(function(){});})(this)" style="background:#0070F2;color:#ffffff;border:none;border-radius:4px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer;font-family:Arial,Helvetica,sans-serif;vertical-align:middle;">Copy to Clipboard</button></td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background-color:#F5F6F7;border-right:1px solid #D9D9D9;font-size:11px;font-weight:700;color:#556B82;text-transform:uppercase;letter-spacing:0.6px;vertical-align:top;">Exercise</td>
              <td style="padding:12px 16px;background-color:#F5F6F7;font-size:14px;"><a href="${escapeHtml(workshop.exerciseUrl)}" style="color:#0070F2;text-decoration:none;">${escapeHtml(workshop.exerciseUrl)}</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background-color:#F5F6F7;border-top:1px solid #D9D9D9;padding:14px 28px;">
          <span style="color:#556B82;font-size:12px;">&copy; 2026 SAP SE &mdash; SAP Insider Las Vegas 2026 &ndash; Hands-On Workshop Portal</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function sendRegistrationEmail(email, workshopVal) {
  const workshop = WORKSHOPS[workshopVal];
  const htmlContent = buildEmailHtml(email, workshop);
  return fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id:     EMAILJS_CONFIG.publicKey,
      template_params: {
        to_email:       EMAILJS_CONFIG.toEmail,
        workshop_name:  workshop.name,
        attendee_email: email,
        html_content:   htmlContent
      }
    })
  });
}

function onRegisterClick() {
  const workshopVal = document.getElementById("workshop-select").value;
  const email = document.getElementById("email-input").value.trim();
  const btn = document.getElementById("register-btn");
  const status = document.getElementById("register-status");

  if (EMAILJS_CONFIG.serviceId === "YOUR_SERVICE_ID") {
    status.textContent = "Email service not yet configured. Contact the workshop organizer.";
    status.className = "register-status register-error";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Sending\u2026";
  status.textContent = "";
  status.className = "register-status";

  sendRegistrationEmail(email, workshopVal)
    .then(res => {
      if (res.ok) {
        btn.textContent = "Sent!";
        btn.classList.add("register-btn-sent");
        status.textContent = "Your request has been sent. Your instructor will inform you once all access is setup.";
        status.className = "register-status register-success";
      } else {
        btn.disabled = false;
        btn.textContent = "Request Access";
        status.textContent = "Could not send registration. Please try again.";
        status.className = "register-status register-error";
      }
    })
    .catch(() => {
      btn.disabled = false;
      btn.textContent = "Request Access";
      status.textContent = "Could not send registration. Please try again.";
      status.className = "register-status register-error";
    });
}

function copyText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.textContent || el.innerText;
  const row = el.closest(".info-row");
  const btn = row ? row.querySelector(".copy-btn") : null;

  const markCopied = () => {
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(markCopied).catch(() => {});
  } else {
    // Fallback: temporary textarea for browsers without Clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.classList.add("clipboard-helper");
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try { document.execCommand("copy"); markCopied(); } catch (e) {}
    document.body.removeChild(textarea);
  }
}

document.addEventListener("DOMContentLoaded", populateWorkshopSelect);
