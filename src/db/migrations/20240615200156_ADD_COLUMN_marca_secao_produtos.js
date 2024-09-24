exports.up = async function up(knex) {
    return knex.schema.table('produtos', function(table) {
        table.integer('marca');
        table.integer('secao');
    });
  }
  
exports.down = async function (knex) {}