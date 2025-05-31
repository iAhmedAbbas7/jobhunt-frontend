// <= IMPORTS =>
import { createSlice } from "@reduxjs/toolkit";

// <= SLICE =>
const articleSlice = createSlice({
  name: "article",
  initialState: {
    myArticles: [],
    allArticles: [],
    likedArticles: [],
    bookmarkedArticles: [],
    searchArticleByText: "",
  },
  reducers: {
    setMyArticles: (state, action) => {
      state.myArticles = action.payload;
    },
    addArticle: (state, action) => {
      state.myArticles.unshift(action.payload);
    },
    updateArticleInList: (state, action) => {
      const updated = action.payload;
      state.myArticles = state.myArticles.map((a) =>
        a._id === updated._id ? updated : a
      );
    },
    removeArticle: (state, action) => {
      state.myArticles = state.myArticles.filter(
        (a) => a._id !== action.payload
      );
    },
    setAllArticles: (state, action) => {
      state.allArticles = action.payload;
    },
    setLikedArticles: (state, action) => {
      state.likedArticles = action.payload;
    },
    setBookmarkedArticles: (state, action) => {
      state.bookmarkedArticles = action.payload;
    },
    setSearchArticleByText: (state, action) => {
      state.searchArticleByText = action.payload;
    },
  },
});

// <= EXPORTING SLICE ACTIONS =>
export const {
  setMyArticles,
  addArticle,
  updateArticleInList,
  removeArticle,
  setAllArticles,
  setLikedArticles,
  setBookmarkedArticles,
  setSearchArticleByText,
} = articleSlice.actions;

// <= EXPORTING AUTH SLICE =>
export default articleSlice.reducer;
