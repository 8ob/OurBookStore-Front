import React, { useEffect, useState } from "react";
import BookCard from "../../../components/UsedBookListCard/BookCard";
import { useGetApiUsedBooksUserIdUserId } from "../../../API";
import backgroundImage from "../../../assets/images/main-slider/YourBook.jpg";
// import './style.css';
import "../UseBookList/Liststyle.css";
// import '../../../assets/css/bootstrap.css';
import "../../../assets/css/style.css";
import "../../../assets/css/responsive.css";
import "../../../assets/css/color.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faBook } from "@fortawesome/free-solid-svg-icons";
import Preloader from "../../../components/Preloader/Preloader";
import { Link } from "react-router-dom";

const UserBooksList: React.FC<{ userId: number }> = ({ userId }) => {
    const { data, isLoading, error } = useGetApiUsedBooksUserIdUserId(userId);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 100);
        };

        // 添加滾動偵聽器
        window.addEventListener("scroll", handleScroll);

        // 清除偵聽器
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (isLoading) return <Preloader />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {/* 背景圖片和標題 */}
            <section
                className="page-title"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <Link
                    to="/UsedBook/add-used-book"
                    className="btn-style-one"
                    style={{
                        position: "absolute",
                        top: "320px",
                        left: "820px",
                    }}
                >
                    <span>上架二手書</span>
                </Link>
            </section>

            <section>
                {/* <section>
          <div className='container' style={{ marginTop: '30px' }}>
            <div className='row justify-content-end'>
              <div className='col-3'>
                <h1 className='ListTitle'>
                  <FontAwesomeIcon
                    icon={faBook}
                    style={{ color: '#968369', fontSize: '30px' }}
                  />
                  我的上架書籍
                </h1>
              </div>
              <div className='col-9'></div>
            </div>
          </div>
        </section> */}

                <div className="container" style={{ marginTop: "80px" }}>
                    <div className="user-books-list">
                        {data?.data.map((book) => (
                            <BookCard key={book.id} usedbook={book} />
                        ))}
                    </div>
                </div>
            </section>
            {showScrollToTop && (
                <div className="scroll-to-top1" onClick={scrollToTop}>
                    <span>
                        <FontAwesomeIcon icon={faChevronUp} />
                    </span>
                </div>
            )}
        </div>
    );
};

export default UserBooksList;
