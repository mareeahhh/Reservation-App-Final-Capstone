import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

const initialFormData = {
    table_name:"",
    capacity:"",
  };

function Tables(){
    const [reservationError, setReservationError] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const history = useHistory();
    
    const changeHandler = (e) => {
        const { target } = e;
        setFormData({ ...formData, [target.id]: target.value });
      };
    
      async function onSubmit(e) {
        e.preventDefault();
        const abortController = new AbortController();
        try {
          await createTable(
            {
              ...formData,
              capacity: parseInt(formData.capacity),
            },
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
    
      return (
        <div>
          <h1>New Table</h1>
          <ErrorAlert error={reservationError} />
          <form onSubmit={onSubmit}>
            <fieldset>
              <div>
                <label htmlFor="table_name">Table Name</label>
                <input
                  name="table_name"
                  id="table_name"
                  type="text"
                  minLength="2"
                  value={formData.table_name}
                  onChange={changeHandler}></input>
              </div>
    
              <div className="pb-1">
                <label htmlFor="capacity">Capacity</label>
                <input
                  name="capacity"
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={changeHandler}></input>
              </div>
            </fieldset>
            <button onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">
              Submit
            </button>
          </form>
        </div>
      );
    }
    
    export default Tables;