import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm"


const initialFormData = {
    first_name:"",
    last_name:"",
    mobile_number:"",
    reservation_date:"",
    reservation_time:"",
    people:"",
  };

function NewReservations(){
    const history = useHistory();
    const [reservationError, setReservationError] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const changeHandler = (event) => {
        const {target} = event;
        setFormData({ ...formData, [target.id]: target.value });
    }

    function submitHandler(event) {
  event.preventDefault();
  const abortController = new AbortController();

  const reservationForm = {
    ...formData,
    people: parseInt(formData.people),
  };

  createReservation(reservationForm, abortController.signal)
    .then(() => {
      history.push(`/dashboard?date=${formData.reservation_date}`);
    })
    .catch((error) => {
      setReservationError(error);
    });
  }

  return (
    <div>
        <h1>New Reservation</h1>
        <ErrorAlert error={reservationError} />
        <ReservationForm 
            reservation={formData}
            changeHandler= {changeHandler}
            onSubmit={submitHandler}
        />
    </div>
  )

};        


export default NewReservations;