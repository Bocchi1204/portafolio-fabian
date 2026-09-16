(() => {
    const messages = {
    "jumpForm": {
        "en": "Go to activation form",
        "es": "Ir al formulario de activación"
    },
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
    },
    "guideIntro": {
        "en": "Install Office. Activate your license.",
        "es": "Instala Office. Activa tu licencia."
    },
    "downloadTitle": {
        "en": "Download Office",
        "es": "Descarga Office"
    },
    "downloadBody": {
        "en": "Use the Microsoft download below. This installer is Office Professional Plus 2021 for Windows, in Spanish. Your license must match this edition.",
        "es": "Utiliza la descarga de Microsoft de abajo. Es Office Professional Plus 2021 para Windows, en español. Tu licencia debe corresponder a esta edición."
    },
    "downloadLink": {
        "en": "Download Office 2021",
        "es": "Descargar Office 2021"
    },
    "mountTitle": {
        "en": "Mount and install",
        "es": "Monta e instala"
    },
    "mountBody": {
        "en": "Right-click ProPlus2021Retail.img and choose Mount. Open the new drive, run Setup.exe and wait for installation to finish.",
        "es": "Haz clic derecho en ProPlus2021Retail.img y selecciona Montar. Abre la unidad que aparece, ejecuta Setup.exe y espera a que termine la instalación."
    },
    "keyTitle": {
        "en": "Enter your product key",
        "es": "Introduce tu clave"
    },
    "keyBody": {
        "en": "Open Word from Start. In the activation window, enter the product key you received with your purchase and select Activate Office.",
        "es": "Abre Word desde Inicio. En la ventana de activación, introduce la clave que recibiste con tu compra y selecciona Activar Office."
    },
    "idTitle": {
        "en": "Find your installation ID",
        "es": "Obtén tu ID de instalación"
    },
    "idBody": {
        "en": "If the wizard offers activation by telephone, select it and choose your country or region. Keep the installation ID shown on screen.",
        "es": "Si el asistente ofrece activación por teléfono, selecciónala y elige tu país o región. Conserva el ID de instalación que aparece en pantalla."
    },
    "confirmTitle": {
        "en": "Get the confirmation ID",
        "es": "Obtén el ID de confirmación"
    },
    "confirmBody": {
        "en": "Enter your product key and installation ID in the activation form on this page, then select Get confirmation ID.",
        "es": "Introduce tu clave de producto y tu ID de instalación en el formulario de activación de esta página y selecciona Obtener ID de confirmación."
    },
    "finishTitle": {
        "en": "Complete activation",
        "es": "Completa la activación"
    },
    "finishBody": {
        "en": "Return to the Office wizard, enter the confirmation ID in its corresponding groups and continue. In File > Account, check that Office shows Product Activated.",
        "es": "Vuelve al asistente de Office, introduce el ID de confirmación en los grupos correspondientes y continúa. En Archivo > Cuenta, comprueba que Office indique Producto activado."
    },
    "smartTitle": {
        "en": "Windows blocks the installer?",
        "es": "¿Windows bloquea el instalador?"
    },
    "sac1": {
        "en": "Open Settings > Privacy & security > Windows Security.",
        "es": "Abre Configuración > Privacidad y seguridad > Seguridad de Windows."
    },
    "sac2": {
        "en": "Select App & browser control > Smart App Control settings.",
        "es": "Selecciona Control de aplicaciones y exploradores > Configuración del control inteligente de aplicaciones."
    },
    "sac3": {
        "en": "Choose Off and confirm the Windows prompt.",
        "es": "Elige Desactivado y confirma el aviso de Windows."
    },
    "smartSource": {
        "en": "Microsoft guidance",
        "es": "Ayuda de Microsoft"
    }
};
    const panel = document.getElementById('activacion-licencias');
    let language = 'en';
    const t = key => messages[key]?.[language] || messages.failed[language];
    function setLanguage(next) {
        language = next === 'es' ? 'es' : 'en';
        panel.lang = language;
        document.getElementById("activation-intro").lang = language;
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
