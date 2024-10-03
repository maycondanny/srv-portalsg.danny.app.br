export default interface Categoria {
  id?: number;
  uuid?: string;
  reference_code?: string;
  name?: string;
  title?: string;
  keywords?: string;
  active?: boolean;
  main?: boolean;
  slug?: string;
  level?: number;
  father_reference_code?: number;
  father_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
