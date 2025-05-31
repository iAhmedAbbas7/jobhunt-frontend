// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import CommentsSection from "./CommentsSection";
import { useEffect, useRef, useState } from "react";
import { ARTICLE_API_ENDPOINT } from "@/utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftCircle,
  Bookmark,
  CalendarDaysIcon,
  Eye,
  List,
  Loader2,
  MessageCircleMore,
  ThumbsDown,
  ThumbsUp,
  User2,
  X,
} from "lucide-react";

const ArticleDescription = () => {
  // NAVIGATION
  const navigate = useNavigate();
  // GETTING ARTICLE SLUG FROM URL PARAMS
  const { slug } = useParams();
  // STATE MANAGEMENT
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  // GETTING CURRENT LOGGED IN USER FROM AUTH SLICE
  const { user } = useSelector((store) => store.auth);
  //SETTING USER ID
  const userId = user._id;
  // REFS FOR EACH SECTION CONTAINER
  const sectionRefs = useRef([]);
  // RESETTING SECTION REFS ON ARTICLE CHANGE
  useEffect(() => {
    sectionRefs.current = [];
  }, [article]);
  // EFFECT TO FETCH THE ARTICLE DETAILS ON RENDER
  useEffect(() => {
    const fetchArticleBySLug = async () => {
      // LOADING STATE
      setLoading(true);
      try {
        const response = await axios.get(
          `${ARTICLE_API_ENDPOINT}/slug/${slug}`,
          { withCredentials: true }
        );
        // IF RESPONSE SUCCESS
        if (response.data.success) {
          // SETTING THE ARTICLE
          setArticle(response.data.data);
        }
      } catch (error) {
        console.error("Failed to Load Article!", error);
        // TOASTING ERROR MESSAGE
        toast.error(
          error?.response?.data?.message || "Failed to Load Article!"
        );
      } finally {
        // LOADING STATE
        setLoading(false);
      }
    };
    // FETCHING THE ARTICLE
    fetchArticleBySLug();
  }, [slug]);
  // SCROLL TO THE HEADING
  const scrollTo = (id) => {
    // GETTING ELEMENT
    const element = document.getElementById(id);
    // IF NOT ELEMENT
    if (!element) return;
    // SETTING DESIRED Y AXIS HEIGHT
    const y = element.getBoundingClientRect().top + window.pageYOffset - 95;
    // APPLYING SCROLL
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  // ARTICLE ACTIONS HANDLER
  const toggleAction = async (type) => {
    // IF NO ARTICLE OR USER ID
    if (!article || !userId) return;
    // SETTING URL
    const url = `${ARTICLE_API_ENDPOINT}/${article._id}/${type}`;
    // SETTING ACTIONS & OPPOSITE ACTIONS
    let arrKey, oppositeKey;
    if (type === "like") {
      arrKey = "likes";
      oppositeKey = "dislikes";
    } else if (type === "dislike") {
      arrKey = "dislikes";
      oppositeKey = "likes";
    } else if (type === "bookmark") {
      arrKey = "bookmarks";
    }
    // SNAPSHOT FOR ROLLBACK
    const previous = {
      [arrKey]: [...article[arrKey]],
      ...(oppositeKey ? { [oppositeKey]: [...article[oppositeKey]] } : {}),
    };
    // OPTIMISTIC UI UPDATE
    setArticle((a) => {
      const has = a[arrKey].includes(userId);
      const next = {
        ...a,
        [arrKey]: has
          ? a[arrKey].filter((id) => id !== userId)
          : [...a[arrKey], userId],
      };
      if (oppositeKey) {
        next[oppositeKey] = next[oppositeKey].filter((id) => id !== userId);
      }
      return next;
    });
    // MAKING REQUEST
    try {
      const response = await axios.post(url, {}, { withCredentials: true });
      // IF RESPONSE NOT SUCCESS
      if (!response.data.success) throw new Error(response.data.message);
    } catch (error) {
      // ROLLBACK
      setArticle((a) => ({ ...a, ...previous }));
      // TOASTING ERROR MESSAGE
      toast.error(
        error?.response?.data?.message || "Failed to Perform Action!"
      );
      console.error("Failed to Perform Action!", error);
    }
  };
  // IF LOADING
  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen w-screen">
          <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
        </div>
      </>
    );
  }
  // IF NO ARTICLE
  if (!article) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[87vh]">
          <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
            <X /> Article Not Found
          </span>
        </div>
      </>
    );
  }
  // HAS LIKED CHECK
  const hasLiked = article.likes.includes(userId);
  // HAS DISLIKED CHECK
  const hasDisliked = article.dislikes.includes(userId);
  // HAS BOOKMARKED CHECK
  const hasBookmarked = article.bookmarks.includes(userId);
  return (
    <>
      <Navbar />
      {/* ARTICLE DETAIL MAIN WRAPPER */}
      <section className="flex flex-col md:flex-row items-start justify-center">
        {/* SIDEBAR */}
        <section className="hidden lg:block sticky top-20 overflow-y-auto py-4 border-r-2 border-gray-200 w-[28%] h-[calc(100vh-5rem)]">
          {/* SIDEBAR HEADING */}
          <h2 className="flex items-center gap-2 text-gray-500 text-[1.75rem] font-[600] px-3">
            <List size={30} /> On This Page
          </h2>
          {/* SIDEBAR CONTENT */}
          <ul className="w-full mt-[1rem]">
            {/* ARTICLE HEADINGS */}
            <h1 className="text-gray-500 font-[600] text-[1.3rem] px-3 py-2">
              <span>• Sections :</span>
            </h1>
            {article.sections.flat().map((sec, idx) => {
              // DERIVING ID FOR EACH SECTION
              const id = `section-${idx}`;
              return (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="w-full text-left px-3 py-2 text-gray-500 font-[600] text-[1.1rem] hover:bg-blue-100 capitalize"
                  >
                    {sec.heading}
                  </button>
                </li>
              );
            })}
            {/* MORE FROM AUTHOR SECTION */}
            <li key="more-from-author">
              <button
                onClick={() => scrollTo("more-from-author")}
                className="w-full text-left px-3 py-2 text-gray-500 font-[600] text-[1.1rem] hover:bg-blue-100 capitalize flex items-center gap-[0.5rem]"
              >
                <List />
                <span>More From {article.author.fullName}</span>
              </button>
            </li>
            {/* COMMENTS */}
            <li key="comments">
              <button
                onClick={() => scrollTo("comments")}
                className="w-full text-left px-3 py-2 text-gray-500 font-[600] text-[1.1rem] hover:bg-blue-100 capitalize flex items-center gap-[0.5rem]"
              >
                <MessageCircleMore />
                <span>Comments</span>
              </button>
            </li>
          </ul>
        </section>
        {/* CONTENT SECTION */}
        <section className="flex-1 px-4 py-4 flex items-start justify-start flex-col gap-[0.85rem]">
          {/* ARTICLE INFO */}
          <div className="w-full flex flex-col items-start justify-start">
            {/* TITLE & GO BACK BUTTON */}
            <div className="w-full flex items-center justify-between gap-[0.5rem] flex-wrap-reverse">
              <h1 className="text-[2.5rem] uppercase text-gray-500 font-[800]">
                {article.title}
              </h1>
              <Button
                onClick={() => navigate("/articles")}
                className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] border-none focus:outline-none outline-none "
              >
                <ArrowLeftCircle />
                Go Back
              </Button>
            </div>
            {/* ARTICLE AUTHOR */}
            <h3 className="flex items-center gap-[0.3rem] text-color-DB text-[1.15rem] font-[600]">
              <User2 size={20} />
              {article.author.fullName}
            </h3>
            {/* ARTICLE POSTED DATE */}
            <h4 className="flex items-center gap-[0.3rem] text-[1.1rem] text-gray-500 font-[600]">
              <CalendarDaysIcon size={20} />
              {new Date(article.createdAt).toLocaleDateString()}
            </h4>
            {/* ARTICLE STATS */}
            <div className="flex items-center gap-[0.65rem] mt-3">
              {/* VIEWS */}
              <div
                title="Views"
                className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
              >
                <Eye size={15} className="text-color-DB" />
                {article.views}
              </div>
              {/* LIKES */}
              <div
                title="Likes"
                className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
              >
                <ThumbsUp size={15} className="text-color-DB" />
                {article.likes.length}
              </div>
              {/* DISLIKES */}
              <div
                title="Dislikes"
                className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
              >
                <ThumbsDown size={15} className="text-color-DB" />
                {article.dislikes.length}
              </div>
              {/* BOOKMARKS */}
              <div
                title="Bookmarks"
                className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
              >
                <Bookmark size={15} className="text-color-DB" />
                {article.bookmarks.length}
              </div>
              {/* COMMENTS */}
              <div
                title="Comments"
                className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem]"
              >
                <MessageCircleMore size={15} className="text-color-DB" />
                {article.commentsCount}
              </div>
            </div>
            {/* ARTICLE ACTIONS */}
            <div className="flex items-center gap-[0.65rem] mt-3">
              {/* LIKE */}
              <div
                title={hasLiked ? "Liked" : "Like"}
                onClick={() => toggleAction("like")}
                className={`p-2  font-[600] rounded-full flex items-center gap-[0.3rem] cursor-pointer ${
                  hasLiked
                    ? "bg-color-DB text-white"
                    : "bg-gray-200 text-color-DB"
                }`}
              >
                <ThumbsUp size={25} />
              </div>
              {/* DISLIKE */}
              <div
                title={hasDisliked ? "Disliked" : "Dislike"}
                onClick={() => toggleAction("dislike")}
                className={`p-2  font-[600] rounded-full flex items-center gap-[0.3rem] cursor-pointer ${
                  hasDisliked
                    ? "bg-color-DB text-white"
                    : "bg-gray-200 text-color-DB"
                }`}
              >
                <ThumbsDown size={25} />
              </div>
              {/* BOOKMARK */}
              <div
                title={hasBookmarked ? "Bookmarked" : "Bookmark"}
                onClick={() => toggleAction("bookmark")}
                className={`p-2  font-[600] rounded-full flex items-center gap-[0.3rem] cursor-pointer ${
                  hasBookmarked
                    ? "bg-color-DB text-white"
                    : "bg-gray-200 text-color-DB"
                }`}
              >
                <Bookmark size={25} />
              </div>
            </div>
          </div>
          {/* BANNER IMAGE */}
          <div className="w-full flex items-center justify-center">
            <img
              src={article.bannerUrl}
              alt="Article Banner Image"
              className="rounded-lg"
            />
          </div>
          {/* ARTICLE CONTENT SECTION */}
          <section className="flex flex-col items-start justify-start gap-[4rem] pt-[2rem] pb-[3rem]">
            {article.sections.flat().map((sec, idx) => {
              // DRIVING ID FOR EACH SECTION
              const id = `section-${idx}`;
              return (
                <section
                  key={id}
                  id={id}
                  ref={(el) => {
                    sectionRefs.current[idx] = el;
                  }}
                  className="w-full flex flex-col items-start justify-start gap-[1rem]"
                >
                  {/* SECTION HEADING */}
                  <h2
                    onClick={() => scrollTo(id)}
                    className="text-gray-500 font-[700] text-[1.85rem] uppercase sticky top-[4.8rem] bg-white w-full z-[100] cursor-pointer"
                  >
                    {sec.heading}
                  </h2>
                  {/* SECTION CONTENT */}
                  <div
                    className="prose text-gray-500 text-[1.1rem] mt-[1rem]"
                    dangerouslySetInnerHTML={{ __html: sec.content }}
                  />
                  {/* SECTION IMAGE */}
                  {sec?.imageUrl && (
                    <div className="w-full flex items-center justify-center">
                      <img
                        src={sec.imageUrl}
                        alt="Section Image"
                        className="h-full rounded-lg"
                      />
                    </div>
                  )}
                </section>
              );
            })}
          </section>
          {/* MORE FROM THIS AUTHOR SECTION */}
          {article.moreFromAuthor && article.moreFromAuthor.length > 0 && (
            <section
              id="more-from-author"
              className="w-full flex flex-col items-start justify-center gap-[1rem] pb-[2rem]"
            >
              {/* HEADING */}
              <h1 className="flex items-center justify-start gap-[0.5rem]">
                <List size={30} className="text-gray-500" />
                <span className="text-[1.5rem] text-gray-500 font-[600]">
                  More from{" "}
                  <span className="px-3 py-1 rounded-md text-color-DB bg-gray-100">
                    {article.author.fullName}
                  </span>
                </span>
              </h1>
              {/* GRID SECTION */}
              <section className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 items-stretch gap-[0.5rem]">
                {article.moreFromAuthor.map((article) => (
                  <div
                    key={article._id}
                    onClick={() => navigate(`/articles/detail/${article.slug}`)}
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
            </section>
          )}
          {/* COMMENTS SECTION */}
          <div id="comments" className="w-full">
            <CommentsSection
              articleId={article._id}
              isArticleAuthor={user?._id === article.author._id}
              articleAuthorId={article.author._id}
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default ArticleDescription;
