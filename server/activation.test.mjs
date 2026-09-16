import test from 'node:test';
import assert from 'node:assert/strict';
import { requestConfirmation } from './activation.mjs';

// Synthetic fixtures; these tests never contact GetCID.
const input = { productKey: 'AAAAA-BBBBB-CCCCC-DDDDD-EEEEE', installationId: '1'.repeat(54) };
test('rejects malformed input before contacting the provider', async () => {
    for (const value of [null, {}, { ...input, productKey: 'invalid' }, { ...input, installationId: '1'.repeat(55) }]) {
        const result = await requestConfirmation(value, () => { throw new Error('must not contact provider'); });
        assert.equal(result.status, 400);
    }
});
test('maps both installation ID lengths to nine groups and returns only the CID', async () => {
    for (const length of [54, 63]) {
        const result = await requestConfirmation({ ...input, installationId: '1'.repeat(length) }, async (url, options) => {
            assert.equal(url, 'https://getcid.us/getdata.php');
            assert.equal(options.method, 'POST');
            assert.equal(options.redirect, 'error');
            const body = new URLSearchParams(options.body);
            assert.equal(body.get('key'), input.productKey);
            assert.equal(body.get('comment').split('-').length, 9);
            assert.equal(body.get('comment').split('-')[0].length, length / 9);
            return Response.json({ have_cid: 1, confirmationid: '2'.repeat(48), message: '<b>untrusted</b>' });
        });
        assert.deepEqual(result, { status: 200, body: { confirmationId: '2'.repeat(48) } });
    }
});
test('provider rejection does not echo its content or credentials', async () => {
    const result = await requestConfirmation(input, async () => Response.json({ have_cid: 0, message: input.productKey }));
    assert.equal(result.status, 422);
    assert.ok(!JSON.stringify(result).includes(input.productKey));
});
test('handles blocked, non-JSON, and invalid success responses', async () => {
    for (const response of [new Response('', { status: 403 }), new Response('<html>blocked</html>'),
        Response.json({ have_cid: 1, confirmationid: '<script>bad</script>' })]) {
        const result = await requestConfirmation(input, async () => response);
        assert.equal(result.status, 502);
    }
});
test('timeouts are not retried', async () => {
    let calls = 0;
    const result = await requestConfirmation(input, async () => {
        calls++;
        throw new DOMException('Timed out', 'TimeoutError');
    });
    assert.equal(result.status, 504);
    assert.equal(calls, 1);
});
