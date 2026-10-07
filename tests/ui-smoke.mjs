// Run with the PHP server on port 8000: node tests/ui-smoke.mjs
// Uses an installed Chromium, or CHROME_PATH, and Node 22+; never posts to the database.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cache = join(process.env.LOCALAPPDATA, 'ms-playwright');
const chrome = process.env.CHROME_PATH || join(cache,
    readdirSync(cache).find(name => name.startsWith('chromium-')), 'chrome-win64', 'chrome.exe');
const artifacts = mkdtempSync(join(tmpdir(), 'rafon-ui-'));
const browser = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=9224', `--user-data-dir=${join(artifacts, 'profile')}`,
    '--no-first-run', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
    let tabs;
    for (let i = 0; i < 50; i++) {
        try { tabs = await (await fetch('http://127.0.0.1:9224/json')).json(); break; }
        catch { await pause(100); }
    }
    assert.ok(tabs, 'Chromium must start');
    socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
    let id = 0;
    const pending = new Map();
    socket.addEventListener('message', ({ data }) => {
        const result = JSON.parse(data);
        if (pending.has(result.id)) {
            const { resolve, reject } = pending.get(result.id);
            pending.delete(result.id);
            result.error ? reject(new Error(result.error.message)) : resolve(result.result);
        }
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => {
        pending.set(++id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
        const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
        assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
        return result.result.value;
    };
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: 'http://127.0.0.1:8000' });
    let ready = false;
    for (let i = 0; i < 100; i++) {
        ready = await evaluate(`!!document.querySelector('#entry-debit-account option[value]:not([value=""])')`);
        if (ready) break;
        await pause(200);
    }
    assert.ok(ready, 'App and chart of accounts must load');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('#sidebar')).display`), 'flex', 'Tailwind must load');
    for (const tab of ['dashboard', 'suppliers', 'journal', 'ledger', 'trial-balance', 'income-statement', 'balance-sheet', 'audit-trail']) {
        await evaluate(`document.querySelector('#nav-${tab}').click()`);
        assert.equal(await evaluate(`document.querySelector('#${tab}-view').classList.contains('hidden')`), false);
        assert.equal(await evaluate(`document.querySelector('#nav-${tab}').getAttribute('aria-current')`), 'page');
    }
    await evaluate(`(async () => {
        const state = await import('./js/state.js');
        if (!state.suppliers.length) state.suppliers.push(
            { id: -9101, businessName: 'Harbor Catch Trading', category: 'Seafood', contactPerson: 'Mara Dizon', phone: '0917 555 0142', email: 'orders@harborcatch.test', address: 'Bauang, La Union', productsSupplied: 'Shrimp, squid, shellfish, and fresh fish', deliveryDays: 'Monday, Wednesday, Friday', leadTimeDays: 1, minimumOrder: 3500, isPreferred: true, status: 'Active', notes: '', updatedAt: '2026-10-08 09:00:00' },
            { id: -9102, businessName: 'North Fields Produce', category: 'Produce', contactPerson: 'Elena Ramos', phone: '0928 555 0197', email: '', address: 'San Fernando, La Union', productsSupplied: 'Vegetables, herbs, aromatics, and seasonal produce', deliveryDays: 'Tuesday and Saturday', leadTimeDays: 2, minimumOrder: 1500, isPreferred: false, status: 'Active', notes: '', updatedAt: '2026-10-07 14:30:00' },
            { id: -9103, businessName: 'Kusina Pantry Supply', category: 'Pantry', contactPerson: '', phone: '0995 555 0125', email: 'hello@kusinapantry.test', address: 'La Union', productsSupplied: 'Rice, oil, seasonings, beverages, and packaging', deliveryDays: 'Thursday', leadTimeDays: 3, minimumOrder: 0, isPreferred: false, status: 'Inactive', notes: '', updatedAt: '2026-10-06 11:20:00' }
        );
        (await import('./js/components/suppliers.js')).render();
    })()`);
    await evaluate(`document.querySelector('#nav-suppliers').click()`);
    assert.equal(await evaluate(`document.querySelectorAll('#supplier-directory .supplier-directory-row').length`), 2, 'Active suppliers are listed by default');
    assert.equal(await evaluate(`document.querySelector('#supplier-active-count').textContent`), '2');
    assert.equal(await evaluate(`document.querySelector('#supplier-preferred-count').textContent`), '1');
    await evaluate(`document.querySelector('#supplier-search').value='harbor'; document.querySelector('#supplier-search').dispatchEvent(new Event('input', { bubbles: true }))`);
    assert.equal(await evaluate(`document.querySelectorAll('#supplier-directory .supplier-directory-row').length`), 1, 'Supplier search filters the directory');
    await evaluate(`document.querySelector('#supplier-search').value=''; document.querySelector('#supplier-search').dispatchEvent(new Event('input', { bubbles: true }))`);
    await evaluate(`document.querySelector('#add-supplier').click()`);
    assert.ok(await evaluate(`document.querySelector('#supplier-modal').open`));
    assert.equal(await evaluate(`document.activeElement.id`), 'supplier-business-name');
    assert.ok(await evaluate(`Array.from(document.querySelectorAll('#supplier-form input:not([type="hidden"]), #supplier-form textarea')).every(input => input.labels.length)`));
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await pause(100);
    assert.equal(await evaluate(`document.querySelector('#supplier-modal').open`), false);
    assert.equal(await evaluate(`document.activeElement.id`), 'add-supplier');
    writeFileSync(join(artifacts, 'suppliers-desktop.png'), Buffer.from((await call('Page.captureScreenshot')).data, 'base64'));
    await evaluate(`document.querySelector('#nav-dashboard').click()`);
    await pause(350);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('#dashboard-view > .grid > div')).borderRadius`), '8px');
    assert.ok(await evaluate(`document.querySelector('#dashboard-view').textContent.includes('All recorded entries')`));
    assert.ok(await evaluate(`document.querySelector('#dashboard-view').textContent.includes('Catering sales and event revenue')`));
    await evaluate(`document.querySelector('#add-catering-event').click()`);
    assert.ok(await evaluate(`document.querySelector('#catering-event-modal').open`));
    assert.equal(await evaluate(`document.activeElement.id`), 'event-name');
    assert.ok(await evaluate(`Array.from(document.querySelectorAll('#catering-event-form input:not([type="hidden"]), #catering-event-form select, #catering-event-form textarea')).every(input => input.labels.length)`));
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await pause(100);
    assert.equal(await evaluate(`document.querySelector('#catering-event-modal').open`), false);
    writeFileSync(join(artifacts, 'desktop.png'), Buffer.from((await call('Page.captureScreenshot')).data, 'base64'));
    for (const width of [320, 390, 768]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 667, deviceScaleFactor: 1, mobile: false });
        for (const tab of ['dashboard', 'suppliers', 'journal', 'ledger', 'trial-balance', 'income-statement', 'balance-sheet', 'audit-trail']) {
            await evaluate(`document.querySelector('#nav-${tab}').click()`);
            assert.ok(await evaluate(`document.body.scrollWidth <= innerWidth`), `${tab} app shell must fit at ${width}px`);
        }
        await evaluate(`document.querySelector('#nav-dashboard').click()`);
        assert.ok(await evaluate(`document.body.scrollWidth <= innerWidth`), `No page overflow at ${width}px`);
        assert.ok(await evaluate(`document.querySelector('#new-entry-button').getBoundingClientRect().right <= innerWidth`), `Post Entry must stay visible at ${width}px`);
        await evaluate(`document.querySelector('#new-entry-button').click()`);
        assert.ok(await evaluate(`document.querySelector('#post-modal').open`));
        assert.equal(await evaluate(`document.activeElement.id`), 'entry-date');
        assert.ok(await evaluate(`document.querySelector('#post-modal').getBoundingClientRect().height <= innerHeight - 30`));
        assert.ok(await evaluate(`Array.from(document.querySelectorAll('#entry-form input, #entry-form select')).every(input => input.labels.length)`));
        await evaluate(`document.querySelector('#post-modal button[type="submit"]').scrollIntoView()`);
        assert.ok(await evaluate(`document.querySelector('#post-modal button[type="submit"]').getBoundingClientRect().bottom <= innerHeight`), 'Submit must be reachable by scrolling');
        await evaluate(`document.querySelector('#entry-date').value='2026-10-07'; document.querySelector('#entry-ref').value='UI-CHECK'; document.querySelector('#entry-debit-account').selectedIndex=1; document.querySelector('#entry-credit-account').selectedIndex=2; document.querySelector('#entry-debit-amount').value='10'; document.querySelector('#entry-credit-amount').value='11'; document.querySelector('#entry-explanation').value='Validation check'; document.querySelector('#entry-form').requestSubmit();`);
        assert.ok(await evaluate(`!document.querySelector('#entry-error').classList.contains('hidden')`));
        await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await pause(100);
        assert.equal(await evaluate(`document.querySelector('#post-modal').open`), false);
        assert.equal(await evaluate(`document.activeElement.id`), 'new-entry-button');
    }
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 667, deviceScaleFactor: 1, mobile: false });
    await evaluate(`if(document.querySelector('#sidebar').classList.contains('sidebar-expanded')) document.querySelector('#sidebar-toggle').click(); document.querySelector('#sidebar-toggle').click();`);
    assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('#nav-journal .nav-text')).display`), 'none');
    assert.equal(await evaluate(`document.querySelector('#sidebar-toggle').getAttribute('aria-expanded')`), 'true');
    await evaluate(`document.querySelector('#sidebar-close').click()`);
    assert.equal(await evaluate(`document.querySelector('#sidebar-toggle').getAttribute('aria-expanded')`), 'false');
    await pause(350);
    writeFileSync(join(artifacts, 'mobile.png'), Buffer.from((await call('Page.captureScreenshot')).data, 'base64'));
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 1, mobile: false });
    await evaluate(`document.querySelector('#nav-suppliers').click(); document.querySelector('#content-area').scrollTop = 0`);
    await pause(250);
    assert.ok(await evaluate(`document.body.scrollWidth <= innerWidth`), 'Supplier cards must not overflow at 390px');
    assert.ok(await evaluate(`document.querySelector('.supplier-directory-row').getBoundingClientRect().width <= document.querySelector('#content-area').getBoundingClientRect().width`));
    await evaluate(`document.querySelector('#add-supplier').click()`);
    assert.ok(await evaluate(`document.querySelector('#supplier-modal').getBoundingClientRect().height <= innerHeight - 20`));
    await evaluate(`document.querySelector('#supplier-form .supplier-form-actions').scrollIntoView()`);
    assert.ok(await evaluate(`document.querySelector('#supplier-form button[type="submit"]').getBoundingClientRect().bottom <= innerHeight`), 'Supplier submit must be reachable by scrolling');
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await pause(100);
    await evaluate(`document.querySelector('.supplier-directory-row').scrollIntoView({ block: 'start' })`);
    await pause(200);
    writeFileSync(join(artifacts, 'suppliers-mobile.png'), Buffer.from((await call('Page.captureScreenshot')).data, 'base64'));
    for (const [width, name] of [[1440, 'expense-desktop.png'], [390, 'expense-mobile.png']]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
        await evaluate(`(() => { document.querySelector('#nav-dashboard').click(); const contentArea = document.querySelector('#content-area'); const expenseSection = document.querySelector('.expense-section'); contentArea.scrollTop = expenseSection.offsetTop - contentArea.offsetTop - 24; })()`);
        await pause(250);
        assert.ok(await evaluate(`document.querySelector('#expense-breakdown').textContent.includes('Cost of Seafood & Food Ingredients')`));
        assert.ok(await evaluate(`document.querySelectorAll('#expense-breakdown .expense-row').length >= 3`));
        writeFileSync(join(artifacts, name), Buffer.from((await call('Page.captureScreenshot')).data, 'base64'));
    }
    console.log(`UI checks passed. Screenshots: ${artifacts}`);
} finally {
    socket?.close();
    browser.kill();
}
