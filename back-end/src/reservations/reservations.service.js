const knex = require("../db/connection.js");


function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .then((result) => result[0]);
}

function list() {
    return knex('reservations')
      .select('*')
      .whereNot({ status: "finished"})
      .andWhereNot({ status: "cancelled"})
      .orderBy('reservation_time');
  }

function listDate(reservation_date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      .whereNot({ status: "finished" })
      .orderBy("reservation_time");
}
  
  function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
}

  function create(newReservation) {
    return knex("reservations")
      .insert({
        ...newReservation,
        "status": "booked"
        })
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
  }

async function update(reservation) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;
  return knex('reservations')
    .where({ reservation_id })
    .update({
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
    }, [
      'first_name',
      'last_name',
      'mobile_number',
      'people',
      'reservation_date',
      'reservation_time',
    ])
}
async function cancelReservation(reservationId) {
  // Retrieve the reservation record from the database
  const reservation = await knex('reservations')
    .where({ reservation_id: reservationId })
    .first();
  
  // Update the reservation status to "cancelled"
  reservation.status = 'cancelled';
  
  // Save the updated reservation record back to the database
  await knex('reservations')
    .where({ reservation_id: reservationId })
    .update(reservation);
    
  return reservation;
}

  
  function updateStatus(reservation_id, status) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id })
      .update({ status: status }, "*")
  }

module.exports={
    listDate, 
    search,
    read,
    create,
    update,
    cancelReservation,
    updateStatus,
}
