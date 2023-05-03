
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

  function EditReservations() { 
    const {reservation_id} = useParams();
      const [currentRes, setCurrentRes] = useState({ reservation_id });
      const [reservationError, setReservationError] = useState(null);
      const history = useHistory();

      useEffect(() => {
        readReservation(reservation_id)
        .then((response) => {
          setCurrentRes({
            ...response,
            people: Number(response.people),
            reservation_time: response.reservation_time.substring(0,response.reservation_time.length-3)
          })
        })
        .catch(setReservationError);
      }, [reservation_id]);

      const changeHandler = ({ target }) => {
        setCurrentRes({
          ...currentRes,
          [target.name]: target.value,
        })
      };
    
      const submitHandler = (event) => {
        event.preventDefault();
        // console.log("Submitted:", currentRes);
        updateReservation({
          ...currentRes,
          people: Number(currentRes.people),
        })
        .then((response) =>{
        setCurrentRes({ ...response })
        history.push(`/dashboard?date=${currentRes.reservation_date}`)
        })
        .catch(setReservationError)
      };
    
    
    return (
      <div>
        <h1>Edit Reservation</h1>
        <ErrorAlert error={reservationError} />
        <form onSubmit={submitHandler}>
      <fieldset>
        <div >
          <label htmlFor="first_name">First Name</label>
          <input
            name="first_name"
            id="first_name"
            type="text"
            required={true}
            value={currentRes.first_name}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="last_name">Last Name</label>
          <input
            name="last_name"
            id="last_name"
            type="text"
            required={true}
            value={currentRes.last_name}
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
            required={true}
            value={currentRes.mobile_number}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            name="reservation_date"
            id="reservation_date"
            type="date"
            required={true}
            value={currentRes.reservation_date}
            onChange={changeHandler}
            ></input>
        </div>
        <div >
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            name="reservation_time"
            id="reservation_time"
            type="time"
            required={true}
            value={currentRes.reservation_time}
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
            required={true}
            value={currentRes.people}
            onChange={changeHandler}
            ></input>
        </div>
      </fieldset>
      <button type="button" onClick={() => history.goBack()}> Cancel </button>
        <button type="submit"> Submit Edit </button>
    </form>
      </div>
    );
  }

  export default EditReservations;