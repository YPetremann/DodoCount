document.addEventListener('DOMContentLoaded', handleCountPage)

function handleCountPage() {
    const params = new URLSearchParams(window.location.search);
    const targetDateStr = params.get('date');

    if (!targetDateStr) return showError();

    const targetDate = new Date(targetDateStr);
    const now = new Date();

    const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDayTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (isNaN(startOfDayTarget.getTime())) return showError();

    const diffTime = startOfDayTarget - startOfDayNow;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return showError(); // Date in past

    showResult(diffDays, startOfDayTarget);
}

function showResult(days, targetDateObj) {
    const countEl = document.getElementById('dodoCount');
    const labelEl = document.getElementById('dodoLabel');
    const dateDisplayEl = document.getElementById('targetDateDisplay');

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplayEl.textContent = targetDateObj.toLocaleDateString('fr-FR', options);

    animateValue(countEl, 0, days, 500);

    labelEl.textContent = days <= 1 ? "dodo" : "dodos";
}

function showError() {
    document.getElementById('resultContent').classList.add('hidden');
    document.getElementById('errorContent').classList.remove('hidden');
}

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function animateValue(obj, start, end, duration) {
    for (let i = start; i <= end; i++) {
        obj.innerHTML = i;
        await timeout(duration / (end - start));
    }
}
