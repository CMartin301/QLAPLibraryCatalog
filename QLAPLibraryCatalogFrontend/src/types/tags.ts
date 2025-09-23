
export interface TagDto {
  tagId: number;
  tagName: string;
  mediaTagCount?: number;
  isGenre: boolean;
  description: string;  

}

export interface CreateTagRequest {
  tagName: string;
}
export interface TagFormData {
  tagName: string;
}