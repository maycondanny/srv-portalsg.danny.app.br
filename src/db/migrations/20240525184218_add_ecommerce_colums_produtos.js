exports.up = async function up(knex) {
    return knex.schema.table('produtos', function (table) {
      table.integer('eco_marca');
      table.integer('eco_departamento');
      table.integer('eco_secao');
      table.integer('eco_ativo', 1);
      table.integer('eco_lancamento', 1);
      table.integer('eco_destaque', 1);
    });
  }
  
  exports.down = async function (knex) { }