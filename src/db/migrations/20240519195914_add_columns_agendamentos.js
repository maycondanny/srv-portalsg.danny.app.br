exports.up = async function up(knex) {
    return knex.schema.table('agendamentos', function (table) {
      table.boolean('carga').defaultTo(false);
      table.string('nome_ajudante', 120).nullable();
      table.string('cpf_ajudante', 11).nullable();
    });
  }
  
  exports.down = async function (knex) { }