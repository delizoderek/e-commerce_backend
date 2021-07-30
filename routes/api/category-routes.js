const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({include:[{model:Product}]});
    if(!categoryData){
      res.status(404).send('Could not find that data');
      return;
    }
    res.status(200).json(categoryData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryItem = await Category.findByPk(req.params.id,{include:[{model:Product}]});
    if(!categoryItem){
      res.status(404).send('Could not find that data');
      return;
    }
    res.status(200).json(categoryItem);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
