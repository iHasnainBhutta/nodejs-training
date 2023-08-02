const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "NodeJS API",
    version: "1.0.0",
    description: "NodeJS API with Express & MongoDB",
  },
  paths: {
    /* USER DOCUMENTATION */
    // USER REGISTERATION
    "/user-register": {
      post: {
        summary: "User Registration",
        description: "Register a new user.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                // Define the JSON schema for the request body here
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                  role: {
                    type: "string",
                    enum: ["admin", "user"], // Assuming role can be either "admin" or "user"
                  },
                  address: {
                    type: "string",
                  },
                  phone: {
                    type: "string",
                  },
                },
                required: ["name", "email", "password", "role", "address", "phone"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "User registered successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    user: {
                      $ref: "#/components/schemas/NewUser",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request, invalid data provided.",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    // USER LOGIN
    "/user-login": {
      post: {
        summary: "User Login",
        description: "Authenticate a user.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginUser",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User logged in successfully.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid credentials.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    // USER UPDATE
    "/user-update/{id}": {
      put: {
        summary: "Update User",
        description: "Update an existing user by ID.",
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateUser",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successfully updated the user.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateResponse",
                },
              },
            },
          },
          403: {
            description: "Access denied.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "User not found.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    // USER DELETE
    "/user-delete/{id}": {
      delete: {
        summary: "Delete User",
        description: "Delete an existing user by ID.",
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Successfully deleted the user.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessResponse",
                },
              },
            },
          },
          403: {
            description: "Access denied.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          404: {
            description: "User not found.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    /* PRODUCT DOCUMENTATION */
    // GET ALL PRODUCT
    "/all-products": {
      get: {
        summary: "Get all products",
        description: "Retrieve a list of all products.",
        responses: {
          // eslint-disable-next-line quote-props
          "200": {
            description: "Successful response with a list of products.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
          // eslint-disable-next-line quote-props
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    // ADD NEW PRODUCT
    "/add-product": {
      post: {
        summary: "Add a new product",
        description: "Create a new product.",
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewProduct",
              },
            },
          },
        },
        responses: {
          // eslint-disable-next-line quote-props
          "200": {
            description: "Successfully created a new product.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          // eslint-disable-next-line quote-props
          "400": {
            description: "Bad request, invalid data provided.",
          },
          // eslint-disable-next-line quote-props
          "403": {
            description: "Access denied.",
          },
          // eslint-disable-next-line quote-props
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    // DELETE PRODUCT
    "/delete-product/{id}": {
      delete: {
        summary: "Delete a product",
        description: "Delete an existing product by ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Product ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Successfully deleted the product.",
          },
          403: {
            description: "Access denied.",
          },
          404: {
            description: "Product not found.",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    // UPDATE EXISTING PRODUCT
    "/update-product/{id}": {
      put: {
        summary: "Update a product",
        description: "Update an existing product by ID.",
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Product ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          // required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateProduct",
              },
            },
          },
        },
        responses: {
          // eslint-disable-next-line quote-props
          "200": {
            description: "Successfully updated the product.",
          },
          // eslint-disable-next-line quote-props
          "400": {
            description: "Bad request, invalid data provided.",
          },
          // eslint-disable-next-line quote-props
          "403": {
            description: "Access denied.",
          },
          // eslint-disable-next-line quote-props
          "404": {
            description: "Product not found.",
          },
          // eslint-disable-next-line quote-props
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    // SEARCH PRODUCT
    "/products-search": {
      get: {
        summary: "Search products",
        description: "Search products by keyword.",
        parameters: [
          {
            name: "keyword",
            in: "query",
            description: "Keyword for product search",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful response with a list of products.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    // GET PRODUCT BY ID
    "/get-product-by-id/{id}": {
      get: {
        summary: "Get a product by ID",
        description: "Retrieve a product by ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Product ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          // eslint-disable-next-line quote-props
          "200": {
            description: "Successful response with the product.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          404: {
            description: "Product not found.",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    // CHECKOUT ITEMS
    "/checkout": {
      post: {
        summary: "Checkout order",
        description: "Checkout and place an order.",
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewOrder",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order placed successfully.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Order",
                },
              },
            },
          },
          400: {
            description: "Bad request, invalid data provided.",
          },
          404: {
            description: "Customer not registered or product not found.",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/add-category": {
      post: {
        summary: "Add a new category",
        description: "Create a new category.",
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewCategory",
              },
            },
          },
        },
        responses: {
          // eslint-disable-next-line quote-props
          "200": {
            description: "Successfully created a new category.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Category",
                },
              },
            },
          },
          400: {
            description: "Bad request, invalid data provided.",
          },
          403: {
            description: "Access denied.",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/order-history": {
      get: {
        summary: "Get Orders History",
        description: "Order history of the current login user",
        security: [
          {
            CustomHeaderAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Successful response with the order history.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    orders: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Order",
                      },
                    },
                  },
                },
              },
            },
          },
          204: {
            description: "No content. The request was successful, but there are no orders.",
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/filter-by-price": {
      get: {
        summary: "Filter Products by Price Range",
        description: "Filter products based on their price range",
        parameters: [
          {
            name: "minPrice",
            in: "query",
            description: "Minimum price for filtering",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            name: "maxPrice",
            in: "query",
            description: "Maximum price for filtering",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful response with filtered products.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    filteredProducts: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      CustomHeaderAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          sku: {
            type: "string",
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          price: {
            type: "number",
          },
          stock: {
            type: "number",
          },
          brand: {
            type: "string",
          },
          category: {
            $ref: "#/components/schemas/Category",
          },
        },
      },
      NewProduct: {
        type: "object",
        properties: {
          sku: {
            type: "string",
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          price: {
            type: "number",
          },
          stock: {
            type: "number",
          },
          brand: {
            type: "string",
          },
          category: {
            type: "string",
          },
        },
        required: [
          "sku",
          "title",
          "description",
          "price",
          "stock",
          "brand",
          "category",
        ],
      },
      UpdateProduct: {
        type: "object",
        properties: {
          sku: {
            type: "string",
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          price: {
            type: "number",
          },
          stock: {
            type: "number",
          },
          brand: {
            type: "string",
          },
          category: {
            type: "string",
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          customer: {
            type: "string",
          },
          products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product: {
                  type: "string",
                },
                quantity: {
                  type: "number",
                },
              },
            },
          },
          shippingAddress: {
            type: "string",
          },
          city: {
            type: "string",
          },
          totalAmount: {
            type: "number",
          },
          orderStatus: {
            type: "string",
          },
          country: {
            type: "string",
          },
        },
      },
      NewOrder: {
        type: "object",
        properties: {
          customer: {
            type: "string",
          },
          products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product: {
                  type: "string",
                },
                quantity: {
                  type: "number",
                },
              },
            },
          },
          shippingAddress: {
            type: "string",
          },
          city: {
            type: "string",
          },
          totalAmount: {
            type: "number",
          },
          orderStatus: {
            type: "string",
          },
          country: {
            type: "string",
          },
        },
        required: [
          "customer",
          "products",
          "shippingAddress",
          "city",
          "totalAmount",
          "orderStatus",
          "country",
        ],
      },
      Category: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
      },
      NewCategory: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
        required: ["name"],
      },
      LoginUser: {
        type: "object",
        properties: {
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
        required: ["email", "password"],
      },
      NewUser: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
          role: {
            type: "string",
          },
          address: {
            type: "string",
          },
          phone: {
            type: "string",
          },
        },
        required: ["name", "email", "password", "role", "address", "phone"],
      },
      UpdateUser: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
          role: {
            type: "string",
          },
          address: {
            type: "string",
          },
          phone: {
            type: "string",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
          token: {
            type: "string",
          },
          data: {
            $ref: "#/components/schemas/LoginUser",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
          },
        },
      },
      UpdateResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },
    },
  },
};

export default swaggerDocument;
