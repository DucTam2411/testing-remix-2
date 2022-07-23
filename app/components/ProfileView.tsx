import type { Profile, User } from "@prisma/client";
import { Link } from "react-router-dom";

const ProfileView = ({
    profile,
    userId = undefined,
}: {
    profile: Profile;
    userId?: string | undefined;
}) => {
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
                {userId === profile.userId && (
                    <Link to="/profile/edit" className="btn btn">
                        Edit
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProfileView;
