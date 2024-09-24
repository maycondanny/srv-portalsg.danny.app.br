exports.up = async function up(knex) {
    return knex.schema.table('usuarios', async function (table) {
        const hasColumn = await knex.schema.hasColumn("cnpj");
        if (hasColumn) {
            table.dropColumn('cnpj');
        }
    });
}

exports.down = async function (knex) {}