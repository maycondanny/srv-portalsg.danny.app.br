import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('usuario_modulos', function (table) {
    table.bigInteger('usuario_id').notNullable();
    table.bigInteger('modulo_id').notNullable();

    table.foreign('usuario_id').references('id').inTable('usuarios');
    table.foreign('modulo_id').references('id').inTable('modulos');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('usuario_modulos');
}
