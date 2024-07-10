require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 8080;

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

const dinosaurSchema = new mongoose.Schema({
  name: String,
  description: String,
  diet: String,
  found_in: String,
  image_url: String,
  length: String,
  name_meaning: String,
  pronunciation: String,
  type: String,
  when_it_lived: String,
});

const Dinosaur = mongoose.model(
  "Dinosaur",
  dinosaurSchema,
  "dinosaur_collection"
);

app.get("/api/home", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Fetch all dinosaurs
app.get("/api/dinosaurs", async (req, res) => {
  try {
    const dinosaurs = await Dinosaur.find();
    res.json(dinosaurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all dinosaur names
app.get("/api/dinosaurs/names", async (req, res) => {
  try {
    let aggregationPipeline = [{ $project: { _id: 0, name: "$name" } }];
    if (req.query.query) {
      const searchQuery = req.query.query;
      aggregationPipeline.unshift({
        $match: { name: { $regex: new RegExp(searchQuery, "i") } },
      });
    }

    const names = await Dinosaur.aggregate(aggregationPipeline);
    const nameArray = names.map((dino) => dino.name);

    res.json(nameArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a single dinosaur by name
app.get("/api/dinosaurs/by-name", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Name parameter is required" });
  }

  try {
    const dinosaur = await Dinosaur.findOne({ name: name });
    if (!dinosaur) {
      return res.status(404).json({ message: "Dinosaur not found" });
    }
    res.json(dinosaur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all dinosaur diets in the database
app.get("/api/dinosaurs/diets", async (req, res) => {
  try {
    const diets = await Dinosaur.aggregate([
      { $group: { _id: "$diet" } },
      { $project: { _id: 0, diet: "$_id" } },
    ]);

    res.json(diets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all dinosaur types in the database
app.get("/api/dinosaurs/types", async (req, res) => {
  try {
    const types = await Dinosaur.aggregate([
      { $group: { _id: "$type" } },
      { $project: { _id: 0, type: "$_id" } },
    ]);

    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a random dinosaur
app.get("/api/dinosaurs/random", async (req, res) => {
  try {
    const randomDinosaur = await Dinosaur.aggregate([{ $sample: { size: 1 } }]);

    if (randomDinosaur.length === 0) {
      return res.status(404).json({ message: "No dinosaurs found" });
    }

    res.json(randomDinosaur[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a random dinosaur along with its image_url
app.get("/api/dinosaurs/random/image", async (req, res) => {
  try {
    const randomDinosaurWithImage = await Dinosaur.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 0, name: 1, image_url: 1 } },
    ]);

    if (randomDinosaurWithImage.length === 0) {
      return res.status(404).json({ message: "No dinosaurs found" });
    }

    res.json(randomDinosaurWithImage[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a random list of 3 dinosaur names, excluding a specific name if provided
app.get("/api/dinosaurs/random/names", async (req, res) => {
  try {
    const excludeName = req.query.exclude;

    let aggregationPipeline = [
      { $match: excludeName ? { name: { $ne: excludeName } } : {} },
      { $sample: { size: 3 } },
      { $project: { _id: 0, name: 1 } },
    ];

    const randomDinosaurNames = await Dinosaur.aggregate(aggregationPipeline);

    if (randomDinosaurNames.length === 0) {
      return res.status(404).json({ message: "No dinosaurs found" });
    }

    const names = randomDinosaurNames.map((dino) => dino.name);

    res.json(names);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search for dinosaurs based on various query parameters
app.get("/api/dinosaurs/search", async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.diet) {
      query.diet = req.query.diet;
    }
    if (req.query.found_in) {
      query.found_in = req.query.found_in;
    }
    if (req.query.length) {
      query.length = req.query.length;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }

    const dinosaurs = await Dinosaur.find(query);

    if (dinosaurs.length === 0) {
      return res
        .status(404)
        .json({ message: "No dinosaurs found matching the query" });
    }

    res.json(dinosaurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
