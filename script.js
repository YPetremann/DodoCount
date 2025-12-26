document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    const dateForm = document.getElementById('dateForm');
    const resultContainer = document.getElementById('resultContent');
    const errorContainer = document.getElementById('errorContent');

    if (dateForm) {
        // We are on index.html
        handleIndexPage();
    } else if (resultContainer) {
        // We are on count.html
        handleCountPage();
    }
});

function handleIndexPage() {
    const form = document.getElementById('dateForm');
    const dateInput = document.getElementById('targetDate');

    // Set min date to tomorrow (can't count dodos for today or past)
    const today = new Date();
    today.setDate(today.getDate() + 1); // logic: at least 1 sleep
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedDate = dateInput.value;
        if (selectedDate) {
            window.location.href = `count.html?date=${selectedDate}`;
        }
    });
}

function handleCountPage() {
    const params = new URLSearchParams(window.location.search);
    const targetDateStr = params.get('date');

    if (!targetDateStr) {
        showError();
        return;
    }

    const targetDate = new Date(targetDateStr);
    const now = new Date();

    // Reset hours to compare "calendar days" aka nights/dodos
    // We want to count how many nights stand between now and the target date.
    // Basically, how many midnights.
    const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDayTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    // Check validity
    if (isNaN(startOfDayTarget.getTime())) {
        showError();
        return;
    }

    const diffTime = startOfDayTarget - startOfDayNow;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        showError(); // Date in past
    } else {
        showResult(diffDays, startOfDayTarget);
    }
}

function showResult(days, targetDateObj) {
    const countEl = document.getElementById('dodoCount');
    const labelEl = document.getElementById('dodoLabel');
    const dateDisplayEl = document.getElementById('targetDateDisplay');

    // Format date in French
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplayEl.textContent = targetDateObj.toLocaleDateString('fr-FR', options);

    // Animation for the number
    animateValue(countEl, 0, days, 1000);

    // Pluralization
    labelEl.textContent = days <= 1 ? "dodo" : "dodos";
}

function showError() {
    document.getElementById('resultContent').classList.add('hidden');
    document.getElementById('errorContent').classList.remove('hidden');
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
