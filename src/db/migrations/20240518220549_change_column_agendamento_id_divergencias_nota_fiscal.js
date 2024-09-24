exports.up = async function up(knex) {
    return knex.schema.table('divergencias_nota_fiscal', function (table) {
        table.renameColumn('agendamento_id', 'nota_fiscal_id');
        table.dropColumn('usuario_id');
    });
}

exports.down = async function (knex) { }