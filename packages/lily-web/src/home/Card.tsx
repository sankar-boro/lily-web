import { useHistory } from "react-router";

const Card = (props: { data: any }) => {
    const history = useHistory();
    const { data } = props;
    return (
        <div
            className="card"
            key={data.bookId}
            onClick={() => {
                history.push({
                    pathname: `/book/view/${data.bookId}`,
                    state: data,
                });
            }}
            style={{marginRight: 25}}
        >
            <div>
                <div className="card-title hover"><span>{data.title}</span></div>
                <div className="card-body hover">
                    {data.body.substr(0, 250)}...
                </div>
            </div>
        </div>
    );
};

export default Card;
