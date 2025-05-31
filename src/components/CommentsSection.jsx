// <= IMPORTS =>
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useSelector } from "react-redux";
import useComments from "@/hooks/useComments";
import AVATAR from "../assets/images/AVATAR.png";
import { Avatar, AvatarImage } from "./ui/avatar";
import { COMMENTS_API_ENDPOINT } from "@/utils/constants";
import {
  ArrowLeft,
  ArrowRight,
  Edit2,
  Loader2,
  MessageCircleMore,
  Pin,
  PinOff,
  Reply,
  ReplyAll,
  SendHorizonal,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Verified,
  X,
} from "lucide-react";

const CommentsSection = ({ articleId, isArticleAuthor, articleAuthorId }) => {
  // CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // SETTING USER ID
  const userId = user._id;
  // STATE MANAGEMENT
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState("");
  const [replyDraft, setReplyDraft] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyDraft, setEditingReplyDraft] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  // USING USE COMMENTS HOOK
  const { loading, error, pages, comments, setComments } = useComments(
    articleId,
    page,
    10
  );
  // SETTING COMMENTS WITH PIN COMMENT ON TOP
  const orderedComments = [
    ...comments.filter((c) => c.pinned),
    ...comments.filter((c) => !c.pinned),
  ];
  // REPLIES RE-ORDER HELPER FUNCTION
  const reorderReplies = (replies) => {
    // PINNED REPLY
    const pinned = replies.filter((r) => r.pinned);
    // UNPINNED REPLIES
    const unpinned = replies
      .filter((r) => !r.pinned)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...pinned, ...unpinned];
  };
  // POST COMMENT HANDLER
  const postComment = async () => {
    // IF COMMENT EMPTY
    if (!draft.trim()) return;
    // TEMPORARY ID
    const temporaryID = "temp-" + Date.now();
    // CREATING LOCAL COMMENT
    const temporaryComment = {
      _id: temporaryID,
      content: draft.trim(),
      likes: [],
      dislikes: [],
      replies: [],
      createdAt: new Date().toISOString(),
      author: {
        _id: userId,
        fullName: user.fullName,
        profile: { profilePhoto: user?.profile?.profilePhoto },
      },
    };
    // OPTIMISTICALLY ADDING
    setComments((c) => [temporaryComment, ...c]);
    // CLEARING INPUT
    setDraft("");
    // MAKING REQUEST
    try {
      const response = await axios.post(
        `${COMMENTS_API_ENDPOINT}/postComment`,
        { articleId, content: draft.trim() },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // REPLACING TEMPORARY COMMENT WITH SERVER RESPONSE COMMENT
        setComments((c) =>
          c.map((cm) =>
            cm._id === temporaryComment._id ? { ...response.data.data } : cm
          )
        );
        // GOING BACK TO FIRST PAGE TO SEE NEW COMMENT
        setPage(1);
        // TOASTING SUCCESS MESSAGE
        toast.success(response?.data?.message);
      } else {
        throw new Error(response.data.message || "Error Posting Comment");
      }
    } catch (error) {
      // REMOVING TEMPORARY COMMENT ON ERROR
      setComments((c) => c.filter((cm) => cm._id !== temporaryComment._id));
      console.error("Error Posting Comment!", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Error Posting Comment!");
    }
  };
  // POST REPLY HANDLER
  const postReply = async (parentId) => {
    // SETTING CONTENT
    const content = replyDraft[parentId]?.trim();
    // IF NO CONTENT
    if (!content) return;
    // TEMPORARY ID
    const temporaryID = "temp-" + Date.now();
    // CREATING LOCAL REPLY
    const newReply = {
      _id: temporaryID,
      content,
      likes: [],
      dislikes: [],
      createdAt: new Date().toISOString(),
      author: {
        _id: userId,
        fullName: user.fullName,
        profile: { profilePhoto: user?.profile?.profilePhoto },
      },
    };
    // SNAPSHOT OF PREVIOUS COMMENTS FOR ROLLBACK
    const previousComments = comments;
    // OPTIMISTICALLY ADDING
    setComments((cm) =>
      cm.map((c) =>
        c._id === parentId
          ? { ...c, replies: reorderReplies([newReply, ...(c.replies || [])]) }
          : c
      )
    );
    // RESETTING REPLY DRAFT
    setReplyDraft((d) => ({ ...d, [parentId]: "" }));
    // RESETTING REPLY TO
    setReplyingTo(null);
    // MAKING REQUEST
    try {
      const response = await axios.post(
        `${COMMENTS_API_ENDPOINT}/${parentId}/reply`,
        { content },
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // REPLACING THE TEMPORARY REPLY WITH REAL REPLY FROM SERVER RESPONSE
        setComments((cm) =>
          cm.map((c) =>
            c._id === parentId
              ? {
                  ...c,
                  replies: reorderReplies(
                    c.replies.map((r) =>
                      r._id === newReply._id ? response.data.data : r
                    )
                  ),
                }
              : c
          )
        );
        // TOASTING SUCCESS MESSAGE
        toast.success(response?.data?.message || "Reply Posted!");
      }
    } catch (error) {
      // ROLLBACK TO PREVIOUS COMMENTS
      setComments(previousComments);
      console.error("Failed to Post Reply!", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Failed to Post Reply!");
    }
  };
  // DELETE COMMENT HANDLER
  const deleteComment = async (commentId) => {
    // CURRENT COMMENTS COPY
    const currentComments = comments;
    // OPTIMISTICALLY REMOVING COMMENT
    setComments((c) => c.filter((cm) => cm._id !== commentId));
    try {
      const response = await axios.delete(
        `${COMMENTS_API_ENDPOINT}/${commentId}`,
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // SETTING PAGE TO ONE TO SEE UPDATED COMMENTS LIST
        setPage(1);
        // TOASTING SUCCESS MESSAGE
        toast.success(response?.data?.message);
      }
    } catch (error) {
      // ROLLING BACK LOCAL COMMENTS ON ERROR
      setComments(currentComments);
      console.error("Error Deleting Comment!", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Error Deleting Comment!");
    }
  };
  // DELETE REPLY HANDLER
  const deleteReply = async (commentId, replyId) => {
    // SNAPSHOT OF PREVIOUS COMMENTS
    const previousComments = comments;
    // OPTIMISTICALLY REMOVING THE REPLY FROM UI
    setComments((cm) =>
      cm.map((c) =>
        c._id === commentId
          ? {
              ...c,
              replies: reorderReplies(
                c.replies.filter((r) => r._id !== replyId)
              ),
            }
          : c
      )
    );
    // MAKING REQUEST
    try {
      const response = await axios.delete(
        `${COMMENTS_API_ENDPOINT}/${commentId}/reply/${replyId}`,
        { withCredentials: true }
      );
      if (response.data.success) toast.success(response?.data?.message);
      else throw new Error(response?.data?.message);
    } catch (error) {
      // ROLLBACK TO PREVIOUS COMMENTS
      setComments(previousComments);
      console.error("Error Deleting Reply!", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Error Deleting Reply!");
    }
  };
  // EDIT COMMENT HANDLER
  const editComment = async (commentId) => {
    // NEW CONTENT
    const newText = commentDraft.trim();
    // IF NO CONTENT
    if (!newText) return;
    // SNAPSHOT OF PREVIOUS COMMENTS
    const previousComments = comments.map((c) => ({ ...c }));
    // OPTIMISTICALLY UPDATING COMMENT
    setComments((cm) =>
      cm.map((c) => (c._id === commentId ? { ...c, content: newText } : c))
    );
    // RESETTING EDITING COMMENT ID
    setEditingCommentId(null);
    // MAKING REQUEST
    try {
      await axios.patch(
        `${COMMENTS_API_ENDPOINT}/${commentId}`,
        { content: newText },
        { withCredentials: true }
      );
    } catch (error) {
      // ROLLBACK TO PREVIOUS COMMENTS ON ERROR
      setComments(previousComments);
      console.error("Failed to Edit Comment!", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Failed to Edit Comment!");
    }
  };
  // EDIT REPLY HANDLER
  const editReply = async (commentId, replyId) => {
    // NEW CONTENT
    const newText = editingReplyDraft.trim();
    // IF NO CONTENT
    if (!newText) return;
    // SNAPSHOT OF PREVIOUS COMMENTS
    const previousComments = comments.map((c) => ({
      ...c,
      replies: c.replies.map((r) => ({ ...r })),
    }));
    // OPTIMISTICALLY UPDATING REPLY
    setComments((cm) =>
      cm.map((c) => {
        if (c._id !== commentId) return c;
        return {
          ...c,
          replies: c.replies.map((r) =>
            r._id === replyId ? { ...r, content: newText } : r
          ),
        };
      })
    );
    // RESETTING EDITING REPLY ID
    setEditingReplyId(null);
    // MAKING REQUEST
    try {
      await axios.patch(
        `${COMMENTS_API_ENDPOINT}/${commentId}/reply/${replyId}`,
        { content: newText },
        { withCredentials: true }
      );
    } catch (error) {
      // ROLLBACK TO PREVIOUS COMMENTS ON ERROR
      setComments(previousComments);
      console.error("Failed to Edit Reply!", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Failed to Edit Reply!");
    }
  };
  // PIN COMMENT HANDLER
  const pinComment = async (commentId) => {
    // SNAPSHOT OF PREVIOUS COMMENTS
    const previousComments = comments;
    // FINDING THE CURRENTLY PINNED COMMENT
    const currentlyPinned = comments.find((c) => c._id === commentId)?.pinned;
    // OPTIMISTICALLY PINNING OR UNPINNING COMMENT
    setComments((cm) =>
      cm.map((c) => ({
        ...c,
        pinned: currentlyPinned ? false : c._id === commentId,
      }))
    );
    // MAKING REQUEST
    try {
      const response = await axios.post(
        `${COMMENTS_API_ENDPOINT}/${commentId}/pin`,
        {},
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // GETTING PINNED COMMENT ID FROM THE SERVER RESPONSE
        const pinnedCommentId = response.data.pinnedCommentId;
        // SETTING THE COMMENTS WITH ACTUAL SERVER RESPONSE
        setComments((cm) =>
          cm.map((c) => ({ ...c, pinned: c._id === pinnedCommentId }))
        );
      }
    } catch (error) {
      // ROLLBACK TO PREVIOUS COMMENTS ON ERROR
      setComments(previousComments);
      console.error("Failed to Pin Comment!", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Failed to Pin Comment!");
    }
  };
  // PIN REPLY HANDLER
  const pinReply = async (parentId, replyId) => {
    // SNAPSHOT OF PREVIOUS COMMENTS
    const previousComments = comments;
    // FINDING THE PARENT COMMENT
    const parentComment = comments.find((c) => c._id === parentId);
    // FINDING THE CURRENTLY PINNED REPLY FOR THAT COMMENT
    const currentlyPinned = parentComment?.replies?.find(
      (r) => r._id === replyId
    )?.pinned;
    // OPTIMISTICALLY PERFORMING ACTION
    setComments((cm) =>
      cm.map((c) => {
        if (c._id !== parentId) return c;
        // TOGGLING PINNED FLAGS
        const newReplies = c.replies.map((r) => ({
          ...r,
          pinned: currentlyPinned ? false : r._id === replyId,
        }));
        // RE-ORDERING THE REPLIES WITH PINNED AT TOP
        newReplies.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        return { ...c, replies: reorderReplies(newReplies) };
      })
    );
    // MAKING REQUEST
    try {
      const response = await axios.post(
        `${COMMENTS_API_ENDPOINT}/${parentId}/reply/${replyId}/pin`,
        {},
        { withCredentials: true }
      );
      // IF RESPONSE SUCCESS
      if (response.data.success) {
        // GETTING THE PINNED REPLY ID FROM SERVER RESPONSE
        const newPinned = response.data.pinnedReplyId;
        // SETTING THE COMMENTS WITH ACTUAL SERVER RESPONSE
        setComments((cm) =>
          cm.map((c) => {
            if (c._id !== parentId) return c;
            // TOGGLING PINNED FLAGS
            const newReplies = c.replies.map((r) => ({
              ...r,
              pinned: r._id === newPinned,
            }));
            // RE-ORDERING THE REPLIES WITH PINNED AT TOP
            newReplies.sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            return { ...c, replies: reorderReplies(newReplies) };
          })
        );
      }
    } catch (error) {
      // ROLLBACK TO PREVIOUS COMMENTS ON ERROR
      setComments(previousComments);
      console.error("Failed to Perform Action", error);
      // TOASTING ERROR MESSAGE
      toast.error(error?.response?.data?.message || "Failed to Perform Action");
    }
  };
  // COMMENT ACTION TOGGLE HANDLER
  const toggleCommentAction = async (id, type) => {
    // SETTING URL BASED ON ACTION TYPE
    const url = `${COMMENTS_API_ENDPOINT}/${id}/${type}`;
    // SNAPSHOT OF PREVIOUS COMMENTS
    const previousComments = comments.map((c) => ({ ...c }));
    // OPTIMISTICALLY PERFORMING ACTION
    setComments((cm) =>
      cm.map((c) => {
        if (c._id !== id) return c;
        if (c.author._id === userId) return c;
        let likes = [...c.likes],
          dislikes = [...c.dislikes];
        if (type === "like") {
          dislikes = dislikes.filter((u) => u !== userId);
          likes.includes(userId)
            ? (likes = likes.filter((u) => u !== userId))
            : likes.push(userId);
        } else {
          likes = likes.filter((u) => u !== userId);
          dislikes.includes(userId)
            ? (dislikes = dislikes.filter((u) => u !== userId))
            : dislikes.push(userId);
        }
        return { ...c, likes, dislikes };
      })
    );
    // MAKING REQUEST
    try {
      await axios.post(url, {}, { withCredentials: true });
    } catch (error) {
      // ROLLBACK ON ERROR
      setComments(previousComments);
      console.error("Failed to Perform Action!", error);
      // TOASTING ERROR MESSAGE
      toast.error(
        error?.response?.data?.message || "Failed to Perform Action!"
      );
    }
  };
  // REPLY ACTION TOGGLER HANDLER
  const toggleReplyAction = async (commentId, replyId, type) => {
    // SETTING URL BASED ON ACTION TYPE
    const url = `${COMMENTS_API_ENDPOINT}/${commentId}/reply/${replyId}/${type}`;
    // SNAPSHOT OF PREVIOUS COMMENTS
    const previousComments = comments.map((c) => ({
      ...c,
      replies: c.replies.map((r) => ({ ...r })),
    }));
    // OPTIMISTICALLY PERFORMING ACTION
    setComments((cm) =>
      cm.map((c) => {
        if (c._id !== commentId) return c;
        return {
          ...c,
          replies: c.replies.map((r) => {
            if (r._id !== replyId) return r;
            if (r.author._id === userId) return r;
            let likes = [...r.likes],
              dislikes = [...r.dislikes];
            if (type === "like") {
              dislikes = dislikes.filter((u) => u !== userId);
              likes = likes.includes(userId)
                ? likes.filter((u) => u !== userId)
                : [...likes, userId];
            } else {
              likes = likes.filter((u) => u !== userId);
              dislikes = dislikes.includes(userId)
                ? dislikes.filter((u) => u !== userId)
                : [...dislikes, userId];
            }
            return { ...r, likes, dislikes };
          }),
        };
      })
    );
    // MAKING REQUEST
    try {
      await axios.post(url, {}, { withCredentials: true });
    } catch (error) {
      // ROLLBACK TO PREVIOUS COMMENTS ON ERROR
      setComments(previousComments);
      console.error("Failed to Perform Action!", error);
      // TOASTING ERROR MESSAGE
      toast.error(
        error?.response?.data?.message || "Failed to Perform Action!"
      );
    }
  };
  return (
    <>
      <section className="w-full pb-[2rem]">
        {/* HEADING */}
        <h2 className="flex items-center gap-[0.5rem] text-gray-500 font-[600] text-[1.5rem]">
          <MessageCircleMore size={30} />
          <span>Comments</span>
        </h2>
        {/* NEW COMMENT FORM */}
        <div className="relative mt-[0.5rem]">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
            placeholder="Post Comment ..."
            rows={3}
          />
          <button
            title="Post Comment"
            onClick={postComment}
            disabled={!draft.trim()}
            className="absolute outline-none border-none p-[0.325rem] rounded-full flex items-center justify-center bg-color-LB bottom-4 right-3 hover:bg-color-DB"
          >
            <SendHorizonal size={25} className="text-white" />
          </button>
        </div>
        {/* COMMENTS LIST */}
        {loading ? (
          <div className="flex items-center justify-center pt-4">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-4 text-gray-500">
            {error}
          </div>
        ) : comments.length === 0 ? (
          <div className="flex items-center justify-center pt-4 text-gray-500">
            No Comments yet. Be the Fist to Comment!
          </div>
        ) : (
          <ul className="w-full py-4 flex flex-col items-start justify-center gap-[0.5rem]">
            {orderedComments.map((c) => (
              <li
                key={c._id}
                className="bg-gray-200 rounded-md py-2 px-4 flex flex-col items-start justify-center w-full"
              >
                {/* COMMENT HEADER */}
                <div className="w-full flex items-center justify-between">
                  {/* AUTHOR NAME & AVATAR */}
                  <div className="flex items-center gap-[0.5rem]">
                    <Avatar className="w-[2rem] h-[2rem] rounded-full">
                      <AvatarImage
                        src={c?.author?.profile?.profilePhoto || AVATAR}
                        alt={c?.author?.fullName}
                        className="w-[2rem] h-[2rem] rounded-full"
                      />
                    </Avatar>
                    <span className="text-color-DB text-[1.1rem] flex items-center gap-2">
                      <span>{c?.author?.fullName}</span>
                      {c?.author._id === articleAuthorId && (
                        <span title="Article Author">
                          <Verified size={15} className="text-color-MAIN" />
                        </span>
                      )}
                    </span>
                  </div>
                  {/* CREATED DATE & PIN STATUS */}
                  <span className="text-gray-500 text-sm flex items-center gap-[0.5rem]">
                    {c.pinned && (
                      <span title="Pinned">
                        <Pin size={20} className="text-color-DB" />
                      </span>
                    )}
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                {/* COMMENT EDIT FORM & COMMENT CONTENT */}
                {editingCommentId === c._id ? (
                  <div className="w-full relative mt-[0.75rem]">
                    {/* EDIT COMMENT TEXT AREA */}
                    <textarea
                      value={commentDraft}
                      className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                      placeholder="Post Reply ..."
                      rows={2}
                      onChange={(e) => setCommentDraft(e.target.value)}
                    />
                    {/* SAVE BUTTON */}
                    <button
                      title="Save Changes"
                      onClick={() => editComment(c._id)}
                      disabled={!commentDraft.trim()}
                      className="absolute outline-none border-none p-[0.325rem] rounded-full flex items-center justify-center bg-color-LB bottom-4 right-3 hover:bg-color-DB"
                    >
                      <SendHorizonal size={20} className="text-white" />
                    </button>
                    {/* CANCEL BUTTON */}
                    <button
                      title="Cancel"
                      onClick={() => setEditingCommentId(null)}
                      className="absolute outline-none border-none p-[0.325rem] rounded-full flex items-center justify-center bg-color-LB bottom-4 right-14 hover:bg-color-DB"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500 text-[1.1rem] mt-[0.5rem]">
                    {c.content}
                  </span>
                )}
                {/* COMMENT ACTIONS */}
                {editingCommentId !== c._id && (
                  <div className="w-full flex items-center justify-end gap-[0.5rem]">
                    {/* LIKE COMMENT */}
                    <div className="flex items-center gap-[0.3rem]">
                      <button
                        onClick={() => toggleCommentAction(c._id, "like")}
                        title={c?.likes?.includes(userId) ? "Liked" : "Like"}
                        disabled={c.author._id === userId}
                        className={`${
                          c?.likes?.includes(userId)
                            ? "bg-color-DB hover:bg-color-LB"
                            : "hover:bg-color-DB bg-color-LB"
                        } rounded-full text-white p-1 border-none outline-none`}
                      >
                        <ThumbsUp size={18} />
                      </button>
                      <span className="text-gray-500 text-sm font-[600]">
                        {c?.likes?.length}
                      </span>
                    </div>
                    {/* DISLIKE COMMENT */}
                    <div className="flex items-center gap-[0.3rem]">
                      <button
                        onClick={() => toggleCommentAction(c._id, "dislike")}
                        title={
                          c?.dislikes?.includes(userId) ? "Disliked" : "Dislike"
                        }
                        disabled={c.author._id === userId}
                        className={`${
                          c?.dislikes?.includes(userId)
                            ? "bg-color-DB hover:bg-color-LB"
                            : "hover:bg-color-DB bg-color-LB"
                        } rounded-full text-white p-1 border-none outline-none`}
                      >
                        <ThumbsDown size={18} />
                      </button>
                      <span className="text-gray-500 text-sm font-[600]">
                        {c?.dislikes?.length}
                      </span>
                    </div>
                    {/* REPLY TO COMMENT */}
                    <button
                      onClick={() =>
                        setReplyingTo(replyingTo === c._id ? null : c._id)
                      }
                      title="Reply"
                      className="rounded-full bg-color-LB text-white hover:bg-color-DB p-1 border-none outline-none"
                    >
                      <Reply size={18} />
                    </button>
                    {/* PIN COMMENT */}
                    {isArticleAuthor && (
                      <button
                        onClick={() => pinComment(c._id)}
                        title={c.pinned ? "Unpin" : "Pin"}
                        className="rounded-full bg-color-LB text-white hover:bg-color-DB p-1 border-none outline-none"
                      >
                        {c.pinned ? <PinOff size={18} /> : <Pin size={18} />}
                      </button>
                    )}
                    {/* EDIT COMMENT */}
                    {editingCommentId !== c._id && c.author._id === userId && (
                      <button
                        onClick={() => {
                          setEditingCommentId(c._id);
                          setCommentDraft(c.content);
                        }}
                        title="Edit"
                        className="rounded-full bg-color-LB text-white hover:bg-color-DB p-1 border-none outline-none"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    {/* DELETE COMMENT */}
                    {(c.author._id === userId || isArticleAuthor) && (
                      <button
                        onClick={() => deleteComment(c._id)}
                        title="Delete"
                        className="rounded-full bg-color-LB text-white hover:bg-color-DB border-none outline-none p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}
                {/* REPLY FORM */}
                {replyingTo === c._id && (
                  <div className="w-full relative mt-[0.75rem]">
                    {/* REPLY TEXT AREA */}
                    <textarea
                      value={replyDraft[c._id] || ""}
                      className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                      placeholder="Post Reply ..."
                      rows={2}
                      onChange={(e) =>
                        setReplyDraft((d) => ({
                          ...d,
                          [c._id]: e.target.value,
                        }))
                      }
                    />
                    {/* SEND BUTTON */}
                    <button
                      title="Post Reply"
                      onClick={() => postReply(c._id)}
                      disabled={!replyDraft[c._id]?.trim()}
                      className="absolute outline-none border-none p-[0.325rem] rounded-full flex items-center justify-center bg-color-LB bottom-4 right-3 hover:bg-color-DB"
                    >
                      <SendHorizonal size={20} className="text-white" />
                    </button>
                    {/* CANCEL BUTTON */}
                    <button
                      title="Cancel"
                      onClick={() => setReplyingTo(null)}
                      className="absolute outline-none border-none p-[0.325rem] rounded-full flex items-center justify-center bg-color-LB bottom-4 right-14 hover:bg-color-DB"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                )}
                {/* MESSAGE REPLIES HEADING */}
                {c.replies.length > 0 && (
                  <h1
                    title={showReplies[c._id] ? "Hide Replies" : "Show Replies"}
                    onClick={() =>
                      setShowReplies((prev) => ({
                        ...prev,
                        [c._id]: !prev[c._id],
                      }))
                    }
                    className="pl-8 text-color-DB flex items-center gap-[0.5rem] text-[1.1rem] font-[600] cursor-pointer"
                  >
                    <ReplyAll size={25} />
                    <span>
                      {showReplies[c._id] ? "Hide Replies" : "Show Replies"}
                    </span>
                  </h1>
                )}
                {/* MESSAGE REPLIES LIST */}
                {c.replies.length > 0 && showReplies[c._id] && (
                  <ul className="w-full mt-1 space-y-3 pl-8 h-[200px] overflow-y-auto py-[1rem] pr-3">
                    {c.replies.map((r) => (
                      <li
                        key={r._id}
                        className="bg-gray-50 rounded-md py-2 px-4 flex flex-col items-start justify-center w-full"
                      >
                        {/* REPLY HEADER */}
                        <div className="w-full flex items-center justify-between">
                          {/* AUTHOR NAME & AVATAR */}
                          <div className="flex items-center gap-[0.5rem]">
                            <Avatar className="w-[2rem] h-[2rem] rounded-full">
                              <AvatarImage
                                src={r?.author?.profile?.profilePhoto || AVATAR}
                                alt={r?.author?.fullName}
                                className="w-[2rem] h-[2rem] rounded-full"
                              />
                            </Avatar>
                            <span className="text-color-DB text-[1.1rem]">
                              <span className="text-color-DB text-[1.1rem] flex items-center gap-2">
                                <span>{r?.author?.fullName}</span>
                                {r?.author._id === articleAuthorId && (
                                  <span title="Article Author">
                                    <Verified
                                      size={15}
                                      className="text-color-MAIN"
                                    />
                                  </span>
                                )}
                              </span>
                            </span>
                          </div>
                          {/* CREATED DATE & PIN STATUS */}
                          <span className="text-gray-500 text-sm flex items-center gap-2">
                            {r.pinned && (
                              <span title="Pinned">
                                <Pin size={20} className="text-color-DB" />
                              </span>
                            )}
                            <span>
                              {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        {/* REPLY EDIT FORM & REPLY CONTENT */}
                        {editingReplyId === r._id ? (
                          <div className="w-full relative mt-[0.75rem]">
                            {/* EDIT REPLY TEXT AREA */}
                            <textarea
                              value={editingReplyDraft}
                              className="w-full px-[1rem] py-[0.5rem] outline-none border-2 border-gray-100 rounded-md text-gray-500"
                              placeholder="Post Reply ..."
                              rows={2}
                              onChange={(e) =>
                                setEditingReplyDraft(e.target.value)
                              }
                            />
                            {/* SAVE BUTTON */}
                            <button
                              title="Save Changes"
                              onClick={() => editReply(c._id, r._id)}
                              disabled={!editingReplyDraft.trim()}
                              className="absolute outline-none border-none p-[0.325rem] rounded-full flex items-center justify-center bg-color-LB bottom-4 right-3 hover:bg-color-DB"
                            >
                              <SendHorizonal size={20} className="text-white" />
                            </button>
                            {/* CANCEL BUTTON */}
                            <button
                              title="Cancel"
                              onClick={() => setEditingReplyId(null)}
                              className="absolute outline-none border-none p-[0.325rem] rounded-full flex items-center justify-center bg-color-LB bottom-4 right-14 hover:bg-color-DB"
                            >
                              <X size={20} className="text-white" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-[1.1rem] mt-[0.5rem]">
                            {r.content}
                          </span>
                        )}
                        {/* REPLY ACTIONS */}
                        {editingReplyId !== r._id && (
                          <div className="w-full flex items-center justify-end gap-[0.5rem]">
                            {/* LIKE REPLY */}
                            <div className="flex items-center gap-[0.3rem]">
                              <button
                                onClick={() =>
                                  toggleReplyAction(c._id, r._id, "like")
                                }
                                title={
                                  r?.likes?.includes(userId) ? "Liked" : "Like"
                                }
                                disabled={r.author._id === userId}
                                className={`${
                                  r?.likes?.includes(userId)
                                    ? "bg-color-DB hover:bg-color-LB"
                                    : "hover:bg-color-DB bg-color-LB"
                                } rounded-full text-white p-1 border-none outline-none`}
                              >
                                <ThumbsUp size={18} />
                              </button>
                              <span className="text-gray-500 text-sm font-[600]">
                                {r?.likes?.length}
                              </span>
                            </div>
                            {/* DISLIKE REPLY */}
                            <div className="flex items-center gap-[0.3rem]">
                              <button
                                onClick={() =>
                                  toggleReplyAction(c._id, r._id, "dislike")
                                }
                                title={
                                  r?.dislikes?.includes(userId)
                                    ? "Disliked"
                                    : "Dislike"
                                }
                                disabled={r.author._id === userId}
                                className={`${
                                  r?.dislikes?.includes(userId)
                                    ? "bg-color-DB hover:bg-color-LB"
                                    : "hover:bg-color-DB bg-color-LB"
                                } rounded-full text-white p-1 border-none outline-none`}
                              >
                                <ThumbsDown size={18} />
                              </button>
                              <span className="text-gray-500 text-sm font-[600]">
                                {r?.dislikes?.length}
                              </span>
                            </div>
                            {/* EDIT REPLY */}
                            {editingReplyId !== r._id &&
                              r.author._id === userId && (
                                <button
                                  onClick={() => {
                                    setEditingReplyId(r._id);
                                    setEditingReplyDraft(r.content);
                                  }}
                                  title="Edit"
                                  className="rounded-full bg-color-LB text-white hover:bg-color-DB p-1 border-none outline-none"
                                >
                                  <Edit2 size={18} />
                                </button>
                              )}
                            {/* PIN REPLY */}
                            {c.author._id === userId && (
                              <button
                                onClick={() => pinReply(c._id, r._id)}
                                title={r.pinned ? "Unpin" : "Pin"}
                                className="rounded-full bg-color-LB text-white hover:bg-color-DB p-1 border-none outline-none"
                              >
                                {r.pinned ? (
                                  <PinOff size={18} />
                                ) : (
                                  <Pin size={18} />
                                )}
                              </button>
                            )}
                            {/* DELETE REPLY */}
                            {r.author._id === userId && (
                              <button
                                onClick={() => deleteReply(c._id, r._id)}
                                title="Delete"
                                className="rounded-full bg-color-LB hover:bg-color-DB p-1 border-none outline-none"
                              >
                                <Trash2 size={18} className="text-white" />
                              </button>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
        {/* PAGINATION */}
        {pages > 1 && (
          <section className="w-full flex items-center justify-center gap-[0.75rem] border-t-2 border-gray-100 pt-[1rem] mt-[1rem]">
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
              Page {page} of {pages}
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
    </>
  );
};

export default CommentsSection;
