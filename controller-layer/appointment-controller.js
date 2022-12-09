const express = require("express");
const errorHelper = require("../helpers/errors-helper");
const AppointmentModel = require("../models/appointments/appointment-model");
const AppointmentAvailableModel = require("../models/appointments/appointments-available-model");
const appointmentLogic = require("../business-logic-layer/appointment-logic");
const appointmentAvailableLogic = require("../business-logic-layer/available-appointments-logic");
const verifyIsAdmin = require("../middleware/verify-isAdmin");
const verifyIsLoggedIn = require("../middleware/verify-logged-in");

const router = express.Router();

router.post("/get-monthly-appointments", verifyIsLoggedIn, async (request, response) => {
    try {
        const { date } = request.body;
        const appointments = await appointmentLogic.getMonthlyAppointmentsAsync(date);
        response.json(appointments);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/get-appointments-by-user", verifyIsLoggedIn, async (request, response) => {
    try {
        const { userId } = request.body;
        const appointments = await appointmentLogic.getAllAppointmentsByUserAsync(userId);
        response.json(appointments);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/get-appointments-awaiting-approval", verifyIsAdmin, async (request, response) => {
    try {
        const appointmentsAwaitingApproval = await appointmentLogic.getAllAppointmentsAwaitingApprovalAsync();
        response.json(appointmentsAwaitingApproval);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/get-appointments-today", verifyIsAdmin, async (request, response) => {
    try {
        const appointmentsToday = await appointmentLogic.getAllAppointmentsTodayAsync();
        response.json(appointmentsToday);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/get-sum-between-date", verifyIsAdmin, async (request, response) => {
    try {
        const date = request.body;
        const sum = await appointmentLogic.getSumOfOrdersBetweenDatesAsync(date.fromTime, date.toTime, {});
        response.json(sum);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-appointment", verifyIsAdmin, async (request, response) => {
    try {
        const appointment = new AppointmentModel(request.body);
        const error = appointment.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const addedAppointment = await appointmentLogic.addAppointmentAsync(appointment);
        response.status(201).json(addedAppointment);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/approve-appointments", verifyIsAdmin, async (request, response) => {
    try {
        const appointmentsToApprove = request.body;
        let errorMessage = null;
        appointmentsToApprove.forEach((item) => {
            if (item._id == undefined) {
                errorMessage = `Missing id`;
                return;
            }
            const appointment = new AppointmentModel(item);
            const error = appointment.validateSync();
            if (error) {
                errorMessage = `Id: ${appointment._id} - ${error.message}`;
                return;
            }
        })
        if (errorMessage) return response.status(400).send(errorMessage);
        const approvedAppointment = await appointmentLogic.approveAwaitingAppointmentAsync(appointmentsToApprove);
        response.status(201).json(approvedAppointment);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/update-appointment", verifyIsAdmin, async (request, response) => {
    try {
        const appointment = new AppointmentModel(request.body);
        const error = appointment.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const updatedAppointment = await appointmentLogic.updateAppointmentAsync(appointment);
        if (!updatedAppointment) return response.status(404).send(errorHelper.getError('Appointment has not found please try again'));
        response.status(201).json(updatedAppointment);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/delete-appointment", verifyIsAdmin, async (request, response) => {
    try {
        const appointment = request.body;
        await appointmentLogic.deleteAppointmentAsync(appointment);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

// Appointments available

router.post("/get-all-appointments-available", verifyIsLoggedIn, async (request, response) => {
    try {
        const appointmentAvailable = await appointmentAvailableLogic.getAllAppointmentAvailableAsync();
        response.json(appointmentAvailable);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-appointment-available", verifyIsAdmin, async (request, response) => {
    try {
        const appointmentAvailable = new AppointmentAvailableModel(request.body);
        const error = appointmentAvailable.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const appointmentAvailableAdded = await appointmentAvailableLogic.addAppointmentAvailableAsync(appointmentAvailable);
        response.status(201).json(appointmentAvailableAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/add-appointments-available-by-range", verifyIsAdmin, async (request, response) => {
    try {
        const { date, timeStart, timeEnd, duration } = request.body;
        const appointmentAvailableListAdded = await appointmentAvailableLogic.onAddAppointmentAvailableByRangeAsync(date, timeStart, timeEnd, duration);
        if (typeof appointmentAvailableListAdded === 'string') return response.status(404).send(appointmentAvailableListAdded);
        response.json(appointmentAvailableListAdded);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/update-appointment-available", verifyIsAdmin, async (request, response) => {
    try {
        const appointmentAvailable = new AppointmentAvailableModel(request.body);
        const error = appointmentAvailable.validateSync();
        if (error) return response.status(400).send(errorHelper.getError(error));
        const appointmentAvailableUpdated = await appointmentAvailableLogic.updateAppointmentAvailableAsync(appointmentAvailable);
        if (!appointmentAvailableUpdated) return response.status(404).send(errorHelper.getError('Appointment available has not found please try again'));
        response.status(201).json(appointmentAvailableUpdated);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

router.post("/delete-appointment-available", verifyIsAdmin, async (request, response) => {
    try {
        const appointmentAvailable = request.body;
        await appointmentAvailableLogic.deleteAppointmentAvailableAsync(appointmentAvailable);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(errorHelper.getError(err));
    }
});

module.exports = router;