exports.up = async function up(knex) {
  return knex.schema.alterTable('produtos', function(table) {
    table.string('icms_entrada', 3).alter();
    table.integer('pis').alter();
});
}

exports.down = async function (knex) { }