const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).send("Could not find the data, sorry");
      return;
    }
    res.status(200).json(tagData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const singleTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!singleTag) {
      res.status(404).send(`Could not find the tag with id ${req.params.id}`);
      return;
    }
    res.status(200).json(singleTag);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


router.post('/', async (req, res) => {
  /*
    {
      tag_name: "Fluffy",
      productIds: [1,4,5];
    }
  */
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            product_id,
            tag_id: tag.id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTag = await Tag.update(req.body,{
      where: {
        id: req.params.id,
      }
    });
    const allProdTags = await ProductTag.findAll({
      where:{tag_id:req.params.id},
    });
    const newRows = req.body.productIds.map(product_id => {
      return {
        product_id: product_id,
        tag_id: req.params.id,
      };
    });
    // const mappedTags = allProdTags.map(({product_id}) => product_id);
    const rowIds = allProdTags.map(({id}) => id);

    const destroyAndCreate = await Promise.all([
      ProductTag.destroy({where:{id:rowIds}}),
      ProductTag.bulkCreate(newRows),
    ]);
    console.log(destroyAndCreate);
    res.send('received');
  } catch (error) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const destroyed = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!destroyed) {
      res.status(404).json({ message: `No product found with id ${req.params.id}!` });
      return;
    }

    res.status(200).json(destroyed);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

module.exports = router;
