import Card from "./Card";
import BlogCard from "./BlogCard";
import { useHomeContext } from "lily-service";

const BooksContainer = (props: any) => {
    const { books } = props;
    if (books.length > 0) {
        return (
            <div>
                {books
                    .map((book: any) => {
                        return <Card book={book} key={book.bookId} />;
                    })}
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
                {blogs
                    .map((blog: any) => {
                        return <BlogCard blog={blog} key={blog.blogId} />;
                    })}
            </div>
        )
    }
    return null;
}

const Home = () => {
    const { books, blogs } = useHomeContext();
    return (
        <div className="container-sm">
            <BooksContainer books={books} />
            <div style={{marginBottom: 20}}/>
            <BlogsContainer blogs={blogs} />
        </div>
    );
};

export default Home;
