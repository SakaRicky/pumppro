import { test, describe, beforeEach, afterEach } from "node:test";
import prisma from "../../client";
import { testApi, authToken, initialProductCategories, initialProducts } from "./helper/setupTestDB";
import { NewProduct } from "../types";
import assert from "assert";
import { Decimal } from "@prisma/client/runtime/library";
import { Product } from "@prisma/client";

describe('Product Management Feature', () => {

  let productToSave: NewProduct;

  beforeEach(() => {
    productToSave = {
      name: "Mambo PM 25g TEST",
      description: "Chocolate thin bar of 25g in testing env",
      quantity: 75,
      purchase_price: new Decimal(150),
      selling_price: new Decimal(175),
      low_stock_threshold: 25,
      category_id: initialProductCategories[1].id,
      image:
        "https://res.cloudinary.com/rickysaka/image/upload/v1704262313/pumppro/products/unh7iikkkxynza1cehzh.jpg"
    }
  })

  describe('Adding a Product', () => {


    test('should successfully add a product with valid details', async () => {

      await prisma.$transaction(async (tx) => {
        // Pass 'tx' instead of 'prisma' to all your data-access functions.
        const res = await testApi
          .post("/products")
          .send(productToSave)
          .set({
            authorization: `bearer ${authToken}`
          });

        const savedProduct = res.body as Product;

        assert.strictEqual(res.status, 200);

        const products = await prisma.product.findMany();
        assert.strictEqual(products.length, initialProducts.length + 1);
      });



    });

    test('should reject a product with invalid inputs', async () => {


      await prisma.$transaction(async (tx) => {
        const { name, ...productWithoutName } = productToSave;

        const res = await testApi
          .post("/products")
          .send(productWithoutName)
          .set({
            authorization: `bearer ${authToken}`
          });

        assert.strictEqual(res.status, 400);

        const products = await prisma.product.findMany();
        assert.strictEqual(products.length, initialProducts.length);
      });



    });
  });

  describe('Updating a Product', () => {
    // Similar structure for update functionality
  });

  describe('Deleting a Product', () => {
    // Tests for deletion including edge cases (e.g., deleting non-existent product)
  });

  describe('Retrieving Products', () => {
    // Tests for listing, filtering, or searching products
  });
});
