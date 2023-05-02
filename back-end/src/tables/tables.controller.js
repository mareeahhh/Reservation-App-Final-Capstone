const tablesService = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsController = require("../reservations/reservations.controller");


async function tableExist(req, res, next) {
  const table_id = req.params.table_id;
  const table = await tablesService.readTable(table_id);
//   console.log("HALPPP", table)
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${table_id} cannot be found.` });
}

function reservationIdExist(req, res, next){
    const reservation_id =req.body.data.reservation_id;
    // console.log("HALPPP", reservation_id)
  if (reservation_id){
    return next();
  }
  return next ({
    status: 400,
    message: "need reservation_id"
  })
}

async function reservationExist(req, res, next){
    const reservation = await tablesService.readRes(req.body.data.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    // console.log("RESY", reservation)
    return next();
  }
  next({
    status: 404,
    message: `${req.body.data.reservation_id} does not exist`,
  })
}

function checkData(req, res, next) {
    if (req.body.data) {
      return next();
    }
    next({
      status: 400,
      message: "Body must have a data property.",
    })
}

function checkName(req, res, next) {
    const tableName = req.body.data.table_name;
    // console.log("TN", tableName)

    if (!tableName){
        return next({
            status: 400,
            message: `Check table_name`,
          }); 
    }
    if (tableName.length < 2) {
      return next({
        status: 400,
        message: `Check table_name length`,
      });
    }
    next();
  }

  function checkCapacity(req, res, next) {
    const capacity = req.body.data.capacity;
    // console.log("C", capacity)
  
    if (!Number.isInteger(capacity)) {
        return next({
          status: 400,
          message: `capacity must be a real number`,
        });
      }
    if (capacity < 1) {
      return next({
        status: 400,
        message: `Check capacity`,
      });
    }
    next();
  }

function checkTableCapacity(req, res, next) {
    const {reservation, table } = res.locals;
//   console.log("PP", reservation)
//   console.log("CC", table)
// console.log("TC", table.capacity)
// console.log("PS", reservation.people)

  if (table.capacity < reservation.people) {
     next({
      status: 400,
      message: `Table capacity does not meet party size`,
    });
  }
  return next();
}

function openTable(req, res, next) {
    const table = res.locals.table
    // console.log("HALPP", res.locals.table.occupied)
    if (table.reservation_id) {
      return next({
        status: 400,
        message: `Table is occupied`,
      });
    }
    next();
  }

  function occupiedTable(req, res, next) {
    const table = res.locals.table
    const tableStatus = table.table_status
    // console.log("HALP", tableStatus)
    if (tableStatus === 'occupied') {
        return next(); 
    }
    return next({
        status: 400,
        message: `table_id is not occupied`,
      });
  }
    
  async function seatedRes(req, res, next) {
    const seated = await tablesService.readTableRes(req.body.data.reservation_id)
    if (seated) {
      return next({
        status: 400,
        message: `reservation_id is already seated`,
      });
    }
    next();
  }
  
async function list(req, res) {
    const data = await tablesService.list();
    res.json({ data });
  }
  
async function create(req, res) {
    const data = await tablesService.create(req.body.data);
    res.status(201).json({ data });
}
  
async function update(req, res) {
    const { reservation, table } = res.locals;
    const data = await tablesService.update(reservation.reservation_id, table.table_id);
    //   console.log("HALPP", data)
    res.status(200).json({ data });
}
  
async function destroy(req, res) {
  const table = res.locals.table;
//   console.log("TABLE", table)
  await tablesService.finished(table.table_id, table.reservation_id);
  const data = await tablesService.list();
//   console.log("HALPP", data)
  res.status(200).json({ data });
}

module.exports={
    list: asyncErrorBoundary(list),
    create: [
        checkData,
        checkName,
        checkCapacity,
        asyncErrorBoundary(create)
    ],
    update: [
        checkData,
        reservationIdExist,
        asyncErrorBoundary(tableExist),
        asyncErrorBoundary(reservationExist),
        openTable,
        checkTableCapacity,
        asyncErrorBoundary(seatedRes),
        asyncErrorBoundary(update),
    ],
    delete:[
        asyncErrorBoundary(tableExist),
        occupiedTable,
        asyncErrorBoundary(destroy),
    ],
}