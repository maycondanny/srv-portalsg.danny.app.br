import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('modulos', function (table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('descricao').notNullable();
    table.text('url').notNullable();
    table.bigInteger('setor_id').notNullable();
    table.bigInteger('icone_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('icone_id').references('id').inTable('icones');
    table.foreign('setor_id').references('id').inTable('setores');

    table.index("setor_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('modulos');
}
