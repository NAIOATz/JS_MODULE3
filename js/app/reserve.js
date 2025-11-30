import '../../css/output.css';
import { getIdDeclaredPlan, postDeclaredPlan, putDeclaredPlan } from '../libs/declaredPlans'
import { getstudyPlans } from '../libs/studyPlans'
import { $, Dialog } from '../ui/ui'
import { requiredAuth, tokenAuth, logoutAuth } from '../auth/authgate'

//Global Variable in reserve.js Only
let hasDeclared = false;
let currentPlanId = null;

const SELECTORS = {
  fullName: '.ecors-fullname',
  signOutButton: '.ecors-button-signout',
  planDropdown: '.ecors-dropdown-plan',
  declareButton: '.ecors-button-declare',
  changeButton: '.ecors-button-change',
  declaredStatus: '.ecors-declared-plan',
  dialog: '.ecors-dialog',
  dialogMessage: '.ecors-dialog-message',
  dialogOkButton: '.ecors-button-dialog',
}

async function init() {// ตัวควบคุมหลัก เช็ค Auth ถ้าอยากโหลดข้อมูลเพิ่ม ให้เรียกตรงนี้
  try {
    await requiredAuth();
    setUserName();
    setupDeclaredStatus();
    setupSignOut();
    clickDeclaredPlan();
    await loadStudyPlans();
  } catch (err) {
    console.error(err);
  }
}

async function setUserName() {
  const span = $(SELECTORS.fullName);
  const token = tokenAuth();
  const fullName =
    token.name ||
    [token.given_name, token.family_name].filter(Boolean).join(' ') ||
    '(unknown user)';
  span.textContent = fullName;
}

function setupSignOut() {
  const btn = document.querySelector('.ecors-button-signout');
  btn.addEventListener('click', () => {
    logoutAuth();
  });
}

async function loadStudyPlans() {
  try {
    const selectEl = $(SELECTORS.planDropdown);
    const plan = await getstudyPlans();
    selectEl.innerHTML = '<option value="">-- Select Major --</option>';
    plan.data.forEach((plan) => {
      const opt = document.createElement('option');
      opt.value = plan.id;
      opt.className = 'ecors-plan-row';
      opt.textContent = `${plan.planCode} - ${plan.nameEng}`;
      selectEl.appendChild(opt)
    });
  } catch (err) {
    console.log(err);
  }
}

async function setupDeclaredStatus() {
  try {
    const element = $(SELECTORS.declaredStatus);
    const btnDeclare = $(SELECTORS.declareButton);
    const btnChange = $(SELECTORS.changeButton);
    const dropdown = $(SELECTORS.planDropdown);

    const token = tokenAuth();
    const result = await getIdDeclaredPlan(token.preferred_username);
    if (!result || result === 404 || Number.isInteger(result)) {
      hasDeclared = false;
      currentPlanId = null;
      element.textContent = 'Not Declared';
      btnDeclare.disabled = true;
      btnChange.hidden = true;
      btnChange.disabled = true;
      return;
    }

    const data = result.data;
    hasDeclared = true;
    currentPlanId = data.planId;

    const plans = await getstudyPlans();
    const planList = Array.isArray(plans.data) ? plans.data : [];
    const selectedPlan = planList.find(p => p.id === result.data.planId);
    if (dropdown) {
      dropdown.value = String(currentPlanId);  // dropdown ชี้ที่แผนปัจจุบัน
    }

    btnDeclare.hidden = true;
    btnDeclare.disabled = true;
    btnChange.hidden = false;
    btnChange.disabled = true;

    const planCode = selectedPlan.planCode;
    const planName = selectedPlan.nameEng;
    const declaredAt = new Date(result.data.updatedAt);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const datePart = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone,
    }).format(declaredAt);

    const timePart = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    }).format(declaredAt);

    element.innerHTML = `Declared ${planCode} - ${planName} on ${datePart}, ${timePart} (${timeZone})`;
  } catch (err) {
    console.error(err);
    const btndeclared = $(SELECTORS.declareButton);
    const btnchange = $(SELECTORS.changeButton);
    if (btndeclared && btnchange) {
      btnDeclare.hidden = false;
      btnDeclare.disabled = true;
      btnChange.hidden = true;
      btnChange.disabled = true;
    }
  }
}

async function clickDeclaredPlan() {
  const btnDeclare = $(SELECTORS.declareButton);
  const dropdown = $(SELECTORS.planDropdown);
  const btnChange = $(SELECTORS.changeButton);
  dropdown.addEventListener('change', () => {
    const selected = dropdown.value ? Number(dropdown.value) : null;
    if (!hasDeclared) {
      btnDeclare.hidden = false;
      btnChange.hidden = true;
      if (selected) {
        btnDeclare.disabled = false;
      } else {
        btnDeclare.disabled = true;
      }
      return;
    }

    btnDeclare.hidden = true;
    btnDeclare.disabled = true;
    btnChange.hidden = false;
    btnChange.disabled = false;

    if (!selected || selected === currentPlanId) {
      btnChange.disabled = true;
    }
  })
  btnDeclare.addEventListener('click', async () => {
    const token = tokenAuth();

    const res = await postDeclaredPlan(token.preferred_username, dropdown.value);
    if (Number.isInteger(res)) {
      switch (res) {
        case 409: Dialog("You may have declared study plan already. Please check again."); break;
      }
    }
    setupDeclaredStatus()
  })

  btnChange.addEventListener('click', async () => {
    const token = tokenAuth();

    const res = await putDeclaredPlan(token.preferred_username, dropdown.value);
    const result = await getIdDeclaredPlan(token.preferred_username)
    currentPlanId = result.data.planId;
    hasDeclared = true;
    btnChange.disabled = true;

    await setupDeclaredStatus();
    Dialog('Declaration updated.');
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { init(); }, 100);
});
