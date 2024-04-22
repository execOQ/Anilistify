export async function waitForPageToBeVisible() {
    const condition = () => Boolean(!document.visibilityState || document.visibilityState === 'visible');

    if (condition()) return Promise.resolve();

    console.log('Page in background');

    const { asyncWaitUntilTrue: awaitUi } = getAsyncWaitUntilTrue(() => condition());

    await awaitUi();
    console.log('Page is visible');
}

export function getAsyncWaitUntilTrue(condition, interval = 100) {
    let intervalId;
    let rejectThis;
    const reset = () => {
        clearTimeout(intervalId)
        if (rejectThis) rejectThis("AsyncWait stopped")
    }

    return {
        asyncWaitUntilTrue: () => {
            reset()
            return new Promise((resolve, reject) => {
            rejectThis = reject
            intervalId = waitUntilTrue(condition, () => resolve(), interval)
            })
        },
        reset
    }
}

export function waitUntilTrue(condition, callback, interval = 100) {
    const intervalId = setInterval(function() {
    if (condition()) {
        clearInterval(intervalId);
        callback();
    }
    }, interval);

    return intervalId;
}

export function page(regex, href = false) {
    return regex.test(href ? window.location.href : window.location.pathname);
}