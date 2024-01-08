using System.Data.SqlClient;

namespace MiniORM;

public class Migration
{
    private readonly SqlConnection _sqlConnection;

    public Migration(string connectionString)
    {
        _sqlConnection = new SqlConnection(connectionString);
    }

    
}