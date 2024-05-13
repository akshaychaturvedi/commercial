const cds = require("@sap/cds");

module.exports = async function (srv) {
  const { ProductList } = this.entities;
  this.before("CREATE", "ProductList", async (req) => {
    // Check if a product with the same name already exists
    const existingProductQuery = SELECT.one
      .from(ProductList)
      .where({ productName: req.data.productName });
    let existingProduct = await srv.run(existingProductQuery);
    if (existingProduct) {
      // If a product with the same name already exists, reject the creation request
      req.error(
        409,
        `Product with name '${req.data.productName}' already exists`
      );
    }
  });
};
