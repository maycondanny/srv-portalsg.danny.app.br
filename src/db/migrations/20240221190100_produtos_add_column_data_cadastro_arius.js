exports.up = async function up(knex) {
  const hasColumn = await knex.schema.hasColumn("produtos", "data_cadastro_arius");

  if (!hasColumn) {
    return knex.schema.table("produtos", function (table) {
      table.timestamp("data_cadastro_arius");
    });
  }

  return Promise.resolve();
};

exports.down = async function (knex) {};
