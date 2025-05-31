// <= IMPORTS =>
import Navbar from "./shared/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchArticleByText } from "@/redux/articleSlice";
import useGetLikedArticles from "@/hooks/useGetLikedArticles";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDaysIcon,
  Eye,
  Loader2,
  Search,
  ThumbsDown,
  ThumbsUp,
  User2,
  X,
} from "lucide-react";

const LikedArticles = () => {
  // USING GET ALL ARTICLES HOOK
  const { loading } = useGetLikedArticles();
  // NAVIGATION
  const navigate = useNavigate();
  // DISPATCH
  const dispatch = useDispatch();
  // GETTING ALL ARTICLE & SEARCH ARTICLE STATE FROM ARTICLE SLICE
  const { likedArticles, searchArticleByText } = useSelector(
    (store) => store.article
  );
  // FILTER ARTICLE STATE
  const [filteredArticles, setFilteredArticles] = useState(likedArticles);
  // INPUT STATE MANAGEMENT
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  // SETTING LIMIT OF ARTICLES PER PAGE
  const limit = 9;
  // FILTERING ARTICLES
  useEffect(() => {
    dispatch(setSearchArticleByText(input));
    setPage(1);
  }, [input, dispatch]);
  // FILTER HANDLING
  useEffect(() => {
    // CONVERTING SEARCH TEXT TO LOWERCASE
    const lowercaseSearch = searchArticleByText.toLowerCase();
    // IF ARTICLES ARE PRESENT
    if (likedArticles && likedArticles.length > 0) {
      const filteredArticles = likedArticles.filter((article) => {
        // IF THERE IS NO SEARCH TEXT THEN RETURNING
        if (!searchArticleByText) {
          return true;
        }
        // IF MATCHES THEN RETURNING ARTICLES BY MATCHING TITLE, CATEGORY & AUTHOR NAME
        return (
          article?.title.toLowerCase().includes(lowercaseSearch) ||
          article?.author?.fullName.toLowerCase().includes(lowercaseSearch) ||
          article?.categories.some((c) =>
            c.toLowerCase().includes(lowercaseSearch)
          )
        );
      });
      // SETTING FILTERED ARTICLES
      setFilteredArticles(filteredArticles);
    } else {
      // IF THERE ARE NO ARTICLES
      setFilteredArticles([]);
    }
  }, [likedArticles, searchArticleByText]);
  // PAGINATION LOGIC
  const total = filteredArticles.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedArticles = filteredArticles.slice(start, start + limit);
  return (
    <>
      <Navbar />
      {/* ARTICLES MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* ARTICLES CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[1rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HEADING */}
          <div className="w-full flex items-center gap-[1rem]">
            <h1 className="flex items-center gap-2 font-[600] text-gray-500 text-[2rem]">
              <ThumbsUp className="text-color-DB w-[3rem] h-[3rem]" />
              Liked Articles
            </h1>
          </div>
          {/* SEARCH ARTICLES */}
          <div className="w-full">
            <input
              type="text"
              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
              placeholder="Search Articles"
              onChange={(e) => setInput(e.target.value)}
            />
            {/* INFO */}
            <p className="text-sm text-gray-500 italic mt-[0.5rem]">
              • You can Search Articles by Title, Author Name & by Categories
            </p>
            {/* RESULTS */}
            {searchArticleByText && (
              <div className="flex items-center justify-center gap-[0.5rem] w-fit mt-[0.5rem] bg-gray-100 px-4 py-2 rounded-md text-gray-500">
                <span>
                  <Search size={30} className="text-color-DB" />
                </span>
                <span>Search Results</span>
                <span className="text-color-DB font-[600] text-[1.5rem] px-2 rounded-md bg-white">
                  {filteredArticles.length}
                </span>
              </div>
            )}
          </div>
          {/* ARTICLES SECTION */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
            </div>
          ) : (
            <section className="w-full">
              {filteredArticles.length <= 0 ? (
                <div className="flex items-center">
                  <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
                    {searchArticleByText !== "" &&
                    filteredArticles.length <= 0 ? (
                      <>
                        <X /> No Articles Match your Search -{" "}
                        <span className="text-color-DB font-[600] text-[1.2rem] capitalize">
                          {searchArticleByText}
                        </span>
                      </>
                    ) : (
                      <>
                        <X /> No Articles Published Yet
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <section className="w-full grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 items-stretch gap-[0.5rem]">
                  {paginatedArticles.map((article) => (
                    <div
                      key={article._id}
                      onClick={() =>
                        navigate(`/articles/detail/${article.slug}`)
                      }
                      className="cursor-pointer flex items-stretch"
                    >
                      <div className="flex flex-col items-start justify-start gap-[0.5rem] rounded-lg p-2 border-gray-300 border-2 shadow-lg hover:shadow-xl">
                        {/* ARTICLE IMAGE SECTION */}
                        <div className="w-full flex items-center justify-center">
                          <img
                            src={article.bannerUrl}
                            alt="Article Banner Image"
                            className="rounded-lg w-full object-contain"
                          />
                        </div>
                        {/* ARTICLE TEXT SECTION */}
                        <div className="w-full flex flex-col items-start justify-start">
                          <h3 className="text-gray-500 font-[600] text-[1.5rem] uppercase">
                            {article.title}
                          </h3>
                          <h3 className="flex items-center gap-[0.3rem] text-color-DB text-[1.15rem] font-[600]">
                            <User2 size={20} />
                            {article.author.fullName}
                          </h3>
                          <h4 className="flex items-center gap-[0.3rem] text-[1.1rem] text-gray-500 font-[600]">
                            <CalendarDaysIcon size={20} />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </h4>
                          <div className="flex items-center gap-[0.65rem] mt-3">
                            <div
                              title="Views"
                              className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
                            >
                              <Eye size={15} className="text-color-DB" />
                              {article.views}
                            </div>
                            <div
                              title="Likes"
                              className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
                            >
                              <ThumbsUp size={15} className="text-color-DB" />
                              {article.likes.length}
                            </div>
                            <div
                              title="Dislikes"
                              className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
                            >
                              <ThumbsDown size={15} className="text-color-DB" />
                              {article.dislikes.length}
                            </div>
                            <div
                              title="Bookmarks"
                              className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
                            >
                              <Bookmark size={15} className="text-color-DB" />
                              {article.bookmarks.length}
                            </div>
                          </div>
                        </div>
                        {/* ARTICLE ACTIONS */}
                        <div className="pt-[1rem] w-full flex items-center gap-[1rem]"></div>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </section>
          )}
          {/* PAGINATION */}
          {!loading && paginatedArticles.length !== 0 && (
            <section className="w-full flex items-center justify-center gap-[0.75rem] border-t-2 border-gray-100 pt-[1rem]">
              {/* PREVIOUS */}
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="flex items-center justify-center text-color-DB border-none outline-none focus:outline-none p-[0.3rem] rounded-full bg-gray-200"
              >
                <ArrowLeft size={18} />
              </button>
              {/* CURRENT PAGE */}
              <span className="text-gray-500 font-[600] text-sm">
                Page {page} of {pages} ({total} Total)
              </span>
              {/* NEXT */}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="flex items-center justify-center text-color-DB border-none outline-none focus:outline-none p-[0.3rem] rounded-full bg-gray-200"
              >
                <ArrowRight size={18} />
              </button>
            </section>
          )}
        </section>
      </section>
    </>
  );
};

export default LikedArticles;
