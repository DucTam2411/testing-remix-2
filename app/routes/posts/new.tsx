import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
    Form,
    useActionData,
    useCatch,
    useLoaderData,
    useTransition,
} from "@remix-run/react";
import { Link } from "react-router-dom";
import PostView from "~/components/PostView";
import { db } from "~/utils/db.server";
import { getDefaultUser, getUser } from "~/utils/session.server";

type ActionData = {
    fields?: {
        title: string;
        body: string;
    };
    formError?: string;
    fieldErrors?: {
        title?: string | undefined;
        body?: string | undefined;
    };
};

function validateTitle(title: string) {
    if (typeof title !== "string" || title.length < 3) {
        return "Title must be at least 3 characters";
    }
}
function validateBody(body: string) {
    if (typeof body !== "string" || body.length < 3) {
        return "Title must be at least 3 characters";
    }
}

function badRequest(data: ActionData) {
    return json(data, {
        status: 400,
    });
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const title = formData.get("title");
    const body = formData.get("body");

    // const user = await getUser(request);
    const user = await getUser(request);

    // We have to check for type to make sure that it's type-safety
    if (typeof title !== "string" || typeof body !== "string") {
        return badRequest({
            formError: `Form not submitted correctly.`,
        });
    }

    if (!user) {
        return badRequest({
            formError: `User need to login to create post`,
        });
    }

    const fields = {
        title,
        body,
    };

    const fieldErrors = {
        title: validateTitle(title),
        body: validateBody(body),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields });
    }

    const post = await db.post.create({
        data: {
            ...fields,
            userId: user.id,
        },
    });

    return redirect(`/posts/${post.id}`);
};

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    if (!user) {
        throw new Response("Not Found", {
            status: 404,
        });
    }
    return user;
};
const NewPostRoute = () => {
    // const user = useLoaderData();
    const actionData = useActionData<ActionData>();
    const transition = useTransition();

    return transition.submission ? (
        <PostView
            user={null}
            post={Object.fromEntries(transition.submission.formData)}
        />
    ) : (
        <>
            <div className="page-header">
                <h2>New Post</h2>
                <Link to="/posts" className="btn btn-reverse">
                    Back
                </Link>
            </div>
            <div className="page-content">
                <Form method="post">
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={actionData?.fields?.title}
                            id="title"
                        />

                        <div className="error">
                            {actionData?.fieldErrors?.title ? (
                                <p
                                    className="form-validation-error"
                                    role="alert"
                                    id="title-error"
                                >
                                    {actionData.fieldErrors.title}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="form-control">
                        <label htmlFor="body">Body</label>
                        <textarea
                            name="body"
                            defaultValue={actionData?.fields?.title}
                            id="body"
                        />

                        <div className="error">
                            {actionData?.fieldErrors?.body ? (
                                <p
                                    className="form-validation-error"
                                    role="alert"
                                    id="body-error"
                                >
                                    {actionData.fieldErrors.body}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-block">
                        Add Post
                    </button>
                    <div className="error">
                        {actionData?.formError ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="body-error"
                            >
                                {actionData.formError}
                            </p>
                        ) : null}
                    </div>
                </Form>
            </div>
        </>
    );
};

export function CatchBoundary() {
    return (
        <div className="error-container">
            <p>You must be logged in to create a post.</p>

            <Link to="/auth/login" className="btn">
                Login
            </Link>
        </div>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return (
        <div className="error">
            Something unexpected went wrong. Sorry about that.
        </div>
    );
}

export default NewPostRoute;
