const express = require('express');
const productsService = require('../services/productsServices');
const validatorHandler = require('../middlewares/validatorHandler');
const { getSchema, updateSchema, createSchema } = require('../schemas/productSchema');

const router = express.Router();
const service = new productsService();

router.get('/' , async (req, res) => {
  const products = await service.find();
  res.json(products);
});

// NOTA: Simpre colocar primero las rutas estaticas y luego las dinamicas.
router.get('/filter' , async (req, res) => {
  res.send('Im filtering');
});

router.get('/:id',
  validatorHandler(getSchema, 'params'),
  async (req, res, next) => {
  // El paquete 'express-async-errors' agregado en el index.js nos permite manejar los erres asincronos de manera automatica
  // e invocando los middlewares sin necesidad de utilizar next en cada funcion del routing
    const { id } = req.params;
    let product = await service.findOne(id);
    res.json(product);
  // Esta seria la forma de trabajrlo sin el paquete 'express-async-errors'
  // try {
  //   const { id } = req.params;
  //   let product = await service.findOne(id);
  //   res.json(product);
  // } catch (error) {
  //   next(error);
  // }

});

router.post('/',
  validatorHandler(createSchema, 'body'),
  async (req, res) => {
    let body = req.body;
    let product = await service.create(body);

    res.status(201).json({
      message: 'New Product Created',
      data: product
    });
  }
);

//Aqui estaba validando los datos manualmente sin Joi
// router.post('/', async (req, res) => {
//   let body = req.body;
//   let isValidAndExist = service.create(body);

//   if (!isValidAndExist.isValid) {
//     res.status(409).json({
//       message: "One Parameter is Missing",
//       data: body
//     });
//   } else if (isValidAndExist.exist) {
//     res.status(409).json({
//       message: `The Product with id ${body.id} already exist.`,
//       data: body
//     });
//   } else {
//     res.status(201).json({
//       message: 'New Product Created',
//       data: body
//     });
//   }
// });

router.patch('/:id',
  validatorHandler(getSchema, 'params'),
  validatorHandler(updateSchema, 'body'),
  async (req, res) => {
    const { id } = req.params;
    let body = req.body;
    let result = await service.update(id, body);

    res.status(200).json({
      message: `The Product with id ${id} was updated.`,
      data: result
    });
  }
);

router.delete('/:id',
  validatorHandler(getSchema, 'params'),
  async (req, res) => {
    const { id } = req.params;
    const deleted = await service.delete(id);

    res.status(200).json({
      message: 'Product Deleted',
      id
    });
  }
);

module.exports = router;
