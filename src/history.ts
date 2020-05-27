export interface RouterHistory {
    push: (path: string) => void;
    replace: (path: string) => void;
    stop: () => void;
}

export function createHistory(basename: string, onChange: () => void): RouterHistory {
    window.addEventListener("popstate", onChange);
    return {
        push(path: string) {
            const newPath = `${basename}${path}`;
            const { location, history } = window;
            // Only push if something changed.
            if (newPath !== location.pathname + location.search + location.hash) history.pushState({}, "", newPath);
            onChange();
        },
        replace(path: string) {
            window.history.replaceState({}, "", `${basename}${path}`);
            onChange();
        },
        stop() {
            window.removeEventListener("popstate", onChange);
        },
    };
}
