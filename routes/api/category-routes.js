const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).send("Could not find that data");
      return;
    }
    res.status(200).json(categoryData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryItem = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryItem) {
      res.status(404).send("Could not find that data");
      return;
    }
    res.status(200).json(categoryItem);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const newCateogry = await Category.create({
      category_name: req.body.categoryName,
    });
    if (!newCateogry) {
      res.status(404).send("Could not create new category");
      return;
    }
    res
      .status(200)
      .send(`The category ${req.body.categoryName} has been created`);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const catUpdate = await Category.update(
      {
        categoryName: req.body.categoryName,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!catUpdate) {
      res.status(404).send("Data could not be udpated");
      return;
    }
    console.log("Category updated succesfully");
    res.status(200).send("Updated Category");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const destroyed = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!destroyed) {
      res.status(404).json({ message: 'No library card found with that id!' });
      return;
    }

    res.status(200).json(destroyed);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

module.exports = router;
