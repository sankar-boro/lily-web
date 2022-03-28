import { useHomeContext } from "lily-service";
import { HomeContextType, HOME_SERVICE } from "lily-types";
import { useHistory } from "react-router";

const Card = (props: { blog: any }) => {
    const history = useHistory();
    const { dispatch }: HomeContextType = useHomeContext();
    const { blog } = props;
    return (
        <div
            className="card"
            key={blog.blogId}
            onClick={() => {
                dispatch({
                    keys: ['title'],
                    values: [blog.title]
                })
                history.push({
                    pathname: `/blog/view/${blog.blogId}`,
                    state: blog,
                });
            }}
            style={{marginRight: 25}}
        >
            <div>
                <div className="card-title hover"><span>{blog.title}</span></div>
                <div className="card-body hover">
                    {blog.body.substr(0, 250)}...
                </div>
            </div>
        </div>
    );
};

export default Card;
