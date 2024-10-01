export default interface UsuarioFornecedor {
    usuario_id: number;
    fornecedor_id: number;
    token?: string;
    ativo?: boolean;
    created_at?: Date;
}