const knex = require("../db/connection.js");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}
function read(table_id) {
    return knex("tables as t")
      .leftJoin("reservations as r", "r.reservation_id", "t.reservation_id")
      .select(
        "t.table_id",
        "t.table_name",
        "t.capacity",
        "t.reservation_id",
        "r.first_name",
        "r.last_name",
        "r.mobile_number",
        "r.reservation_date",
        "r.reservation_time",
        "r.people",
        "r.status",
        "r.created_at as reservation_created",
        "r.updated_at as reservation_updated"
      )
      .where({ table_id })
      .then((result) => result[0]);
  }

  function readTableRes(reservation_id) {
    return knex("tables")
      .where({ reservation_id })
      .whereExists(knex.select("*").from("tables").where({ reservation_id }))
      .then((result) => result[0]);
  }

function readTable(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function readRes(reservation_id){
    return knex("reservations")
    .select('*')
    .where({ reservation_id })
    .first();
}

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function update(reservation_id, table_id) {
  const trx = await knex.transaction();
    // console.log("HALPP", trx)
  return trx("tables")
    .where({ table_id })
    .update({ 
      reservation_id: reservation_id,
      table_status: "occupied",
    }, "*")
    .then(() => 
      trx("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
    )
    .then(trx.commit)
    .catch(trx.rollback);
}

  async function finished( table_id, reservation_id) {
    const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id })
    .update({
      reservation_id: null,
      table_status: "free",
    }, "*")
    .then(() => 
      trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" }, "*")
    )
    .then(trx.commit)
    .catch(trx.rollback)
  }

module.exports={
    list,
    read,
    readTableRes,
    readTable,
    readRes,
    create,
    update,
    finished,
}