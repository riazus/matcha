using System.Data.SqlClient;
using System.Reflection;

namespace MiniORM;

public interface IDBContext
{
    IEnumerable<T> Get<T>();
    IEnumerable<T> GetWhereList<T>(string where);
    IEnumerable<T> GetListWithQuery<T>(string query);
    T Get<T>(Guid id);
    T Get<T>(PropertyInfo property, object value);
    T GetWhere<T>(string where);
    int GetWhereCount<T>(string where);
    bool Any<T>(PropertyInfo property, object value);
    bool AnyWhere<T>(string where);
    void Insert<T>(T entity);
    void Update<T>(T entity);
    void Delete<T>(Guid id);
    void DeleteWhere<T>(string  where);
}

public class DbContext : IDBContext
{
    private readonly SqlConnection _sqlConnection;

    public DbContext(string connectionString)
    {
        _sqlConnection = new SqlConnection(connectionString);
    }

    public IEnumerable<T> Get<T>()
    {
        return GetListExecuter<T>($"SELECT * FROM {typeof(T).Name}");
    }

    public IEnumerable<T> GetWhereList<T>(string where)
    {
        return GetListExecuter<T>($"SELECT * FROM {typeof(T).Name} WHERE {where}");
    }

    public IEnumerable<T> GetListWithQuery<T>(string query)
    {
        return GetListExecuter<T>(query);
    }

