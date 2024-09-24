exports.up = async function (knex) {
  return knex.schema.createTable("agendamentos_status", function (table) {
    table.increments("id").primary();
    table.string("descricao", 100).notNullable();
  });
};

exports.down = async function (knex) {}