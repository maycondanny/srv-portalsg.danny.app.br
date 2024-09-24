exports.up = async function up(knex) {
    return knex.schema.table('produtos', function(table) {
        table.bigInteger('analista_id');
    });
  }
  
exports.down = async function (knex) {}