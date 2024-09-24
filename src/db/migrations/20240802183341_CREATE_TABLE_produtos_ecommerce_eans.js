exports.up = async function (knex) {
    return knex.schema.createTable("produtos_ecommerce_eans", function (table) {
      table.increments("id").primary();
      table.bigInteger("ecommerce_id").notNullable();
      table.string("codigo", 16).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
  
      table.index(["ecommerce_id"]);

      table.foreign('ecommerce_id').references('id').inTable('produtos_ecommerce').onDelete('CASCADE');
    });
  };
  
  exports.down = async function (knex) {
    return knex.schema.dropTable("produtos_ecommerce_eans");
  };
  