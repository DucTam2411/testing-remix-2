import {
    LinksFunction,
    LoaderFunction,
    MetaFunction,
    Response,
} from "@remix-run/node";
import {
    Link,
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useCatch,
    useLoaderData,
} from "@remix-run/react";
import React from "react";

import globalStyleUrl from "~/styles/global.css";
import { getUser } from "./utils/session.server";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);

    const data = {
        user,
    };

    return data;
};

export default function App() {
    return (
        <Document>
            <Layout>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </Layout>
        </Document>
    );
}

export const links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            href: globalStyleUrl,
        },
    ];
};

function Document({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>{children}</body>
        </html>
    );
}

function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData();
    const user = data.user;
    return (
        <>
            <nav className="navbar">
                <Link to="/" className="logo">
                    Remix
                </Link>
                <ul className="nav">
                    <li>
                        <Link to="/posts">Posts</Link>
                    </li>

                    {user ? (
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/auth/login"> Login</Link>
                        </li>
                    )}

                    {user ? (
                        <li>
                            <form action="/auth/logout" method="POST">
                                <button type="submit" className="btn">
                                    Logout {user.username}
                                </button>
                            </form>
                        </li>
                    ) : (
                        <li>
                            <Link to="/auth/login"> Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="container">{children}</div>
        </>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return <div>content</div>;
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);
    return (
        <html>
            <head>
                <title>Oh no!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <nav className="navbar">
                    <Link to="/" className="logo">
                        Remix
                    </Link>
                    <ul className="nav">
                        <li>
                            <Link to="/posts">Posts</Link>
                        </li>
                    </ul>
                </nav>
                <div className="page-content container ">
                    <div className="error-container">
                        <h1>Error</h1>
                        <p className="error">{error.message}</p>
                    </div>
                </div>
                <Scripts />
            </body>
        </html>
    );
}
