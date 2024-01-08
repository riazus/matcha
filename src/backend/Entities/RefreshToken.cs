using MiniORM;

namespace Backend.Entities;

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; }
    public DateTime Expires { get; set; }
    public DateTime Created { get; set; }
    public string CreatedByIp { get; set; }
    public DateTime? Revoked { get; set; }
    public string RevokedByIp { get; set; }
    public string ReplacedByToken { get; set; }
    public string ReasonRevoked { get; set; }
    // Foreign Key
    public Guid AccountId { get; set; }
    [Ignore]
    public bool IsExpired => DateTime.UtcNow >= Expires;
    [Ignore]
    public bool IsRevoked => Revoked != null;
    [Ignore]
    public bool IsActive => Revoked == null && !IsExpired;
}
