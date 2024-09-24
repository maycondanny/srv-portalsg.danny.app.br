exports.up = async function up(knex) {
  return knex.schema.table('usuarios', function(table) {
    table.tinyint('troca_senha', 1).defaultTo(0);
  });
}

exports.down = async function (knex) {}