    private IEnumerable<T> GetListExecuter<T>(string query)
    {
        List<T> entities = new List<T>();
        try
        {
            _sqlConnection.Open();
            SqlCommand command = new SqlCommand(query, _sqlConnection);
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                T entity = Activator.CreateInstance<T>();
                foreach (var property in getAvailableProperties<T>())
                {
                    if (reader[property.Name] != DBNull.Value)
                    {
                        setPropertyValue(property, entity, reader);
                    }
                }
                entities.Add(entity);
            }
        }
        finally
        {
            _sqlConnection.Close();
        }
        return entities;
    }

    public T Get<T>(Guid id)
    {
        return GetExecuter<T>(
            $"SELECT * FROM {typeof(T).Name} WHERE Id = \'{id}\'");
    }

    public T GetWhere<T>(string where)
    {
        return GetExecuter<T>(
            $"SELECT * FROM {typeof(T).Name} WHERE {where}");
    }

    public T Get<T>(PropertyInfo propertyInfo, object value) 
    {
        return GetExecuter<T>(
            $"SELECT * FROM {typeof(T).Name} WHERE {propertyInfo.Name} = \'{(string)value}\'");
    }

    private T GetExecuter<T>(string query)
    {
        T entity = Activator.CreateInstance<T>();

        try
        {
            _sqlConnection.Open();
            SqlCommand command = new SqlCommand(query, _sqlConnection);
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                foreach (var property in getAvailableProperties<T>())
                {
                    if (reader[property.Name] != DBNull.Value)
                    {
                        setPropertyValue(property, entity, reader);
                    }
                }
            }
        }
        finally
        {
            _sqlConnection.Close();
        }

        return entity;
    }

    public int GetWhereCount<T>(string where)
    {
        try
        {
            string query = $"SELECT COUNT(1) AS [Count] FROM [{typeof(T).Name}] WHERE {where}";
            _sqlConnection.Open();
            SqlCommand command = new SqlCommand(query, _sqlConnection);
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                if (!int.TryParse(reader[0].ToString(), out int res))
                {
                    throw new Exception("Failed to parse count");
                }

                return res;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"{{FC={ConsoleColor.Red}}}MiniORM {{/FC}}: {ex.ToString()}");
        }
        finally
        {
            _sqlConnection.Close();
        }

        return 0;
    }

    public void Insert<T>(T entity)
    {
        try
        {
            _sqlConnection.Open();

            var entityProperties = getAvailableProperties<T>();
            var propertiesName = entityProperties.Select(p => p.Name);

            string columns = string.Join(", ", propertiesName);
            string values = string.Join(", ", propertiesName.Select(s => $"@{s}"));

            string query = $"INSERT INTO [{typeof(T).Name}] ({columns}) VALUES ({values})";

            SqlCommand command = new SqlCommand(query, _sqlConnection);
            foreach (var property in entityProperties)
            {
                command.Parameters.AddWithValue($"@{property.Name}", property.GetValue(entity) ?? DBNull.Value);
            }
            command.ExecuteNonQuery();
        }
        catch(Exception ex)
        {
            Console.WriteLine($"{{FC={ConsoleColor.Red}}}MiniORM {{/FC}}: {ex.ToString()}");
        }
        finally
        {
            _sqlConnection.Close();
        }
    }

    public void Update<T>(T entity)
    {
        try
        {
            _sqlConnection.Open();

            var entityProperties = getAvailableProperties<T>();
            var propertiesName = entityProperties.Select(p => p.Name);

            string columns = string.Join(", ", propertiesName.Select(p => $"{p} = @{p}"));
            string query = $"UPDATE {typeof(T).Name} SET {columns} WHERE Id = @Id";

            SqlCommand command = new SqlCommand(query, _sqlConnection);
            foreach (var property in entityProperties)
            {
                command.Parameters.AddWithValue($"@{property.Name}", property.GetValue(entity) ?? DBNull.Value);
            }
            command.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"{{FC={ConsoleColor.Red}}}MiniORM {{/FC}}: {ex.ToString()}");
        }
        finally
        {
            _sqlConnection.Close();
        }
    }

    public void Delete<T>(Guid id)
    {
        try
        {
            _sqlConnection.Open();
            string query = $"DELETE FROM {typeof(T).Name} WHERE Id = @Id";
            SqlCommand command = new SqlCommand(query, _sqlConnection);
            command.Parameters.AddWithValue("@Id", id);
            command.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"{{FC={ConsoleColor.Red}}}MiniORM {{/FC}}: {ex.ToString()}");
        }
        finally
        {
            _sqlConnection.Close();
        }
    }

    public bool Any<T>(PropertyInfo property, object value)
    {
        try
        {
            _sqlConnection.Open();
            string query = $"SELECT 1 FROM {typeof(T).Name} WHERE {property.Name} = \'{(string)value}\'";
            SqlCommand command = new SqlCommand(query, _sqlConnection);
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                return true;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"{{FC={ConsoleColor.Red}}}MiniORM {{/FC}}: {ex.ToString()}");
        }
        finally
        {
            _sqlConnection.Close();
        }

        return false;
    }

    public void DeleteWhere<T>(string where)
    {
        try
        {
            _sqlConnection.Open();
            string query = $"DELETE FROM {typeof(T).Name} WHERE {where}";
            SqlCommand command = new SqlCommand(query, _sqlConnection);
            command.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"{{FC={ConsoleColor.Red}}}MiniORM {{/FC}}: {ex.ToString()}");
        }
        finally
        {
            _sqlConnection.Close();
        }
    }

    public bool AnyWhere<T>(string where)
    {
        try
        {
            _sqlConnection.Open();
            string query = $"SELECT 1 FROM {typeof(T).Name} WHERE {where}";

            SqlCommand command = new SqlCommand(query, _sqlConnection);
            SqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                return true;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"{{FC={ConsoleColor.Red}}}MiniORM {{/FC}}: {ex.ToString()}");
        }
        finally
        {
            _sqlConnection.Close();
        }

        return false;
    }

    #region Helpers

    private IEnumerable<PropertyInfo> getAvailableProperties<T>()
    {
        return typeof(T).GetProperties().Where(p => !Attribute.IsDefined(p, typeof(IgnoreAttribute)));
    }

    private void setPropertyValue<T>(PropertyInfo property, T entity, SqlDataReader reader)
    {
        Type propertyType = property.PropertyType;
        if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
        {
            // Handle nullable value types
            Type underlyingType = Nullable.GetUnderlyingType(propertyType);
            object tmpValue = Convert.ChangeType(reader[property.Name], underlyingType);
            property.SetValue(entity, tmpValue);
        }
        else
        {
            // Handle non-nullable value types
            property.SetValue(entity, Convert.ChangeType(reader[property.Name], propertyType));
        }
    }

    #endregion
}

