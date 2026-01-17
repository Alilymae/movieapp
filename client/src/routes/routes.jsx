import HomePage from "../pages/Home/Home.jsx"
import PersonDetail from "../pages/PersonDetail/PersonDetail.jsx"
import FavoriteList from "../pages/FavoriteList/FavoriteList.jsx"
import MediaDetail from "../pages/MediaDetail/MediaDetail.jsx";
import MediaList from "../pages/MediaList/MediaList.jsx";
import MediaSearch from "../pages/MediaSearch/MediaSearch.jsx"
import PasswordUpdate from "../pages/PasswordUpdate/PasswordUpdate.jsx";
import ReviewList from "../pages/Reviews/ReviewList.jsx";
import BookingFlow from "../pages/BookingFlow/BookingFlow.jsx";
import ScheduleSelection from "../pages/ScheduleSelection/ScheduleSelection.jsx";
import ProtectedPage from "../components/ProtectedPage/ProtectedPage.jsx"

export const routesGen = {
    home: "/",
    mediaList: (type) => `/${type}`,
    mediaDetail: (type, id) => `/media/${type}/${id}`,
    mediaSearch: "/search",
    person: (id) => `/person/${id}`,
    favoriteList: "/favorites",
    reviewList: "/reviews",
    passwordUpdate: "/password-update",
    scheduleSelection: (mediaType, mediaId) => `/schedule/${mediaType}/${mediaId}`,
    booking: (scheduleId) => `/booking/${scheduleId}`
};

const routes = [
    {
        index: true,
        element: <HomePage />,
        state: "home"
    },
    {
        path: "/person/:personId",
        element: <PersonDetail />,
        state: "person.detail"
    },
    {
        path: "/media/:mediaType/:mediaId",
        element: <MediaDetail />,
        state: "media.detail"
    },
    {
        path: "/search",
        element: <MediaSearch />,
        state: "search"
    },
    {
        path: "/password-update",
        element: (
            <ProtectedPage>
                <PasswordUpdate />
            </ProtectedPage>
        ),
        state: "password.update"
    },
    {
        path: "/favorites",
        element: (
            <ProtectedPage>
                <FavoriteList />
            </ProtectedPage>
        ),
        state: "favorites"
    },
    {
        path: "/reviews",
        element: (
            <ProtectedPage>
                <ReviewList />
            </ProtectedPage>
        ),
        state: "reviews"
    },
    {
        path: "/schedule/:mediaType/:mediaId",
        element: (
            <ProtectedPage>
                <ScheduleSelection />
            </ProtectedPage>
        ),
        state: "schedule.selection"
    },
    {
        path: "/booking/:scheduleId",
        element: (
            <ProtectedPage>
                <BookingFlow />
            </ProtectedPage>
        ),
        state: "booking"
    },
    {
        path: "/:mediaType",
        element: <MediaList />,
        state: "media.list"
    }
];

export default routes