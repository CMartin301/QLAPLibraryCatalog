
export interface TagDto {
  tagId: number;
  tagName: string;
  mediaTagCount?: number;
}

export interface CreateTagRequest {
  tagName: string;
}
export interface TagFormData {
  tagName: string;
}