import { useHomeContext } from "lily-service";
import { HomeContextType, HOME_SERVICE } from "lily-types";
import { useHistory } from "react-router";

const Card = (props: { book: any }) => {
    const history = useHistory();
    const { dispatch }: HomeContextType = useHomeContext();
    const { book } = props;
    return (
        <div
            className="card"
            key={book.bookId}
            onClick={() => {
                dispatch({
                    keys: ['title'],
                    values: [book.title]
                })
                history.push({
                    pathname: `/book/view/${book.bookId}`,
                    state: book,
                });
            }}
            style={{marginRight: 25}}
        >
            <div>
                <div className="card-title hover"><span>{book.title}</span></div>
                <div className="card-body hover">
                    {book.body.substr(0, 250)}...
                </div>
            </div>
        </div>
    );
};

export default Card;
