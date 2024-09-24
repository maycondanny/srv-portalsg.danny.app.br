exports.up = async function up(knex) {
    return knex.schema.alterTable('usuarios', function (table) {
        table.string('nome', 255).alter();
        table.string('email', 255).alter();
    });
}

exports.down = async function (knex) { }