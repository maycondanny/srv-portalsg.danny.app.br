import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('usuarios', function (table) {
    table.tinyint('online', 1).defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('usuarios', function (table) {
    table.dropColumn('online');
  });
}
