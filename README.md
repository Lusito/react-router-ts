# Deprecated

**WARNING:** This project has moved to [@react-nano/router](https://github.com/lusito/react-nano)

## react-router-ts

[![Minified + gzipped size](https://badgen.net/bundlephobia/minzip/react-router-ts)](https://www.npmjs.com/package/react-router-ts)
[![NPM version](https://badgen.net/npm/v/react-router-ts)](https://www.npmjs.com/package/react-router-ts)
[![License](https://badgen.net/github/license/lusito/react-router-ts)](https://github.com/lusito/react-router-ts/blob/master/LICENSE)
[![Stars](https://badgen.net/github/stars/lusito/react-router-ts)](https://github.com/lusito/react-router-ts)
[![Watchers](https://badgen.net/github/watchers/lusito/react-router-ts)](https://github.com/lusito/react-router-ts)

A simple, lightweight react router using hooks, written in TypeScript.

#### Why use this router?

- Very lightweight (see the badges above for the latest size).
- Flexible and dead simple to use.
- Uses the browsers history API.
- Does not force a matching algorithm on you, but comes with a simple one built-in.
- Written with [hooks](https://reactjs.org/docs/hooks-intro.html) in TypeScript
- Only has one peer dependency: React 16.12.0 or higher.
- Liberal license: [zlib/libpng](https://github.com/Lusito/react-router-ts/blob/master/LICENSE)

### Installation via NPM

```npm i react-router-ts```

This library is shipped as es2015 modules. To use them in browsers, you'll have to transpile them using webpack or similar, which you probably already do.

### Examples

#### Router
You'll need to add a `Router` component in your app (just one). Any other components and hooks from this library need to be children of this `Router` (doesn't matter how deeply nested).

```tsx
import { Router } from "react-router-ts";
export const App = () => (
    <Router>
        ....
    </Router>
);
```

#### Route

Showing a component if the location matches a certain path is done with a `Route` component. It takes a `path` prop and either a `component` prop or children.

```tsx
export const Component = () => (
    <div>
        <Route path="/news" component={News} />
        <Route path="/fakenews">Drumpf</Route>
    </div>
);
```

**Beware:** If multiple routes have a matching path, all will be shown. Use a `Switch` if that's not desired.

As you can see, it's possible to specify a component to render or normal children.

You can even use a callback instead of children like this:
```tsx
export const Component = () => (
    <Route path="/foo">{(params: { id: string }) => <div>Bar {params.id}</div>}</Route>;
);
```

See further below for the the possibility of using parameters.

#### Switch
If you only want the first `Route` that has a matching path to be shown, you can use a `Switch`:

```tsx
export const Component = () => (
    <Switch>
        <Route path="/news" component={News} />
        <Route path="/fakenews" component={FakeNews} />
        <Route path="*" /* use "(.*)" if you use path-to-regexp */ component={Otherwise} />
    </Switch>
);
```

**Note:** The path pattern for the "Otherwise" Route differs depending on your route matching algorithm. With the built-in `simpleRouteMatcherFactory` you would use `"*"`, while you would use `"(.*)"` or `"/:fallback"`  for `path-to-regexp`.


#### Get parameters without being in a Route Component

You can get a memoized parameters object for the given path like this:

```tsx
export const Component = () => {
    const params = useParams<{ id: string }>("/news/:id");
    //...
};
```

#### Custom Route Matching
This library doesn't force a route matching algorithm on you, but it comes with a lightweight one built-in.

The default route matching algorithm only allows exact matches and a match everything ("*").

If you need something more sophisticated, you'll have to supply a factory. Here is a simple example using the popular [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) library:

```tsx
import { pathToRegexp, Key } from "path-to-regexp";
import { Router, RouteParams } from "react-router-ts";

function routeMatcherFactory(pattern: string) {
    const keys: Key[] = [];
    const regex = pathToRegexp(pattern, keys);

    return (path: string) => {
        const out = regex.exec(path);

        if (!out) return null;

        return keys.reduce((params, key, i) => {
            params[key.name] = out[i + 1];
            return params;
        }, {} as RouteParams);
    }
}

export const App = () => (
    <Router routeMatcherFactory={routeMatcherFactory}>
        ....
    </Router>
);
```

Using pathToRegexp allows to extract named parameters from a pattern like "/users/:name".
I.e. if the path is "/users/Zaphod", then the param with the key "name" would have the value "Zaphod".

#### Adding parameters

When you use a custom matching algorithm like the one above, you can extract values from the path. Let's say you have this route:

```tsx
export const Component = () => (
    <Route path="/news/:id" component={News} />
);
```

You defined a parameter :id in your path. Now you want to access it in your `News` component:

```tsx
export const News = (props: RouteComponentProps<{ id: string }>) => (
    <div>News ID: {props.params.id}</div>
);
```

#### Fresh Rendering

Let's say you have this route:

```tsx
export const Component = () => <Route path="/news/:id" component={News} />;
```

Moving from `/news/1` to `/news/2` will only update the components properties. State will be preserved.
If you want to force the component to be created from scratch in this situation, you can do so by setting the property `addKey` (boolean).
This will add the `key` property to the component with a value of the current path.

#### Storing the route in the hash instead
In some situations, it's easier to store the route in the hash part of the URL, as it avoids the server having to be aware of the single page application behavior. You can enable the "hash" mode on the `Router` component:

```tsx
import { Router } from "react-router-ts";
export const App = () => (
    <Router mode="hash">
        ....
    </Router>
);
```

This will result in a url like `https://some-domain.com/#/News` instead of `https://some-domain.com/News`.

This approach will still use the [history](https://caniuse.com/history) API internally!

#### Using a basename
If your app is not located at the root directory of a server, but instead in a sub-directory, you'll want to specify that sub-directory. You can do that on the `Router` component.

Basename will be prefixed on `Link` components.

```tsx
import { Router } from "react-router-ts";
export const App = () => (
    <Router basename="/my-app">
        ....
    </Router>
);
```

If you have a `<base>` tag in your HTML, this can be easily detected using the `getBasename()` helper. That way you don't have to hard-code it:

```tsx
import { Router, getBasename } from "react-router-ts";
export const App = () => (
    <Router basename={getBasename()} routeMatcherFactory={routeMatcherFactory}>
        ....
    </Router>
);
```

#### Link

The `Link` component can be used to change the url and still act as a normal `<a>` tag, so you can open the link in a new tab.

```tsx
export const Component = () => (<Link href="/hello">Test</Link>);
```
Any extra props you pass in will be forwarded to the `<a>` element. If you specify an onClick property and it calls preventDefault(), then the history change will not happen, as would be the case with any normal link.

#### LinkButton, etc.

If you want to create a LinkButton or similar, you can do that easily. This is the implementation of Link:

```tsx
export function Link(props: React.PropsWithChildren<LinkProps>) {
    const routeLink = useRouteLink(props.href, props.onClick);
    return <a {...props} href={routeLink.href} onClick={routeLink.onClick} />;
}
```

Creating a `LinkButton` is as simple as this:
```tsx
import { useRouteLink } from "react-router-ts";
...
export function LinkButton(props: React.PropsWithChildren<LinkButtonProps>) {
    const routeLink = useRouteLink(props.href, props.onClick);
    return <button {...props} onClick={routeLink.onClick} />;
}
```

#### RouterContext

`Router` internally adds a RouterContext to your application, which you can access using the `useRouter()` hook:

```tsx
import { useRouter } from "react-router-ts";
...
export function Component() {
    // router is of type RouterContextValue (see below)
    const router = useRouter();
    ....
}
```

`RouterContextValue` is defined as:
```tsx
export interface RouterContextValue {
    basename: string;
    path: string;
    history: RouterHistory;
    matchRoute: CachedRouteMatcher;
    urlTo: (path: string) => string;
}
// with:
export interface RouterHistory {
    push: (path: string) => void;
    replace: (path: string) => void;
    stop: () => void; // for internal use, do not call.
    urlTo: (path: string) => string;
}
// and:
export type CachedRouteMatcher = (pattern: string, path: string) => (RouteParams | null);
```

`urlTo()` can be used to create a new url, which respects `basename` and `mode`. It's the same for both `RouterContextValue` and `RouterHistory`.

### Report isssues

Something not working quite as expected? Do you need a feature that has not been implemented yet? Check the [issue tracker](https://github.com/Lusito/react-router-ts/issues) and add a new one if your problem is not already listed. Please try to provide a detailed description of your problem, including the steps to reproduce it.

### Contribute

Awesome! If you would like to contribute with a new feature or submit a bugfix, fork this repo and send a pull request. Please, make sure all the unit tests are passing before submitting and add new ones in case you introduced new features.

### License

react-router-ts has been released under the [zlib/libpng](https://github.com/Lusito/react-router-ts/blob/master/LICENSE) license, meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.
