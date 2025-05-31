// <= IMPORTS =>
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import { useSelector } from "react-redux";
import Profile from "./components/Profile";
import MyChats from "./components/MyChats";
import Login from "./components/auth/Login";
import Redirect from "./components/Redirect";
import Articles from "./components/Articles";
import SignUp from "./components/auth/SignUp";
import SavedJobs from "./components/SavedJobs";
import PostJob from "./components/admin/PostJob";
import AppliedJobs from "./components/AppliedJobs";
import CompanyJobs from "./components/CompanyJobs";
import Companies from "./components/admin/Companies";
import AdminJobs from "./components/admin/AdminJobs";
import JobDetail from "./components/admin/JobDetail";
import AllCompanies from "./components/AllCompanies";
import UnAuthorized from "./components/UnAuthorized";
import UpdateJob from "./components/admin/UpdateJob";
import ChatRoomPage from "./components/ChatRoomPage";
import LikedArticles from "./components/LikedArticles";
import UpdateProfile from "./components/UpdateProfile";
import Applicants from "./components/admin/Applicants";
import MyArticles from "./components/admin/MyArticles";
import VerifyEmail from "./components/auth/VerifyEmail";
import JobDescription from "./components/JobDescription";
import ChangePassword from "./components/ChangePassword";
import ScrollToTop from "./components/shared/ScrollToTop";
import AdminProfile from "./components/admin/AdminProfile";
import CompanySetup from "./components/admin/CompanySetup";
import ResetPassword from "./components/auth/ResetPassword";
import TwoFactorAuth from "./components/auth/TwoFactorAuth";
import CompanyDetail from "./components/admin/CompanyDetail";
import CreateCompany from "./components/admin/CreateCompany";
import CreateArticle from "./components/admin/CreateArticle";
import ArticleDetail from "./components/admin/ArticleDetail";
import UpdateArticle from "./components/admin/UpdateArticle";
import ForgotPassword from "./components/auth/ForgotPassword";
import ReminderModal from "./components/shared/ReminderModal";
import JobsForCompany from "./components/admin/JobsForCompany";
import NotificationPanel from "./components/NotificationPanel";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import BookmarkedArticles from "./components/BookmarkedArticles";
import ArticleDescription from "./components/ArticleDescription";
import JobRecommendations from "./components/JobRecommendations";
import ChatRequestPage from "./components/admin/ChatRequestPage";
import CompanyDescription from "./components/CompanyDescription";
import MatchedApplicants from "./components/admin/MatchedApplicants";
import RequestEmailUpdate from "./components/auth/RequestEmailUpdate";
import StudentProtectedRoute from "./components/StudentProtectedRoute";
import FinalizeEmailUpdate from "./components/auth/FinalizeEmailUpdate";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import OnlineUsersListener from "./components/shared/OnlineUsersListener";
import DisableTwoFactorAuth from "./components/auth/DisableTwoFactorAuth";
import NotificationListener from "./components/shared/NotificationListener";
import ScrollToTopOnNavigation from "./components/shared/ScrollToTopOnNavigation";
import DeleteAccountVerification from "./components/auth/DeleteAccountVerification";
import ScrollRestorationDisabler from "./components/shared/ScrollRestorationDisabler";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";

// <= LAYOUT COMPONENT =>
const Layout = () => {
  // LOCATION
  const { pathname } = useLocation();
  // GETTING CURRENT USER CREDENTIALS
  const { user } = useSelector((store) => store.auth);
  // HIDING NOTIFICATION PANEL IN CHAT ROOM
  const isInChatRoom = pathname.startsWith("/chat/room");
  return (
    <>
      {/* BROWSER AUTO RESTORE SCROLL DISABLER */}
      <ScrollRestorationDisabler />
      {/* WHENEVER PATH CHANGES, FORCING SCROLL TO TOP */}
      <ScrollToTopOnNavigation />
      <Outlet />
      {/* NOTIFICATIONS PANEL */}
      {user && !isInChatRoom && <NotificationPanel />}
      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTop />
      {/* NEW MESSAGE NOTIFICATION LISTENER */}
      {user && <NotificationListener />}
      {/* ONLINE USERS LISTENER */}
      {user && <OnlineUsersListener />}
      {/* REMINDER MODAL */}
      {user && <ReminderModal />}
    </>
  );
};

