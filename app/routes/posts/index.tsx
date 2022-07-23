import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
    posts: Array<{ title: string; body: string; id: string; createdAt: Date }>;
};

export const loader: LoaderFunction = async () => {
    const data = { posts: await db.post.findMany() };
    return json(data);
};
const PostIndexRoute = () => {
    const { posts } = useLoaderData<LoaderData>();

    return (
        <>
            <div className="page-header">
                <h1>Posts</h1>
                <Link to="/posts/new" className="btn">
                    New Post
                </Link>
            </div>

            <ul className="posts-list">
                {posts.map((post) => (
                    <li key={post.body}>
                        <Link prefetch="intent" to={post.id}>
                            <h3>{post.title}</h3>
                            {new Date(post.createdAt).toLocaleString()}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return (
        <div className="error">
            Something unexpected went wrong. Sorry about that.
        </div>
    );
}

export default PostIndexRoute;
