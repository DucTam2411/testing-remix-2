import { Link } from "@remix-run/react";

function IndexRoute() {
    return (
        <div>
            <h1>Welcome to Remix!</h1>
            <p>This is Tam project about Remix. This is what you can do: </p>

            <ul className="dir-tree">
                <li>
                    <ul className="dir-tree">
                        <li>
                            <Link to="/posts">check posts</Link>
                        </li>
                        <li>
                            <Link to="/posts/new">create Post</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul className="dir-tree">
                        <li>
                            <Link prefetch="intent" to="/profile/edit">
                                modify your profile
                            </Link>
                        </li>

                        <li>
                            <Link prefetch="intent" to="/profile">
                                profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                prefetch="intent"
                                to="/profile/98ad2ce7-7889-4196-a457-fb5e0656dc7c"
                            >
                                people profile
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul className="dir-tree">
                        <li>
                            <Link to="/auth/login">login</Link>
                        </li>
                        <li>
                            <Link to="/auth/register">register</Link>
                        </li>

                        <li>
                            <Link to="/auth/logout">Logout</Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default IndexRoute;
