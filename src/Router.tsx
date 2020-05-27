import React, { useReducer, useEffect } from "react";

import { RouterContext, RouterContextValue } from "./RouterContext";
import { createHistory } from "./history";
import { createRouteMatcher, RouteMatcherFactory } from "./routeMatcher";
import { getPathWithoutBasename } from "./basename";
import { simpleRouteMatcherFactory } from "./simpleRouteMatcherFactory";

export interface RouterProps {
    basename?: string;
    routeMatcherFactory?: RouteMatcherFactory;
}

const setPathReducer = (state: RouterContextValue, path: string) => ({ ...state, path });

export const Router = ({
    basename = "",
    routeMatcherFactory = simpleRouteMatcherFactory,
    children,
}: React.PropsWithChildren<RouterProps>) => {
    const [router, setPath] = useReducer(setPathReducer, null, () => ({
        basename,
        history: createHistory(basename, () => setPath(getPathWithoutBasename(basename))),
        path: getPathWithoutBasename(basename),
        matchRoute: createRouteMatcher(routeMatcherFactory),
    }));
    useEffect(() => router.history.stop, []);
    return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>;
};
