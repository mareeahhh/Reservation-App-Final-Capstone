import React from "react";
import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { searchReservations } from "../utils/api";
import ListReservations from "./ListReservations";


const initialFormData = {
  mobile_number:"",
};

function SearchReservation() {
  const [searchForm, setSearchForm] = useState(initialFormData);
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      const result = await searchReservations(
        searchForm.mobile_number,
        abortController.signal,
      );
      setReservations(result);
    } catch (error) {
      setError(error);
    }
  }

  const changeHandler = (e) => {
    const { target } = e;
    setSearchForm({ ...searchForm, [target.id]: target.value });
  };

  return (
    <div>
      <h1>Search by Phone Number</h1>
      <form onSubmit={onSubmit}>
        <ErrorAlert error={error} />

        <label htmlFor="mobile_number">Mobile Number</label>
        <input
          name="mobile_number"
          id="mobile_number"
          placeholder="Enter phone number"
          required
          value={searchForm.mobile_number}
          onChange={changeHandler}
        ></input>
        <button type="submit">
          Find
        </button>
      </form>
      {reservations !== null && reservations.length === 0 && (
        <div>No reservations found</div>
      )}
      {reservations !== null && reservations.length > 0 && (
        <ListReservations reservations={reservations} />
      )}
    </div>
  );
}

export default SearchReservation;