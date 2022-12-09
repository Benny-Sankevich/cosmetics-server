global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const cors = require("cors");
const path = require("path");
const imageUpload = require("express-fileupload");

const authController = require("./controller-layer/auth-controller");
const treatmentController = require("./controller-layer/treatment-controller");
const generalController = require("./controller-layer/general-controller");
const appointmentController = require("./controller-layer/appointment-controller");
const supplierController = require("./controller-layer/supplier-controller");
const productController = require("./controller-layer/product-controller");
const purchaseController = require("./controller-layer/purchase-controller");
const reportsController = require("./controller-layer/reports-controller");
const userController = require("./controller-layer/user-controller");
const summariesController = require("./controller-layer/summaries-controller");
const taskController = require("./controller-layer/task-controller");

const server = express();
server.use(cors());
server.use(imageUpload());
server.use(express.json());

server.use("/api/auth", authController);
server.use("/api/users", userController);
server.use("/api/treatments", treatmentController);
server.use("/api/general", generalController);
server.use("/api/appointments", appointmentController);
server.use("/api/suppliers", supplierController);
server.use("/api/products", productController);
server.use("/api/purchase", purchaseController);
server.use("/api/reports", reportsController);
server.use("/api/summaries", summariesController);
server.use("/api/tasks", taskController);

server.use(express.static(path.join(__dirname, "./frontend")));

server.use("*", (request, response) => {
    if (process.env.NODE_ENV === "production") {
        response.sendFile(path.join(__dirname, "./frontend/index.html"));
    }
    else {
        response.status(404).send("Route not found");
    }
});

const port = process.env.PORT || 3001;
server.listen(port, () => console.log("Listening...."));