import React, { useState } from "react";
import { listTables, updateStatus } from "../utils/api"
import { useHistory, Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function ListReservations({ reservations }){
    const history = useHistory()
    const [reservationsError, setReservationsError] = useState(null)
    

    const onCancel = async (reservation_id) => {
        if (window.confirm("Are you sure you want to cancel this reservation? This cannot be undone")) {
            await updateStatus({status: "cancelled"},reservation_id,)
            .then(() => {
              listTables()
              history.push("/dashboard")
            })
            .catch(setReservationsError)
        }
    };

    // const onCancel = (event) => {
    //   event.preventDefault();
    //   setReservationsError(null);
    //   if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
    //     updateStatus({status: "cancelled"}, reservation_id)
    //     .then(() => {
    //       listTables()
    //       history.push("/dashboard");
    //     })
    //     .catch(setReservationsError)
    //   }
    // }
    
    return (
        <div>
              <ErrorAlert error={reservationsError} />
          <div>
            <h4>Reservations</h4>
          </div>
          <div>
            {reservations.map((reservation) => {
              return (
                <div key={reservation.reservation_id}>
                  <table>
                    <tbody>
                      <tr>
                        <th>First Name</th>
                        <td>{reservation.first_name}</td>
                      </tr>
                      <tr>
                        <th>Last Name</th>
                        <td>{reservation.last_name}</td>
                      </tr>
                      <tr>
                        <th>Mobile Number</th>
                        <td>{reservation.mobile_number}</td>
                      </tr>
                      <tr>
                        <th>Reservation Date</th>
                        <td>{reservation.reservation_date}</td>
                      </tr>
                      <tr>
                        <th>Reservation Time</th>
                        <td>{reservation.reservation_time}</td>
                      </tr>
                      <tr>
                        <th># of People</th>
                        <td>{reservation.people}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <div
                            reservationIdStatus={reservation.reservation_id}>
                            {reservation.status}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
    
                  <div>
                    {reservation.status === "booked" && (
                      <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                        <button>Seat</button>
                      </Link>
                      )}
                    {reservation.status === "booked" && (
                    <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                      <button>Edit</button>
                    </Link>
                    )}
                    {reservation.status !== "cancelled" && (
                      <button
                      data-reservation-id-cancel={reservation.reservation_id}
                        onClick={() => onCancel(reservation.reservation_id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    export default ListReservations;    