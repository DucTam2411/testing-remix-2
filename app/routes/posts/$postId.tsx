import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    NavLink,
    PrefetchPageLinks,
    useLoaderData,
    useTransition,
} from "@remix-run/react";
import { TransitionRedirect } from "@remix-run/react/dist/transition";
import { Link } from "react-router-dom";
import PostView from "~/components/PostView";
import { db } from "~/utils/db.server";
import { getDefaultUser, getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    const user = await getUser(request);

    const post = await db.post.findUnique({
        where: {
            id: params.postId,
        },
    });

    if (!post) {
        throw Error("Post not found");
    }
    const data = {
        post,
        user,
    };
    return json(data);
};

// delete post
export const action: ActionFunction = async ({ request, params }) => {
    const form = await request.formData();
    if (form.get("_method") === "delete") {
        const user = await getUser(request);
        const post = await db.post.findUnique({
            where: {
                id: params.postId,
            },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        if (user && user.id === post.userId) {
            await db.post.delete({
                where: {
                    id: post.id,
                },
            });
        }
        return redirect("/posts");
    }
};

const DetailPostRoute = () => {
    const { post, user } = useLoaderData();
    const transition = useTransition();
    return transition.submission ? (
        <PostView post={post} disable={true} />
    ) : (
        <PostView post={post} user={user} />
    );
};

// ERROR HANDLING
export function ErrorBoundary({ error }: { error: Error }) {
    return <div className="error-container">{error.message}</div>;
}

export default DetailPostRoute;
