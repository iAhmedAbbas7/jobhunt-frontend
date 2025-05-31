// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeArticle } from "@/redux/articleSlice";
import { useDispatch, useSelector } from "react-redux";
import useGetMyArticles from "@/hooks/useGetMyArticles";
import { ARTICLE_API_ENDPOINT } from "@/utils/constants";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDaysIcon,
  CheckCircle2,
  Edit,
  Eye,
  FileText,
  Loader2,
  PlusCircle,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User2,
  X,
} from "lucide-react";

const MyArticles = () => {
  // DISPATCH
  const dispatch = useDispatch();
  // NAVIGATION
  const navigate = useNavigate();
  // STATE MANAGEMENT
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [draftSearch, setDraftSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [committedSearch, setCommittedSearch] = useState("");
  // SETTING LIMIT
  let limit = 10;
  // USING USE GET MY ARTICLES HOOK
  const { loading, pages, total } = useGetMyArticles(
    page,
    limit,
    committedSearch,
    category
  );
  // GETTING MY ARTICLES FROM REDUX STATE
  const { myArticles } = useSelector((store) => store.article);
  // FETCHING CATEGORIES
  useEffect(() => {
    axios
      .get(`${ARTICLE_API_ENDPOINT}/categories`)
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.data);
        }
      })
      .catch((err) => console.error("Failed to Load Categories", err));
  }, []);
  // RESTORE ARTICLES HANDLER
  const restoreArticles = () => {
    // FORCING ARTICLES REFETCH
    setCommittedSearch("");
    setDraftSearch("");
    setCategory("");
    setPage(1);
    limit = 10;
  };
  // DELETE ARTICLE HANDLER
  const deleteArticleHandler = async (articleId) => {
    // CONFIRMATION DIALOG BEFORE DELETING ARTICLE
    const result = await Swal.fire({
      title: "Are you sure ?",
      text: "This action will delete this Article Permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#cc9675",
      cancelButtonColor: "#365e7d",
      confirmButtonText: "Yes Delete !",
      customClass: {
        container: "my-swal-container",
      },
    });
    // IF THE USER CANCELS, RETURNING
    if (!result.isConfirmed) return;
    // LOADING STATE
    setDeletingId(articleId);
    // IF CONFIRMED
    try {
      // MAKING REQUEST
      const response = await axios.delete(
        `${ARTICLE_API_ENDPOINT}/${articleId}/delete`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // REMOVING ARTICLE FROM REDUX SLICE ARTICLE'S LIST
        dispatch(removeArticle(articleId));
        // TOASTING SUCCESS MESSAGE
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message);
    } finally {
      // LOADING STATE
      setDeletingId(null);
    }
  };
  return (
    <>
      <Navbar />
      {/* MY ARTICLES MAIN WRAPPER */}
      <section className="w-full flex items-center justify-center sm:px-[2rem] px-[1rem] py-[2rem]">
        {/* MY ARTICLES CONTENT WRAPPER */}
        <section className="flex flex-col items-center justify-center gap-[2rem] w-full border-2 border-gray-100 rounded-xl sm:p-[2rem] p-[1rem] tracking-[0.5px]">
          {/* HADING & GO NEW ARTICLE BUTTON */}
          <div className="w-full flex items-center justify-between flex-wrap-reverse gap-[1rem]">
            <h1 className="flex items-center gap-2 font-[600] text-gray-500 text-[2rem]">
              <FileText className="text-color-DB w-[3rem] h-[3rem]" />
              Articles
            </h1>
            <Button
              onClick={() => navigate("/admin/article/create")}
              className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
            >
              <PlusCircle />
              New Article
            </Button>
          </div>
          {/* SEARCH FORM */}
          <form
            className="w-full flex flex-col items-start justify-center gap-[0.5rem]"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* SEARCH ARTICLES */}
            <div className="w-full">
              <input
                type="text"
                value={draftSearch}
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                placeholder="Search Articles"
                onChange={(e) => {
                  setDraftSearch(e.target.value);
                  setCategory("");
                }}
              />
              {/* INFO */}
              <p className="text-sm text-gray-500 italic mt-[0.5rem]">
                • You can Search Articles by Title or Content
              </p>
              {/* RESULTS */}
            </div>
            {/* SEARCH BUTTON */}
            <Button
              type="button"
              onClick={() => {
                setPage(1);
                setCommittedSearch(draftSearch);
              }}
              className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
            >
              <Search />
              Search
            </Button>
            {/* CATEGORY SEARCH */}
            <div className="w-full">
              <select
                className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value), setPage(1);
                  setCommittedSearch("");
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option value={cat} key={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {/* INFO */}
              <p className="text-sm text-gray-500 italic mt-[0.5rem]">
                • You can Search Articles by Choosing Category
              </p>
            </div>
            {/* RESULTS */}
            {!loading && (committedSearch || category) && (
              <div className="flex flex-col items-start justify-center gap-[0.5rem]">
                <div className="flex items-center justify-center gap-[0.5rem] w-fit mt-[0.5rem] bg-gray-100 px-4 py-2 rounded-md text-gray-500">
                  <span>
                    <Search size={30} className="text-color-DB" />
                  </span>
                  <span>Search Results</span>
                  <span className="text-color-DB font-[600] text-[1.5rem] px-2 rounded-md bg-white">
                    {myArticles.length}
                  </span>
                </div>
                {!myArticles.length <= 0 && (
                  <Button
                    type="button"
                    onClick={restoreArticles}
                    className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
                  >
                    <CheckCircle2 />
                    View All
                  </Button>
                )}
              </div>
            )}
          </form>
          {/* ARTICLES */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-12 h-12 text-color-DB" />
            </div>
          ) : (
            <section className="w-full">
              {myArticles.length <= 0 ? (
                <div className="flex items-start justify-center flex-col gap-[0.5rem]">
                  <span className="text-gray-500 bg-gray-100 px-[1rem] py-[0.5rem] rounded-lg flex items-center gap-[0.5rem] font-medium">
                    {(committedSearch || category) && myArticles.length <= 0 ? (
                      <>
                        <X /> No Articles Match{" "}
                        {committedSearch && !category && "Your Search"}
                        {!committedSearch && category && "Your Category"} -{" "}
                        <span className="text-color-DB font-[600] text-[1.2rem] capitalize">
                          {committedSearch && !category && committedSearch}
                          {!committedSearch && category && category}
                        </span>
                      </>
                    ) : (
                      <>
                        <X /> No Articles Published Yet
                      </>
                    )}
                  </span>
                  {(committedSearch || category) && myArticles.length <= 0 && (
                    <>
                      {/* SEARCH BUTTON */}
                      <Button
                        type="button"
                        onClick={restoreArticles}
                        className="bg-color-DB hover:bg-color-LB font-medium text-[1rem] focus:outline-none outline-none border-none"
                      >
                        <ArrowLeft />
                        Restore Search
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <section className="w-full grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 items-stretch gap-[0.5rem]">
                  {myArticles.map((article) => (
                    <div
                      key={article._id}
                      onClick={() =>
                        navigate(`/admin/articles/${article.slug}`)
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
                        <div className="pt-[1rem] w-full flex items-center gap-[1rem]">
                          <div
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/admin/articles/${article.slug}/update`
                              );
                            }}
                            className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem] cursor-pointer"
                          >
                            <Edit size={25} className="text-color-DB" />
                          </div>
                          <div
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteArticleHandler(article._id);
                            }}
                            className="p-1 bg-gray-200 text-gray-500 font-[600] rounded-sm flex items-center gap-[0.3rem] cursor-pointer"
                          >
                            {deletingId === article._id ? (
                              <Loader2
                                size={25}
                                className="animate-spin text-color-DB"
                              />
                            ) : (
                              <Trash2 size={25} className="text-color-DB" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </section>
          )}
          {/* PAGINATION */}
          {!loading && myArticles.length !== 0 && (
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

export default MyArticles;
