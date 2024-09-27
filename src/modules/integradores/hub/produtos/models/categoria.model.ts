export default interface Categoria {
    id?: string,
    uuid?: string,
    reference_code?: string,
    name?: string,
    title?: string,
    keywords?: string,
    active?: boolean,
    main?: any,
    slug?: string,
    level?: number,
    father_reference_code?: string,
    father_id?: any,
    created_at?: Date,
    updated_at?: Date
}