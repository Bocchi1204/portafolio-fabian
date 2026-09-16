(() => {
    const messages = {
    "activation": {
        "en": "License activation",
        "es": "Activación de licencias"
    },
    "productKey": {
        "en": "Product key",
        "es": "Clave de producto"
    },
    "installation": {
        "en": "Installation ID",
        "es": "ID de instalación"
    },
    "submit": {
        "en": "Get confirmation ID",
        "es": "Obtener ID de confirmación"
    },
    "confirmation": {
        "en": "Confirmation ID",
        "es": "ID de confirmación"
    },
    "copy": {
        "en": "Copy code",
        "es": "Copiar código"
    },
    "language": {
        "en": "Language",
        "es": "Idioma"
    },
    "invalidKey": {
        "en": "Enter the 25 characters of your product key.",
        "es": "Introduce los 25 caracteres de tu clave de producto."
    },
    "invalidInstallation": {
        "en": "Enter a 54- or 63-digit installation ID.",
        "es": "Introduce un ID de instalación de 54 o 63 dígitos."
    },
    "waiting": {
        "en": "Requesting confirmation ID…",
        "es": "Solicitando ID de confirmación…"
    },
    "unavailable": {
        "en": "The activation service is unavailable.",
        "es": "El servicio de activación no está disponible."
    },
    "failed": {
        "en": "The request could not be completed.",
        "es": "No se pudo completar la solicitud."
    },
    "unexpected": {
        "en": "The service returned an unexpected response.",
        "es": "El servicio devolvió una respuesta inesperada."
    },
    "success": {
        "en": "Confirmation ID received.",
        "es": "ID de confirmación recibido."
    },
    "timeout": {
        "en": "The request timed out. Its result is unknown.",
        "es": "La solicitud tardó demasiado. Su resultado es desconocido."
    },
    "network": {
        "en": "Could not connect to the service. Try again later.",
        "es": "No se pudo conectar con el servicio. Inténtalo más tarde."
    },
    "copied": {
        "en": "Code copied",
        "es": "Código copiado"
    },
    "manualCopy": {
        "en": "Select the code and copy it manually.",
        "es": "Selecciona el código y cópialo manualmente."
    },
    "invalidInput": {
        "en": "Check the product key and installation ID.",
        "es": "Revisa la clave y el ID de instalación."
    },
    "denied": {
        "en": "The request was not allowed.",
        "es": "La solicitud no está permitida."
    },
    "rejected": {
        "en": "No confirmation ID was returned. Check your license details.",
        "es": "No se recibió un ID de confirmación. Revisa los datos de tu licencia."
    },
    "rateLimit": {
        "en": "Wait one minute before trying again.",
        "es": "Espera un minuto antes de realizar otra solicitud."
    }
};
    const panel = document.getElementById('activacion-licencias');
    let language = 'en';
    const t = key => messages[key]?.[language] || messages.failed[language];
    function setLanguage(next) {
        language = next === 'es' ? 'es' : 'en';
        panel.lang = language;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            element.textContent = t(element.dataset.i18n);
        });
        ['aria-label', 'alt', 'placeholder'].forEach(attribute => {
            document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
                element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
            });
        });
        document.querySelectorAll('[data-language]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.language === language));
        });
        try { localStorage.setItem('activation-language', language); } catch {}
        document.dispatchEvent(new Event('languagechange'));
    }
    window.portfolioI18n = { t, setLanguage };
    document.querySelectorAll('[data-language]').forEach(button => {
        button.addEventListener('click', () => setLanguage(button.dataset.language));
    });
    let saved = 'en';
    try { saved = localStorage.getItem('activation-language') || 'en'; } catch {}
    setLanguage(saved);
})();
