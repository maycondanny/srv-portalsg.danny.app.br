exports.up = async function (knex) {
  return knex.schema.createTable("icones", function (table) {
    table.increments("id").primary();
    table.string("nome", 30).notNullable();
    table.string("pacote", 2).notNullable();
    table.string("apelido", 30).notNullable();

    table.index(["nome", "pacote"]);
  });
};

exports.down = async function (knex) {}