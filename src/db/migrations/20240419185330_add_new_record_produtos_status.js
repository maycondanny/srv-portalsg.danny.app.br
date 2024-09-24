exports.up = async function up(knex) {
    return knex('produtos_status').insert({
        id: 4,
        descricao: 'Divergência',
    });
}

exports.down = async function (knex) { }