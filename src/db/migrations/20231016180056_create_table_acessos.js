exports.up = async function (knex) {
    return knex.schema.createTable('acessos', function (table) {
        table.increments('id').primary();
        table.text('pagina').notNullable();
        table.string('modulo', 100).notNullable();
        table.string('submodulo', 100);
        table.string('sub_submodulo', 100);
        table.bigInteger('icone_id');
        table.bigInteger('setor_id').notNullable();
        table.string('tag', 255).notNullable();
        table.tinyint('ativo', 1).defaultTo(1);
    })
};

exports.down = async function (knex) {}