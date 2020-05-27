import { getPathWithoutBasename } from "./basename";

export interface RouterHistory {
    push: (path: string) => void;
    replace: (path: string) => void;
    stop: () => void;
}

export function createHistory(basename: string, onChange: (s: string) => void): RouterHistory {
    const onPopState = () => onChange(getPathWithoutBasename(basename));
    window.addEventListener("popstate", onPopState);
    return {
        push(path: string) {
            const newPath = `${basename}${path}`;
            const { location, history } = window;
            // Only push if something changed.
            if (newPath !== location.pathname + location.search + location.hash) history.pushState({}, "", newPath);
            // Need to separate search and hash parts from path
            onChange(path.split(/[?#]/, 1)[0]);
        },
        replace(path: string) {
            window.history.replaceState({}, "", `${basename}${path}`);
            onChange(path);
        },
        stop() {
            window.removeEventListener("popstate", onPopState);
        },
    };
}
