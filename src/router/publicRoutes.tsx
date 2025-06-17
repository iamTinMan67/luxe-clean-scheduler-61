
import { RouteObject } from "react-router-dom";
import { RouteLayout } from "./routeLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Booking from "@/pages/Booking";
import SimpleBooking from "@/pages/SimpleBooking";
import ServicePackage from "@/pages/ServicePackage";
import Feedback from "@/pages/Feedback";
import Gallery from "@/pages/Gallery";
import Progress from "@/pages/Progress";
import TrackBooking from "@/pages/TrackBooking";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RouteLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/booking",
        element: <Booking />,
      },
      {
        path: "/simple-booking",
        element: <SimpleBooking />,
      },
      {
        path: "/services",
        element: <ServicePackage />,
      },
      {
        path: "/feedback",
        element: <Feedback />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/progress",
        element: <Progress />,
      },
      // Route for TrackBooking without bookingId
      {
        path: "/track",
        element: <TrackBooking />,
      },
      // Route for TrackBooking with bookingId
      {
        path: "/track/:bookingId",
        element: <TrackBooking />,
      },
    ],
  },
];

export default publicRoutes;
