import BookCard from "./BookCard";
import BlogCard from "./BlogCard";
import { useHomeContext } from "lily-service";
import { useEffect } from "react";

const BooksContainer = (props: any) => {
    const { books } = props;
    if (books.length > 0) {
        return (
            <div>
                <div style={{ borderBottom: "1px solid #ccc", padding: "0px 0px 10px 0px" }}>Books</div>
                <div className="books-container">
                    {books
                        .map((book: any) => {
                            return <BookCard book={book} key={book.bookId} />;
                        })}
                </div>
            </div>
        )
    }
    return null;
}

const BlogsContainer = (props: any) => {
    const { blogs } = props;
    if (blogs.length > 0) {
        return (
            <div>
                <div style={{ borderBottom: "1px solid #ccc", padding: "0px 0px 10px 0px" }}>Blogs</div>
                <div className="blogs-container">
                    {blogs
                        .map((blog: any) => {
                            return <BlogCard blog={blog} key={blog.blogId} />;
                        })}
                </div>
            </div>
        )
    }
    return null;
}

const Home = () => {
    const { books, blogs, dispatch } = useHomeContext();
    useEffect(() => {
        dispatch({
            keys: ['title'],
            values: [null]
        })
    },[]);
    return (
        <div className="container-sm" style={{ paddingTop: 20 }}>
            <BooksContainer books={books} />
            <div style={{marginBottom: 20}}/>
            <BlogsContainer blogs={blogs} />
        </div>
    );
};

export default Home;
