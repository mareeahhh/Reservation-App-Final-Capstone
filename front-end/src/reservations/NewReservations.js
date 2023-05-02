import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
// import ReservationForm from "./ReservationForm"


const initialFormData = {
    first_name:"",
    last_name:"",
    mobile_number:"",
    reservation_date:"",
    reservation_time:"",
    people:"1",
  };

function NewReservations({ date }){
    const history = useHistory();
    const [reservationError, setReservationError] = useState(null);
    const [reservation, setReservation] = useState(initialFormData);

    const changeHandler = (event) => {
        const {target} = event;
        setReservation({ ...reservation, [target.id]: target.value });
    }

    function submitHandler(event) {
  event.preventDefault();
  // const abortController = new AbortController();

  // const reservationForm = {
  //   ...formData,
  //   people: parseInt(formData.people),
  // };

  createReservation({
    ...reservation,
    people: Number(reservation.people),
  })

    // reservationForm, abortController.signal)
    .then(() => {
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    })
    .catch(
      setReservationError
    );
  }

  return (
    <div>
        <h1>New Reservation</h1>
        <ErrorAlert error={reservationError} />
        <form onSubmit={submitHandler}>
      <fieldset>
        <div >
          <label htmlFor="first_name">First Name</label>
          <input
            name="first_name"
            id="first_name"
            type="text"
            value={reservation.first_name}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="last_name">Last Name</label>
          <input
            name="last_name"
            id="last_name"
            type="text"
            value={reservation.last_name}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            name="mobile_number"
            id="mobile_number"
            type="telephone"
            pattern="[\d-]+"
            value={reservation.mobile_number}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            name="reservation_date"
            id="reservation_date"
            type="date"
            value={reservation.reservation_date}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            name="reservation_time"
            id="reservation_time"
            type="time"
            value={reservation.reservation_time}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="people">Number of People</label>
          <input
            name="people"
            id="people"
            type="number"
            min="1"
            value={reservation.people}
            onChange={changeHandler}
            ></input>
        </div>
      </fieldset>
      <button onClick={()=>history.goBack()}>
        Cancel
      </button>
      <button type="submit">
        Submit
      </button>
    </form>
    </div>
  )

};        


export default NewReservations;