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
    for (const tab of ['home', 'dashboard', 'suppliers', 'journal', 'ledger', 'trial-balance', 'income-statement', 'balance-sheet', 'audit-trail']) {
        await evaluate(`document.querySelector('#nav-${tab}').click()`);
        assert.equal(await evaluate(`document.querySelector('#${tab}-view').classList.contains('hidden')`), false);
        assert.equal(await evaluate(`document.querySelector('#nav-${tab}').getAttribute('aria-current')`), 'page');
    }
    await evaluate(`document.querySelector('#nav-dashboard').click()`);
    await pause(350);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('#dashboard-view > .grid > div')).borderRadius`), '8px');
    assert.ok(await evaluate(`document.querySelector('#dashboard-view').textContent.includes('All recorded entries')`));
    writeFileSync(join(artifacts, 'desktop.png'), Buffer.from((await call('Page.captureScreenshot')).data, 'base64'));
    for (const width of [320, 390, 768]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 667, deviceScaleFactor: 1, mobile: false });
        for (const tab of ['dashboard', 'suppliers', 'journal', 'ledger', 'trial-balance', 'income-statement', 'balance-sheet', 'audit-trail']) {
            await evaluate(`document.querySelector('#nav-${tab}').click()`);
            assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), `${tab} must fit at ${width}px`);
        }
        await evaluate(`document.querySelector('#nav-home').click()`);
        assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), `No page overflow at ${width}px`);
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
    console.log(`UI checks passed. Screenshots: ${artifacts}`);
} finally {
    socket?.close();
    browser.kill();
}
