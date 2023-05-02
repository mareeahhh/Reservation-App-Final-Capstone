
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

const initialFormData = {
    first_name:"",
    last_name:"",
    mobile_number:"",
    reservation_date:"",
    reservation_time:"",
    people:"",
  };

  function EditReservations(){
    const {reservation_id} = useParams();
    const [reservationError, setReservationError] = useState();
    const [formData, setFormData] = useState(initialFormData);
    const history = useHistory();

    useEffect(() => {
        async function loadReservationData() {
            const abortController = new AbortController();
            setReservationError(null);
            try {
                const res = await readReservation(
                    reservation_id,
                    abortController.signal,
                )
                setFormData({
                    first_name: res.first_name,
                    last_name: res.last_name,
                    mobile_number: res.mobile_number,
                    reservation_date: res.reservation_date,
                    reservation_time: res.reservation_time,
                    people: res.people,
                });
            } catch (error) {
                setReservationError(error);
            }
            return () => abortController.abort();
        }
        loadReservationData()
    }, [reservation_id]);

    const changeHandler = (e) => {
        const {target} = e;
        setFormData({ ...formData, [target.id]: target.value });

    };

    async function onSubmit(event) {
      event.preventDefault();
      const abortController = new AbortController();
      try {
        await updateReservation(
          {
            ...formData,
            people: parseInt(formData.people),
          },
          reservation_id,
          abortController.signal,
        );
        history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        setReservationError(error);
      }
    }
  
    return (
      <div>
        <h1>Edit Reservation</h1>
        <ErrorAlert error={reservationError} />
        <ReservationForm
          reservation={formData}
          handleChange={changeHandler}
          onSubmit={onSubmit}
        />
      </div>
    );
  }

  export default EditReservations;
  