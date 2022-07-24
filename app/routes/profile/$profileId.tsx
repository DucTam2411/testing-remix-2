import { Post, Profile } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { Chrono } from "react-chrono";
import Divider from "~/components/Divider";
import ProfileView from "~/components/ProfileView";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    const user = await getUser(request);
    if (!user || typeof user === "undefined") {
        return null;
    }
    const profile = await db.profile.findFirst({
        where: {
            id: params.profileId,
        },
        select: {
            user: {
                select: {
                    posts: {
                        select: {
                            body: true,
                            createdAt: true,
                            title: true,
                        },
                    },
                },
            },
            email: true,
            id: true,
            name: true,
            phoneNumber: true,
            profileImageUrl: true,
            userId: true,
        },
    });

    if (!profile) {
        throw new Error("Server Error");
    }
    return { profile, userId: user.id };
};
const DetailProfileRoute = () => {
    const { profile, userId } = useLoaderData();
    const posts = profile.user.posts.map((item: Post) => ({
        cardSubtitle: new Date(item.createdAt).toLocaleTimeString(),
        cardTitle: item.title + " ",
        title: new Date(item.createdAt).toLocaleDateString(),
        cardDetailedText: item.body,
    }));
    return (
        <>
            <ProfileView profile={profile} userId={userId} />
            <br />
            <Divider />
            <div className="container">
                <div className="row"></div>
            </div>
            {posts.length > 0 && (
                <Chrono
                    items={posts}
                    mode="VERTICAL_ALTERNATING"
                    theme={{
                        primary: "black",
                        secondary: "black",
                        cardBgColor: "white",
                        cardForeColor: "black",
                        titleColor: "black",
                        titleColorActive: "white",
                    }}
                    hideControls={true}
                    cardHeight={100}
                    enableOutline
                    useReadMore
                />
            )}
        </>
    );
};

export default DetailProfileRoute;
