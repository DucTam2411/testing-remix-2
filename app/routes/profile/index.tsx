import type { Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProfileView from "~/components/ProfileView";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    if (!user || typeof user === "undefined") {
        return null;
    }
    const profile = await db.profile.findFirst({
        where: {
            userId: user.id,
        },
    });

    if (!profile) {
        throw new Error("Server Error");
    }
    return { profile, userId: user.id };
};
function ProfileRoute() {
    const { profile, userId } = useLoaderData();
    return <ProfileView profile={profile} userId={userId} />;
}

export default ProfileRoute;
