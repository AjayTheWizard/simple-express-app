import express from "express";
import triplesec from "triplesec";

const app = express();

const port = process.env.PORT || 5000

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/encode", (req, res) => {
  console.log(req.query);
  const { msg, password } = req.query;
  triplesec.encrypt(
    {
      key: new Buffer(password),
      data: new Buffer(msg),
    },
    function (err, buff) {
      if (!err) {
        const result = buff.toString("hex");
        res.send(result);
      } else {
        res.send("Something wrong in Server!");
      }
    }
  );
});

app.get("/decode", (req, res) => {
  const { hash, password } = req.query;
  triplesec.decrypt(
    {
      key: new Buffer(password),
      data: new Buffer(hash, "hex"),
    },
    (err, buff) => {
      if (!err) {
        const result = buff.toString();
        res.send(result);
      } else {
        res.send("Something wrong in Server!");
      }
    }
  );
});
app.listen(port, () => {
  console.log("App is listening at http://localhost:5000");
});
