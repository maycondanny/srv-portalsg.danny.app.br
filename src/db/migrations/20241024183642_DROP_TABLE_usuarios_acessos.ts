import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('usuarios_acessos');
}

export async function down(knex: Knex): Promise<void> {}
