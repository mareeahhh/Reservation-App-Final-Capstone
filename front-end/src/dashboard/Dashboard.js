import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import ListReservations from "../reservations/ListReservations";
import SeatTable from "../tables/SeatTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setReservations([]);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function todayButton() {
    history.push(`/dashboard?date=${today()}`);
  }

  function previousDayButton() {
    history.push(`/dashboard?date=${previous(date)}`);
  }

  function nextDayButton() {
    history.push(`/dashboard?date=${next(date)}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="mb-3">
        <button onClick={previousDayButton}>
          Previous Date
        </button>
        <button onClick={todayButton}>
          Today
        </button>
        <button onClick={nextDayButton}>
          Next Date
        </button>
      </div>
      <ListReservations reservations={reservations} />
      <ErrorAlert error={reservationsError} />
      <SeatTable />
    </main>
  );
}

export default Dashboard;