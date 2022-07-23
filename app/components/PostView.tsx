import { Form, Link } from "@remix-run/react";

const PostView = ({
    post,
    user,
    disable = false,
}: {
    post: any;
    user?: any;
    disable?: boolean;
}) => {
    const style = disable ? { opacity: "0.3" } : {};

    return (
        <div>
            <div className="page-header" style={style}>
                <h1>{post.title}</h1>
                <Link to="/posts" className="btn btn-reverse">
                    Back
                </Link>
            </div>

            <div className="page-content">{post.body}</div>

            <div className="page-footer">
                {user && user.id === post.userId && (
                    <Form method="post">
                        <input type="hidden" name="_method" value="delete" />
                        <button className="btn btn-delete">Delete</button>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default PostView;
