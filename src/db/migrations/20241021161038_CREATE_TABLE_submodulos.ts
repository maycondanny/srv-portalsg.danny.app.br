import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('submodulos', function (table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('descricao').notNullable();
    table.text('url').notNullable();
    table.bigInteger('modulo_id').notNullable();
    table.bigInteger('icone_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('submodulos');
}
