exports.up = async function (knex) {
    return knex.schema.createTable("fornecedores", function (table) {
      table.increments("id").primary();
      table.string("nome");
      table.string("cnpj", 14);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
  
      table.unique("cnpj");
    });
  };
  
  exports.down = async function (knex) {
    return knex.schema.dropTable("fornecedores");
  };
  