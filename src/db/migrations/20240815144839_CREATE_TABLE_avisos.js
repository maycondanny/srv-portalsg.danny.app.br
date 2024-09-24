exports.up = async function (knex) {
  return knex.schema.createTable("avisos", function (table) {
    table.increments("id").primary();
    table.text("mensagem").notNullable();
    table.datetime("data_inicio");
    table.datetime("data_fim");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("avisos");
};
