/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { request } = require("express");

async function reservationExist(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationsService.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } 
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
}

function checkData(req, res, next) {
    // console.log("HALP", req.body.data)
    if (req.body.data) {
      return next();
    }
    next({
      status: 400,
      message: "Body must have data property."
    });
  }   

  function checkProperties(req, res, next) {
    const firstName = req.body.data.first_name;
    const lastName = req.body.data.last_name;
    const phone = req.body.data.mobile_number;
    const date = req.body.data.reservation_date;

    if (!firstName) {
        return next({
          status: 400,
          message: "first_name property required.",
        })
    }
    if (!lastName) {
        return next({
          status: 400,
          message: "last_name property required.",
        })
    }
    if (!phone) {
        return next({
          status: 400,
          message: "mobile_number property required.",
        })
    }
    if (!date) {
        return next({
          status: 400,
          message: "reservation_date property required.",
        })
    }
    return next();
  }

  function checkStatus(req, res, next) {
    const status = req.body.data.status;
    // console.log("status", status)
    if (status === "seated" || status === "finished") {
      return next({
        status: 400,
        message: "Status cannot be seated or finished.",
      })
    }
    next();
}

function checkStatusUnknown(req, res, next) {
  const status = req.body.data.status;

  if (status === "unknown") {
    return next({
      status: 400,
      message: "Status cannot be unknown.",
    })
  }
  next();
}

function resStatus(req,res,next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "reservation status cannot be finished.",
    })
  }
  next();
}
  
  function checkTime(req, res, next) {
    const { data = {} } = req.body;
    const time = data["reservation_time"];
  
    if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(time)) {
      next({
        status: 400,
        message: "Invalid reservation_time",
      });
    }
  
    const hours = Number(time.split(":")[0]);
    const minutes = Number(time.split(":")[1]);
    if (hours < 10 || (hours === 10 && minutes < 30)) {
      next({
        status: 400,
        message: "Reservation must be after 10:30AM.",
      });
    }
    if (hours > 21 || (hours === 21 && minutes > 30)) {
      next({
        status: 400,
        message: "Reservation cannot be after 9:30PM.",
      });
    }
    next();
  }

  function checkPartySize(req, res, next) {
    const { data = {} } = req.body;
  
    if (data["people"] === 0 || !Number.isInteger(data["people"])) {
      return next({
        status: 400,
        message: "Reservation must have at least 1 people.",
      });
    }
    next();
  }
  
  function checkDate(req, res, next) {
   const date = req.body.data.reservation_date;
   const time = req.body.data.reservation_time;
   const weekdays = new Date(date).getUTCDay();
   const validDate = Date.parse(date);
   const formattedDate = new Date(`${date}T${time}`);
// console.log("HALP", formattedDate)
   if ( weekdays == 2){
       return next({
        status: 400,
        message: "Restaurant closed on Tuesday"
       });
    }
    if (!validDate){
        return next({
        status: 400,
        message: "reservation_date must be valid"
        });
    }
    if (formattedDate <= new Date()){
        return next({
        status: 400,
        message: "Reservation must be in the future"
        });
    }
    next();
  }


async function list(req, res) {
    const date = req.query.date;
    const mobile_number = req.query.mobile_number;
    const data = await (date ? reservationsService.listDate(date) : reservationsService.search(mobile_number));
    res.json({ data });
  }

async function read(req, res) {
    const data = res.locals.reservation;
    res.json({ data });
}
  
async function create(req, res) {
    const data = await reservationsService.create(req.body.data);
    res.status(201).json({ data });
}

async function update(req, res,){
    const reservation = req.body.data;
    // console.log()
    const updatedRes = await reservationsService.update(reservation);
    const result = updatedRes[0];
    console.log("editSuccessful", result)
    res.status(200).json({ data: result });
  }
  
  async function updateStatus(req, res) {
    const status = req.body.data.status;
    // console.log("STAT", status)
    const reservation = res.locals.reservation;
    // console.log("RESY", reservation)
    
    let updated = await reservationsService.updateStatus(reservation.reservation_id, status);
    // console.log("UPDTD", updated)
    res.status(200).json({ data: {status: updated[0].status} })
  }
  

  module.exports={
    list: asyncErrorBoundary(list),
    create: [
      checkData,
      checkProperties,
      checkDate,
      checkTime,
      checkPartySize,
      checkStatus,
      asyncErrorBoundary(create)],
    update: [ 
      reservationExist, 
      checkProperties,
      checkDate,
      checkTime,
      checkPartySize,
      checkStatus,
      asyncErrorBoundary(update) 
    ], 
    read: [ asyncErrorBoundary(reservationExist), asyncErrorBoundary(read) ],
    updateStatus: [ 
      asyncErrorBoundary(reservationExist),
      resStatus,
      checkStatusUnknown,
      asyncErrorBoundary(updateStatus)
     ],
    reservationExist,
  }