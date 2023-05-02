import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, setTableOccupied } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

const initialFormData = {
  table_id:"",
};

function Reservation(){
    const [tables, setTables] = useState([]);
    const [reservationError, setReservationError] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const { reservationId } = useParams();
    const history = useHistory();
    useEffect(loadTables, []);

    const changeHandler = (e) => {
        const {target} = e;
        setFormData({ ...formData, [target.id]: target.value });
    }

    function loadTables(){
        const abortController = new AbortController();
        setReservationError(null);
        listTables(abortController.signal)
        .then(setTables)
        .catch(setReservationError)
        return () => abortController.abort()
    }
    
    async function submitHandler(e) {
        e.preventDefault();
        const abortController = new AbortController();

    try {
      await setTableOccupied(
        formData.table_id,
        reservationId,
        abortController.signal
      )
      history.push(`/dashboard`);
    } catch (error) {
        setReservationError(error);
        }
    }

    function onCancel() {
        history.goBack();
    }

    return(
        <div>
      <h1>Seat Reservation</h1>
      <ErrorAlert error={reservationError} />
      <form onSubmit={submitHandler}>
        <label htmlFor="table_id">Table</label>
        <select
          name="table_id"
          id="table_id"
          value={formData.table_id}
          onChange={changeHandler}
          >
          <option value="" disabled>
            Select a table
          </option>
          {tables.map((table) => (
            <option 
                value={table.table_id} 
                key={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <button type="submit">
          Submit
        </button>
        <button onCancel={onCancel}>
          Cancel
        </button>
      </form>
    </div>
    )
}

export default Reservation;