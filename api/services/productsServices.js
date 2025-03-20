const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');


class productsService {
  constructor(){
    this.products = [];
    this.generate();
  }

  generate(){
    let limit = 100;

    for (let i = 0; i < limit; i++) {
      this.products.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        image: faker.image.url(),
        price: parseInt(faker.commerce.price(), 10),
        isBlocked: faker.datatype.boolean()
      });
    };
  };

  async find(){
    //return this.products;

    //Simulating Asyncrony
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.products);
      },3000);
    });
  };

  async findOne(id){
    const product = this.products.find(item => item.id === id);
    if (!product) {
      throw boom.notFound('Product not fount');
    }
    if (product.isBlocked) {
      throw boom.conflict('Product is Blocked');
    }
    return product;
  };

  async create(data){
    let product = {
      id: faker.string.uuid(),
      ...data
    };

    this.products.push(product);
    return product;
  };

  // Aqui estaba validando la data de forma manual
  // async create(product){
  //   const necesaryKeys = ['id', 'name', 'price', 'image'];
  //   const validateKeys = (obj, keys) => {
  //     return keys.every(key => obj.hasOwnProperty(key));
  //   };
  //   const isValid = validateKeys(product, necesaryKeys);

  //   if (!isValid) return {"isValid" : false, "exist" : null};

  //   let exist = this.products.some(item => item.id === product.id);

  //   if (!exist) {
  //     this.products.push(product);
  //     return {"isValid" : true, "exist" : false};
  //   } else {
  //     return {"isValid" : true, "exist" : true};
  //   }
  // };

  async update(id, data){
    // let product = this.findOne(id);
    // if (!product) return false;

    //Object.assign(product, data);

    //Another way to do it
    let index = this.products.findIndex(item => item.id === id);
    if (index < 0) throw boom.notFound('Product not fount');

    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...data
    }

    return this.products[index];
  };

  async delete(id){
    let index = this.products.findIndex(item => item.id === id);
    if (index < 0) throw boom.notFound('Product not fount');

    return true;

  }
}

module.exports = productsService;
