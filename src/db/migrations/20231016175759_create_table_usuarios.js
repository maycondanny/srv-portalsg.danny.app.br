exports.up = async function (knex) {
  return knex.schema.createTable("usuarios", function (table) {
    table.increments("id").primary();
    table.string("email", 100).unique().notNullable();
    table.string("nome", 50).notNullable();
    table.text("senha").notNullable();
    table.string("cnpj", 14).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {}