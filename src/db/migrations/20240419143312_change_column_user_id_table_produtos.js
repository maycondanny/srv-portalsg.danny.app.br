exports.up = async function up(knex) {
  return knex.schema.table('produtos', function (table) {
    table.renameColumn('user_id', 'fornecedor_id');
  });
}

exports.down = async function (knex) { }