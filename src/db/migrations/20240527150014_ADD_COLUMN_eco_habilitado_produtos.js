exports.up = async function up(knex) {
    return knex.schema.table('produtos', function(table) {
        table.boolean('eco_habilitado').defaultTo(false);
    });
  }
  
exports.down = async function (knex) {}