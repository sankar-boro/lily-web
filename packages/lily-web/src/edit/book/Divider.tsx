import { useBookContext } from "lily-service";

import { BookContextType } from "lily-types";
import { Delete } from "lily-utils";
import { DividerContainer } from "lily-web/components";
import { useHistory } from "react-router-dom";


const Divider = () => {
    const context: BookContextType = useBookContext();
    const history = useHistory();

    const { activePage: section, bookId } = context;
    if (!section) return null;

    const goBack = (e: any) => {
        e.preventDefault();
        history.goBack();
    }

    const deleteBook = async () => {
        await Delete({
            context,
            data: { uniqueId: bookId, identity: 101 },
            history
        })
    }

    return <DividerContainer>
        <div className="divider-settings">
            <div className="hover settings-item" onClick={goBack}>&#x2190;</div>
            <div className="hover settings-item" onClick={deleteBook}>Delete</div>
        </div>
    </DividerContainer>
}

export default Divider;
