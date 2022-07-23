import { Profile } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import ProfileView from "~/components/ProfileView";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    const user = await getUser(request);
    const userId = user ? user.id : "randomId";
    const profile = await db.profile.findUnique({
        where: {
            id: params.profileId,
        },
    });
    if (!profile) {
        throw new Error("Something fucked up");
    }
    return { profile, userId };
};
const DetailProfileRoute = () => {
    const { profile, userId } = useLoaderData();
    return <ProfileView profile={profile} userId={userId} />;
};

export default DetailProfileRoute;
