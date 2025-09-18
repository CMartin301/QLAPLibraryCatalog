
    public class TagDto
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = null!;
        public int? MediaTagCount { get; set; } = null!;
    }
    public class CreateTagDto
    {
        public string TagName { get; set; } = null!;
    }