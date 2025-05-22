using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("TodoItem", Schema = "todos")] // Define explicitamente o schema
public class TodoItem
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public bool IsComplete { get; set; }
}
