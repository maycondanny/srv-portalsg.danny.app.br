exports.up = async function up(knex) {
    return knex.schema.table('notas_fiscais', function (table) {
        table.renameColumn('usuario_id', 'fornecedor_id');
    });
}

exports.down = async function (knex) { }