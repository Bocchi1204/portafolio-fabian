const endpoint = 'https://getcid.us/getdata.php';

export async function requestConfirmation(input, fetchUpstream = fetch) {
    if (!input || typeof input.productKey !== 'string' || typeof input.installationId !== 'string') {
        return { status: 400, body: { error: 'Introduce tu clave y el ID de instalación.' } };
    }
    const key = input.productKey.trim().toUpperCase();
    const id = input.installationId.replace(/[\s-]/g, '');
    if (!/^[A-Z0-9]{5}(?:-[A-Z0-9]{5}){4}$/.test(key) || !/^(?:\d{54}|\d{63})$/.test(id)) {
        return { status: 400, body: { error: 'Revisa el formato de la clave y del ID de instalación.' } };
    }
    const comment = id.match(new RegExp(`.{${id.length / 9}}`, 'g')).join('-');
    try {
        const response = await fetchUpstream(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
            body: new URLSearchParams({ key, comment }).toString(),
            redirect: 'error',
            signal: AbortSignal.timeout(85000)
        });
        if (!response.ok) return { status: 502, body: { error: 'GetCID no está disponible para esta solicitud.' } };
        const data = await response.json();
        if (data.have_cid != 1) {
            return { status: 422, body: { error: 'GetCID no ha devuelto un ID de confirmación. Revisa los datos de tu licencia.' } };
        }
        if (typeof data.confirmationid !== 'string' || !/^[\d\s-]{16,200}$/.test(data.confirmationid)) {
            return { status: 502, body: { error: 'GetCID devolvió una respuesta inesperada.' } };
        }
        return { status: 200, body: { confirmationId: data.confirmationid.trim() } };
    } catch (error) {
        return { status: error.name === 'TimeoutError' ? 504 : 502,
            body: { error: error.name === 'TimeoutError'
                ? 'GetCID no respondió a tiempo. El resultado es desconocido; la solicitud no se ha reenviado.'
                : 'No se pudo completar la conexión con GetCID.' } };
    }
}