// <= APP ROUTING =>
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // UNPROTECTED ROUTES
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/notifications",
        element: <NotificationPanel />,
      },
      {
        path: "/forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "/resetPassword",
        element: <ResetPassword />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/verifyEmail",
        element: <VerifyEmail />,
      },
      {
        path: "/redirect",
        element: <Redirect />,
      },
      {
        path: "/unauthorized",
        element: <UnAuthorized />,
      },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/browse",
        element: <Browse />,
      },
      // STUDENT PROTECTED ROUTES
      {
        path: "/companies",
        element: (
          <StudentProtectedRoute>
            <AllCompanies />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/jobs/description/:id",
        element: (
          <StudentProtectedRoute>
            <JobDescription />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/jobs/recommended",
        element: (
          <StudentProtectedRoute>
            <JobRecommendations />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/companies/description/:id",
        element: (
          <StudentProtectedRoute>
            <CompanyDescription />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/companies/:id/jobs",
        element: (
          <StudentProtectedRoute>
            <CompanyJobs />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <StudentProtectedRoute>
            <Profile />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/appliedJobs",
        element: (
          <StudentProtectedRoute>
            <AppliedJobs />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/savedJobs",
        element: (
          <StudentProtectedRoute>
            <SavedJobs />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/articles",
        element: (
          <StudentProtectedRoute>
            <Articles />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/articles/detail/:slug",
        element: (
          <StudentProtectedRoute>
            <ArticleDescription />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/articles/liked",
        element: (
          <StudentProtectedRoute>
            <LikedArticles />
          </StudentProtectedRoute>
        ),
      },
      {
        path: "/articles/bookmarked",
        element: (
          <StudentProtectedRoute>
            <BookmarkedArticles />
          </StudentProtectedRoute>
        ),
      },
      // COMMON ROUTES
      {
        path: "/changePassword",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/enable2FA",
        element: (
          <ProtectedRoute>
            <TwoFactorAuth />
          </ProtectedRoute>
        ),
      },
      {
        path: "/disable2FA",
        element: (
          <ProtectedRoute>
            <DisableTwoFactorAuth />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chats",
        element: (
          <ProtectedRoute>
            <MyChats />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chats/requests",
        element: (
          <ProtectedRoute>
            <ChatRequestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat/room/:id",
        element: (
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/deleteAccountVerification",
        element: (
          <ProtectedRoute>
            <DeleteAccountVerification />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/update",
        element: (
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/updateEmail",
        element: (
          <ProtectedRoute>
            <RequestEmailUpdate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/finalizeEmailUpdate",
        element: (
          <ProtectedRoute>
            <FinalizeEmailUpdate />
          </ProtectedRoute>
        ),
      },
      // ADMIN PROTECTED ROUTES
      {
        path: "/admin/profile",
        element: (
          <AdminProtectedRoute>
            <AdminProfile />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/companies",
        element: (
          <AdminProtectedRoute>
            <Companies />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/companies/create",
        element: (
          <AdminProtectedRoute>
            <CreateCompany />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/companies/:id",
        element: (
          <AdminProtectedRoute>
            <CompanySetup />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/companies/:id/detail",
        element: (
          <AdminProtectedRoute>
            <CompanyDetail />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/company/:id/jobs",
        element: (
          <AdminProtectedRoute>
            <JobsForCompany />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs",
        element: (
          <AdminProtectedRoute>
            <AdminJobs />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs/:id/detail",
        element: (
          <AdminProtectedRoute>
            <JobDetail />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs/create",
        element: (
          <AdminProtectedRoute>
            <PostJob />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs/:id",
        element: (
          <AdminProtectedRoute>
            <UpdateJob />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs/:id/applicants",
        element: (
          <AdminProtectedRoute>
            <Applicants />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/jobs/:id/bestMatchedApplicants",
        element: (
          <AdminProtectedRoute>
            <MatchedApplicants />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/articles",
        element: (
          <AdminProtectedRoute>
            <MyArticles />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/article/create",
        element: (
          <AdminProtectedRoute>
            <CreateArticle />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/articles/:slug",
        element: (
          <AdminProtectedRoute>
            <ArticleDetail />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "/admin/articles/:slug/update",
        element: (
          <AdminProtectedRoute>
            <UpdateArticle />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
