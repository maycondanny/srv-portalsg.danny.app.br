exports.up = async function up(knex) {
    return knex.schema.alterTable('produtos', function (table) {
        table.string('codigo_produto_fornecedor').alter();
        table.text('descricao_abreviada').notNullable().alter();
        table.string('sub_categoria', 255).notNullable().alter();
        table.string('ncm', 255).notNullable().alter();
        table.text('descricao_classificacao').notNullable().alter();
        table.integer('origem').alter();
        table.integer('uf_faturamento').notNullable().alter();
        table.decimal('peso_bruto').notNullable().defaultTo(0).alter();
        table.decimal('altura_primario').notNullable().defaultTo(0).alter();
        table.decimal('largura_primario').notNullable().defaultTo(0).alter();
        table.decimal('comprimento_primario').notNullable().defaultTo(0).alter();
        table.integer('validade').alter();
        table.integer('qtde_cx').alter();
        table.decimal('comprimento_secundario').notNullable().defaultTo(0).alter();
        table.decimal('largura_secundario').notNullable().defaultTo(0).alter();
        table.decimal('altura_secundario').notNullable().defaultTo(0).alter();
        table.decimal('peso_bruto_secundario').notNullable().defaultTo(0).alter();
        table.decimal('peso_liquido_secundario').notNullable().defaultTo(0).alter();
        table.decimal('ipi').notNullable().defaultTo(0).alter();
        table.decimal('iva').notNullable().defaultTo(0).alter();
        table.decimal('icms').notNullable().defaultTo(0).alter();
        table.string('icms_entrada', 10).alter();
        table.string('pis', 50).alter();
        table.text('descricao_curta_multicanal').alter();
        table.text('descricao_detalhada_multicanal').alter();
        table.text('modo_uso').alter();
        table.string('link_videos_imagens', 255).alter();
    });
}

exports.down = async function (knex) { }