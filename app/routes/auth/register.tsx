import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { db } from "~/utils/db.server";
import { createUserSession, login, register } from "~/utils/session.server";
import validator from "validator";

function validateUsername(username: string) {
    if (typeof username !== "string" || username.length < 3) {
        return "Username must be at least 3 characters";
    }
}
function validateFullname(name: string) {
    if (typeof name !== "string" || name.length < 4) {
        return "Full name must be at least 4 characters";
    }
}

type ActionData = {
    formError?: string;
    fieldErrors?: {
        username?: string | undefined;
        password?: string | undefined;
        phoneNumber?: string | undefined;
        email?: string | undefined;
        name?: string | undefined;
    };
    fields?: {
        username?: string;
        password?: string;
        phoneNumber?: string | undefined;
        email?: string | undefined;
        name?: string | undefined;
    };
};

function badRequest(data: ActionData) {
    return json(data, { status: 400 });
}
function validatePassword(password: string) {
    if (typeof password !== "string" || password.length < 3) {
        return "Password must be at least 3 characters";
    }
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

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const email = form.get("email");
    const phoneNumber = form.get("phoneNumber");
    const name = form.get("name");

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        typeof email !== "string" ||
        typeof name !== "string" ||
        typeof phoneNumber !== "string"
    )
        return null;

    const fields = { username, password, email, phoneNumber, name };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
        phoneNumber: validatePhoneNumber(phoneNumber),
        email: validateEmail(email),
        name: validateFullname(name),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields });
    }

    // Register
    const userExists = await db.user.findFirst({
        where: {
            username,
        },
    });

    if (userExists) {
        return badRequest({
            fields,
            fieldErrors: {
                username: `User ${username} already exists`,
            },
        });
    }
    const user = await register({
        username,
        password,
        phoneNumber,
        email,
        name,
    });
    if (!user) {
        return badRequest({
            fields,
            formError: "Something went wrong",
        });
    }

    // Create session
    return createUserSession(user.id, "/posts");
};

const RegisterRoute = () => {
    const actionData = useActionData();
    return (
        <div className="auth-container">
            <div className="page-header">
                <h1>Register</h1>
            </div>

            <div className="page-content">
                <Form method="post">
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            defaultValue={actionData?.fields?.username}
                        />
                        <div className="error">
                            {actionData?.fieldErrors?.username ? (
                                <p
                                    className="form-validation-error"
                                    role="alert"
                                    id="username-error"
                                >
                                    {actionData.fieldErrors.username}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            defaultValue={actionData?.fields?.password}
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
                        <label htmlFor="password">Full name</label>
                        <input
                            type="name"
                            name="name"
                            id="name"
                            defaultValue={actionData?.fields?.password}
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
                            defaultValue={actionData?.fields?.phoneNumber}
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
                            defaultValue={actionData?.fields?.email}
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
                    <Link
                        to="/auth/login"
                        className="btn btn-reverse btn-block"
                    >
                        Or login your account
                    </Link>
                </Form>
            </div>
        </div>
    );
};

export default RegisterRoute;
