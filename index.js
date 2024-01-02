import express from "express"; //create API, served Front-End
import cors from "cors"; // set up the commnuication rules between Front-End and Back-End
import mongoose from "mongoose";

import { userRouter } from "./routes/user.js";
import { appointmentsRouter } from "./routes/route_appointment.js";


const app = express(); // a version of our API

app.use(express.json()); // the data got from the Front-End will be converted into JSON
app.use(cors());

app.use("/auth", userRouter); // applt the router
app.use("/appointments", appointmentsRouter);
app.use("/client_appointments", appointmentsRouter);

// Read - See all the appointments
router.get("/client_appointments", async (req, res) => {
  try {
    const userID = req.params.userID;
    const result = await makeAppointmentsModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

mongoose.connect(
  "mongodb+srv://41171123h:41171123hB1@b1.3xjj9xw.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const port = process.env.PORT || 3001;
// production script
app.use(express.static("./client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});