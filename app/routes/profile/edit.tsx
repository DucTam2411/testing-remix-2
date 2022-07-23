import { Profile } from "@prisma/client";
import {
    ActionFunction,
    json,
    LoaderFunction,
    redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import validator from "validator";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    if (!user) {
        return redirect("/auth/login");
    }

    const profile = await db.profile.findFirst({
        where: {
            userId: user.id,
        },
    });
    return profile;
};

type ActionData = {
    formError?: string;
    fieldErrors?: {
        phoneNumber?: string | undefined;
        email?: string | undefined;
        name?: string | undefined;
    };
    fields?: {
        phoneNumber?: string | undefined;
        email?: string | undefined;
        name?: string | undefined;
    };
};

function badRequest(data: ActionData) {
    return json(data, { status: 400 });
}

function validateEmail(email: string) {
    if (!validator.isEmail(email)) {
        return "Invalid email address";
    }
}
function validatePhoneNumber(phoneNumber: string) {
    if (!validator.isMobilePhone(phoneNumber)) {
        return "Invalid mobile phone";
    }
}

function validateFullname(name: string) {
    if (typeof name !== "string" || name.length < 4) {
        return "Full name must be at least 4 characters";
    }
}

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const email = form.get("email");
    const phoneNumber = form.get("phoneNumber");
    const name = form.get("name");
    const id = form.get("id");

    if (
        typeof email !== "string" ||
        typeof name !== "string" ||
        typeof id !== "string" ||
        typeof phoneNumber !== "string"
    )
        return null;
    const fields = { email, phoneNumber, name };
    const fieldErrors = {
        phoneNumber: validatePhoneNumber(phoneNumber),
        email: validateEmail(email),
        name: validateFullname(name),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields });
    }
    await db.profile.update({
        data: {
            email,
            name,
            phoneNumber,
        },
        where: {
            id,
        },
    });

    return redirect("/profile");
};

function ProfileEditRoute() {
    const profile = useLoaderData<Profile>();
    const actionData = useActionData();

    return (
        <div>
            <div className="page-header">
                <h2>Profile</h2>
                <Link to="/posts" className="btn btn-reverse">
                    Back
                </Link>
            </div>
            <div className="page-content">
                <Form method="post">
                    <input type="hidden" name="id" value={profile.id} />
                    <div className="form-control">
                        <label htmlFor="password">Full name</label>
                        <input
                            type="name"
                            name="name"
                            id="name"
                            defaultValue={profile.name}
                        />
                        <div className="error">
                            {actionData?.fieldErrors?.password ? (
                                <p
                                    className="form-validation-error"
                                    role="alert"
                                    id="password-error"
                                >
                                    {actionData.fieldErrors.password}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="form-control">
                        <label htmlFor="phoneNumber">Phone </label>
                        <input
                            type="phoneNumber"
                            name="phoneNumber"
                            id="phoneNumber"
                            defaultValue={profile.phoneNumber}
                        />
                        <div className="error">
                            {actionData?.fieldErrors?.phoneNumber ? (
                                <p
                                    className="form-validation-error"
                                    role="alert"
                                    id="password-error"
                                >
                                    {actionData.fieldErrors.phoneNumber}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="form-control">
                        <label htmlFor="password">Email </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={profile.email}
                        />
                        <div className="error">
                            {actionData?.fieldErrors?.email ? (
                                <p
                                    className="form-validation-error"
                                    role="alert"
                                    id="password-error"
                                >
                                    {actionData.fieldErrors.email}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <button className="btn btn-block" type="submit">
                        Submit
                    </button>
                </Form>
            </div>
        </div>
    );
}

export default ProfileEditRoute;
