import type { Post, Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Divider from "~/components/Divider";
import PostView from "~/components/PostView";
import ProfileView from "~/components/ProfileView";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { Chrono } from "react-chrono";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    if (!user || typeof user === "undefined") {
        return null;
    }
    const profile = await db.profile.findFirst({
        where: {
            userId: user.id,
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
function ProfileRoute() {
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
}

export default ProfileRoute;
