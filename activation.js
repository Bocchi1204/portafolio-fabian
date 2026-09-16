(() => {
    const form = document.getElementById('activation-form');
    const key = document.getElementById('product-key');
    const installation = document.getElementById('installation-id');
    const submit = form.querySelector('[type="submit"]');
    const status = document.getElementById('activation-status');
    const result = document.getElementById('activation-result');
    const output = document.getElementById('confirmation-id');
    const copy = document.getElementById('copy-confirmation');
    const { t } = window.portfolioI18n;
    let busy = false;
    let statusKey = '';
    let copied = false;
    let validationShown = false;

    function message(messageKey, error = false) {
        statusKey = messageKey;
        status.textContent = messageKey ? t(messageKey) : '';
        status.dataset.error = String(error);
    }
    function validate() {
        key.setCustomValidity(/^[A-Z0-9]{5}(?:-[A-Z0-9]{5}){4}$/.test(key.value.trim().toUpperCase())
            ? '' : t('invalidKey'));
        installation.setCustomValidity(/^(?:\d{54}|\d{63})$/.test(installation.value.replace(/[\s-]/g, ''))
            ? '' : t('invalidInstallation'));
    }
    document.addEventListener('languagechange', () => {
        status.textContent = statusKey ? t(statusKey) : '';
        copy.textContent = t(copied ? 'copied' : 'copy');
        if (validationShown) validate();
    });
    form.noValidate = true;
    key.addEventListener('input', () => {
        key.setCustomValidity('');
        const value = key.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 25);
        key.value = (value.match(/.{1,5}/g) || []).join('-');
    });
    installation.addEventListener('input', () => installation.setCustomValidity(''));
    form.addEventListener('input', () => {
        result.hidden = true;
        output.textContent = '';
        message('');
    });
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (busy) return;
        const productKey = key.value.trim().toUpperCase();
        const installationId = installation.value.replace(/[\s-]/g, '');
        validationShown = true;
        validate();
        if (!form.reportValidity()) return;
        busy = true;
        submit.disabled = true;
        key.disabled = true;
        installation.disabled = true;
        form.setAttribute('aria-busy', 'true');
        result.hidden = true;
        output.textContent = '';
        message('waiting');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 95000);
        try {
            const response = await fetch('/api/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productKey, installationId }),
                signal: controller.signal,
                cache: 'no-store'
            });
            if (response.status === 404 || response.status === 501) {
                throw new Error('unavailable');
            }
            const data = await response.json();
            if (!response.ok) throw new Error(({ 400: 'invalidInput', 403: 'denied', 413: 'invalidInput', 415: 'invalidInput', 422: 'rejected', 429: 'rateLimit', 502: 'unavailable', 504: 'timeout' })[response.status] || 'failed');
            if (typeof data.confirmationId !== 'string' || !/^[\d\s-]{16,200}$/.test(data.confirmationId)) {
                throw new Error('unexpected');
            }
            output.textContent = data.confirmationId;
            result.hidden = false;
            copied = false;
            copy.textContent = t('copy');
            message('success');
        } catch (error) {
            message(error.name === 'AbortError'
                ? 'timeout'
                : error instanceof TypeError ? 'network'
                : error.message, true);
        } finally {
            clearTimeout(timeout);
            busy = false;
            submit.disabled = false;
            key.disabled = false;
            installation.disabled = false;
            form.removeAttribute('aria-busy');
        }
    });
    copy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(output.textContent);
            copied = true;
            copy.textContent = t('copied');
        } catch {
            message('manualCopy', true);
        }
    });
})();
