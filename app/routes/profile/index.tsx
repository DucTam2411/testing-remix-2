import type { Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
    const profile = await db.profile.findFirst();
    if (!profile) {
        throw new Error("Server Error");
    }
    return profile;
};
function ProfileRoute() {
    const profile = useLoaderData<Profile>();
    return (
        <div>
            <div className="page-header">
                <h1>Profile </h1>
                <Link to="/posts" className="btn btn-reverse">
                    Back
                </Link>
            </div>

            <div className="profile-content">
                <img
                    src={profile.profileImageUrl}
                    alt="d"
                    className="image-container"
                />
                <div className="profile-info">
                    <p>
                        <b>Name:</b> {profile.name}
                    </p>
                    <p>
                        <b>Email:</b> {profile.email}
                    </p>
                    <p>
                        <b>Phone Number:</b> {profile.phoneNumber}
                    </p>
                </div>
            </div>

            <div className="page-footer">
                <Link to="/profile/edit" className="btn btn">
                    Edit
                </Link>
            </div>
        </div>
    );
}

export default ProfileRoute;
