import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

import { useLocation } from "react-router-dom";
import SearchReservations from "../reservations/SearchReservations"
import Tables from "../tables/Tables";
import EditReservations from "../reservations/EditReservations";
import Reservation from "../reservations/Reservation";
import NewReservations from "../reservations/NewReservations";


/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function Routes() {
  const query = useQuery();

  return (
    <div>
      <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/search">
        <SearchReservations />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservations />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <Reservation />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservations />
      </Route>
      <Route exact={true} path="/tables/new">
        <Tables />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={query.get("date") || today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
    </div>
  );
}

export default Routes;
