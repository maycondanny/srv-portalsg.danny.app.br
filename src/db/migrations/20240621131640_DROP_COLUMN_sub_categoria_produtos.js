exports.up = async function up(knex) {
    return knex.schema.table('produtos', function (table) {
      table.dropColumn('sub_categoria');
    });
  }
  
  exports.down = async function (knex) { }