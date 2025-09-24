using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using QLAPLibraryCatalogAPI.Models;

namespace QLAPLibraryCatalogAPI.Data;

public partial class LibraryCatalogContext : DbContext
{
    public LibraryCatalogContext()
    {
    }

    public LibraryCatalogContext(DbContextOptions<LibraryCatalogContext> options)
        : base(options)
    {
    }

    // Existing DbSets
    public virtual DbSet<BorrowRequest> BorrowRequests { get; set; }
    public virtual DbSet<Loan> Loans { get; set; }
    public virtual DbSet<LocationZone> LocationZones { get; set; }
    public virtual DbSet<MediaCopy> MediaCopies { get; set; }
    public virtual DbSet<MediaType> MediaTypes { get; set; }
    public virtual DbSet<Media> Media { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<UserPreferences> UserPreferences { get; set; }
    public virtual DbSet<Tag> Tags { get; set; }
    public virtual DbSet<MediaTag> MediaTags { get; set; }
    public virtual DbSet<UserProfile> UserProfiles { get; set; }
    public virtual DbSet<UserTag> UserTags { get; set; }
    public virtual DbSet<PronounSet> PronounSets { get; set; }
    public virtual DbSet<UserPronoun> UserPronouns { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<Permission> Permissions { get; set; }
    public virtual DbSet<UserRole> UserRoles { get; set; }
    public virtual DbSet<RolePermission> RolePermissions { get; set; }
    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Existing configurations (keeping your current setup)
        ConfigureBorrowRequest(modelBuilder);
        ConfigureLoan(modelBuilder);
        ConfigureMediaCopy(modelBuilder);
        ConfigureLocationZone(modelBuilder);
        ConfigureMediaType(modelBuilder);
        ConfigureMedia(modelBuilder);
        ConfigureUser(modelBuilder);
        ConfigureUserPreferences(modelBuilder);
        ConfigureTag(modelBuilder);
        ConfigureMediaTag(modelBuilder);
        ConfigureUserProfile(modelBuilder);
        ConfigureUserTag(modelBuilder);
        ConfigurePronounSet(modelBuilder);
        ConfigureUserPronoun(modelBuilder);
        ConfigureRole(modelBuilder);
        ConfigurePermission(modelBuilder);
        ConfigureUserRole(modelBuilder);
        ConfigureRolePermission(modelBuilder);
        ConfigureRefreshToken(modelBuilder);

        OnModelCreatingPartial(modelBuilder);
    }

    // Breaking down configurations into separate methods for better maintainability
    private static void ConfigureBorrowRequest(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BorrowRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("borrow_requests_pkey");
            entity.ToTable("borrow_requests");

            // Indexes
            entity.HasIndex(e => e.BorrowerId, "idx_borrow_requests_borrower_id");
            entity.HasIndex(e => e.CopyId, "idx_borrow_requests_copy_id");
            entity.HasIndex(e => e.Status, "idx_borrow_requests_status");

            // Properties
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.ApprovedAt).HasColumnName("approved_at");
            entity.Property(e => e.BorrowerId).HasColumnName("borrower_id");
            entity.Property(e => e.CopyId).HasColumnName("copy_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.DenialReason).HasColumnName("denial_reason");
            entity.Property(e => e.DeniedAt).HasColumnName("denied_at");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.RequestedEndDate).HasColumnName("requested_end_date");
            entity.Property(e => e.RequestedStartDate).HasColumnName("requested_start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'pending'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");

            // Relationships
            entity.HasOne(d => d.Borrower).WithMany(p => p.BorrowRequests)
                .HasForeignKey(d => d.BorrowerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("borrow_requests_borrower_id_fkey");

            entity.HasOne(d => d.Copy).WithMany(p => p.BorrowRequests)
                .HasForeignKey(d => d.CopyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("borrow_requests_copy_id_fkey");
        });
    }

    private static void ConfigureLoan(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Loan>(entity =>
        {
            entity.HasKey(e => e.LoanId).HasName("loans_pkey");
            entity.ToTable("loans");

            entity.HasIndex(e => e.RequestId, "idx_loans_request_id");
            entity.HasIndex(e => e.RequestId, "loans_request_id_key").IsUnique();

            entity.Property(e => e.LoanId).HasColumnName("loan_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.DueDate).HasColumnName("due_date");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.ReturnedDate).HasColumnName("returned_date");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.BorrowerReturnedAt).HasColumnName("borrower_returned_at");
            entity.Property(e => e.LenderConfirmedReturnAt).HasColumnName("lender_confirmed_return_at");
            entity.Property(e => e.BorrowerReturnNotes).HasColumnName("borrower_return_notes");
            entity.Property(e => e.LenderReturnNotes).HasColumnName("lender_return_notes");

            entity.HasOne(d => d.Request).WithOne(p => p.Loan)
                .HasForeignKey<Loan>(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("loans_request_id_fkey");
        });
    }

    // I'll continue with the remaining configurations in the next part...
    // This is getting long, so let me break it into smaller pieces for better readability

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);


    // Add these methods to your LibraryCatalogContext class

    private static void ConfigureMediaCopy(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MediaCopy>(entity =>
        {
            entity.HasKey(e => e.CopyId).HasName("user_media_copies_pkey");
            entity.ToTable("media_copies");

            entity.HasIndex(e => e.MediaId, "idx_user_media_copies_media_id");
            entity.HasIndex(e => e.UserId, "idx_user_media_copies_user_id");

            entity.Property(e => e.CopyId)
                .HasDefaultValueSql("nextval('user_media_copies_copy_id_seq'::regclass)")
                .HasColumnName("copy_id");
            entity.Property(e => e.Condition)
                .HasMaxLength(50)
                .HasColumnName("condition");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.IsAvailable)
                .HasDefaultValue(true)
                .HasColumnName("is_available");
            entity.Property(e => e.MediaId).HasColumnName("media_id");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CurrentLocationZoneId)
                .HasColumnName("current_location_zone_id");
            entity.Property(e => e.HomeLocationZoneId)
                .HasColumnName("home_location_zone_id");

            entity.HasOne(d => d.Media).WithMany(p => p.MediaCopies)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_media_copies_media_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.MediaCopies)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_media_copies_user_id_fkey");

            entity.HasOne(d => d.CurrentLocationZone).WithMany(p => p.CurrentLocationCopies)
                .HasForeignKey(d => d.CurrentLocationZoneId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("media_copies_current_location_zone_fkey");

            entity.HasOne(d => d.HomeLocationZone).WithMany(p => p.HomeLocationCopies)
                .HasForeignKey(d => d.HomeLocationZoneId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("media_copies_home_location_zone_fkey");
        });
    }

    private static void ConfigureLocationZone(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LocationZone>(entity =>
        {
            entity.HasKey(e => e.ZoneId).HasName("location_zones_pkey");
            entity.ToTable("location_zones");

            entity.Property(e => e.ZoneId).HasColumnName("zone_id");
            entity.Property(e => e.ZoneName)
                .HasMaxLength(100)
                .HasColumnName("zone_name");
            entity.Property(e => e.ZoneType)
                .HasMaxLength(50)
                .HasColumnName("zone_type");
            entity.Property(e => e.CenterLat)
                .HasPrecision(9, 6)
                .HasColumnName("center_lat");
            entity.Property(e => e.CenterLong)
                .HasPrecision(9, 6)
                .HasColumnName("center_long");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
        });
    }

    private static void ConfigureMediaType(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MediaType>(entity =>
        {
            entity.HasKey(e => e.MediaTypeId).HasName("media_types_pkey");
            entity.ToTable("media_types");

            entity.HasIndex(e => e.Name, "media_types_name_key").IsUnique();

            entity.Property(e => e.MediaTypeId).HasColumnName("media_type_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.DisplayName)
                .HasMaxLength(100)
                .HasColumnName("display_name");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
        });
    }

    private static void ConfigureMedia(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasKey(e => e.MediaId).HasName("media_pkey");
            entity.ToTable("media");

            entity.HasIndex(e => e.MediaTypeId, "idx_media_media_type_id");
            entity.HasIndex(e => e.Title, "idx_media_title");

            entity.Property(e => e.MediaId).HasColumnName("media_id");
            entity.Property(e => e.CoverImageUrl)
                .HasMaxLength(500)
                .HasColumnName("cover_image_url");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Creator)
                .HasMaxLength(500)
                .HasColumnName("creator");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Genre)
                .HasMaxLength(100)
                .HasColumnName("genre");
            entity.Property(e => e.Isbn10)
                .HasMaxLength(10)
                .HasColumnName("isbn10");
            entity.Property(e => e.Isbn13)
                .HasMaxLength(13)
                .HasColumnName("isbn13");
            entity.Property(e => e.IssueNumber)
                .HasMaxLength(50)
                .HasColumnName("issue_number");
            entity.Property(e => e.Language)
                .HasMaxLength(10)
                .HasDefaultValueSql("'en'::character varying")
                .HasColumnName("language");
            entity.Property(e => e.MediaTypeId).HasColumnName("media_type_id");
            entity.Property(e => e.Metadata)
                .HasColumnType("json")
                .HasColumnName("metadata");
            entity.Property(e => e.PageCount).HasColumnName("page_count");
            entity.Property(e => e.PublicationDate).HasColumnName("publication_date");
            entity.Property(e => e.Publisher)
                .HasMaxLength(200)
                .HasColumnName("publisher");
            entity.Property(e => e.Subtitle)
                .HasMaxLength(500)
                .HasColumnName("subtitle");
            entity.Property(e => e.Title)
                .HasMaxLength(500)
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.Volume)
                .HasMaxLength(50)
                .HasColumnName("volume");

            entity.HasOne(d => d.MediaType).WithMany(p => p.Media)
                .HasForeignKey(d => d.MediaTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("media_media_type_id_fkey");
        });
    }

    // Add these remaining configuration methods to your LibraryCatalogContext class

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pkey");
            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "idx_users_email");
            entity.HasIndex(e => e.Username, "idx_users_username");
            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();
            entity.HasIndex(e => e.Username, "users_username_key").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.EmailVerified)
                .HasDefaultValue(false)
                .HasColumnName("email_verified");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });
    }

    private static void ConfigureUserPreferences(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserPreferences>(entity =>
        {
            entity.HasKey(e => e.PreferenceId).HasName("user_preferences_pkey");
            entity.ToTable("user_preferences");

            entity.HasIndex(e => e.UserId, "idx_user_preferences_user_id");
            entity.HasIndex(e => e.UserId, "user_preferences_user_id_key").IsUnique();

            entity.Property(e => e.PreferenceId).HasColumnName("preference_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.EmailNotifications)
                .HasDefaultValue(true)
                .HasColumnName("email_notifications");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithOne(p => p.UserPreferences)
                .HasForeignKey<UserPreferences>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_preferences_user_id_fkey");
        });
    }

    private static void ConfigureTag(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("tags_pkey");
            entity.ToTable("tags");

            entity.HasIndex(e => e.TagName, "idx_tags_name");
            entity.HasIndex(e => e.CreatedAt, "idx_tags_created_at");
            entity.HasIndex(e => e.UpdatedAt, "idx_tags_updated_at");
            entity.HasIndex(e => e.TagName, "tags_tag_name_key").IsUnique();

            entity.Property(e => e.TagId).HasColumnName("tag_id");
            entity.Property(e => e.TagName)
                .HasMaxLength(50)
                .HasColumnName("tag_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.IsGenre)
                .HasColumnName("is_genre");
            entity.Property(e => e.Description)
                .HasColumnName("description");
        });
    }

    private static void ConfigureMediaTag(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MediaTag>(entity =>
        {
            entity.HasKey(e => new { e.MediaId, e.TagId }).HasName("media_tags_pkey");
            entity.ToTable("media_tags");

            entity.HasIndex(e => e.MediaId, "idx_media_tags_media_id");
            entity.HasIndex(e => e.TagId, "idx_media_tags_tag_id");

            entity.Property(e => e.MediaId).HasColumnName("media_id");
            entity.Property(e => e.TagId).HasColumnName("tag_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");

            entity.HasOne(d => d.Media).WithMany(p => p.MediaTags)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("media_tags_media_id_fkey");

            entity.HasOne(d => d.Tag).WithMany(p => p.MediaTags)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("media_tags_tag_id_fkey");
        });
    }
    // Replace the ConfigureGenre method in your LibraryCatalogContext with this version
    // that matches your existing database structure


    private static void ConfigureUserProfile(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("user_profiles_pkey");
            entity.ToTable("user_profiles");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ProfileDescription).HasColumnName("profile_description");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.User).WithOne(p => p.UserProfile)
                .HasForeignKey<UserProfile>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_profiles_user_id_fkey");
        });
    }

    private static void ConfigureUserTag(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserTag>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.TagId }).HasName("user_tags_pkey");
            entity.ToTable("user_tags");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.TagId).HasColumnName("tag_id");

            entity.HasOne(d => d.User).WithMany(p => p.UserTags)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_tags_user_id_fkey");

            entity.HasOne(d => d.Tag).WithMany(p => p.UserTags)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_tags_tag_id_fkey");
        });
    }

    private static void ConfigurePronounSet(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PronounSet>(entity =>
        {
            entity.HasKey(e => e.PronounId).HasName("pronoun_sets_pkey");
            entity.ToTable("pronoun_sets");

            // Indexes
            entity.HasIndex(e => e.PronounText, "idx_pronoun_sets_text_unique").IsUnique();
            entity.HasIndex(e => new { e.IsCommon, e.IsActive, e.DisplayOrder }, "idx_pronoun_sets_common_active");

            // Properties
            entity.Property(e => e.PronounId).HasColumnName("pronoun_id");
            entity.Property(e => e.PronounText)
                .HasMaxLength(50)
                .HasColumnName("pronoun_text");
            entity.Property(e => e.DisplayOrder)
                .HasDefaultValue(0)
                .HasColumnName("display_order");
            entity.Property(e => e.IsCommon)
                .HasDefaultValue(false)
                .HasColumnName("is_common");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updated_at");
        });
    }

    private static void ConfigureUserPronoun(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserPronoun>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.PronounId }).HasName("user_pronouns_pkey");
            entity.ToTable("user_pronouns");

            // Indexes
            entity.HasIndex(e => new { e.UserId, e.DisplayOrder }, "idx_user_pronouns_user_id");
            entity.HasIndex(e => e.PronounId, "idx_user_pronouns_pronoun_id");

            // Properties
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.PronounId).HasColumnName("pronoun_id");
            entity.Property(e => e.DisplayOrder)
                .HasDefaultValue(0)
                .HasColumnName("display_order");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("created_at");

            // Relationships
            entity.HasOne(d => d.User).WithMany(p => p.UserPronouns)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_pronouns_user_id");

            entity.HasOne(d => d.PronounSet).WithMany(p => p.UserPronouns)
                .HasForeignKey(d => d.PronounId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_user_pronouns_pronoun_id");
        });
    }

    private static void ConfigureRole(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("roles_pkey");
            entity.ToTable("roles");

            entity.HasIndex(e => e.RoleName, "roles_role_name_key").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("role_name");
            entity.Property(e => e.Description).HasColumnName("description");
        });
    }

    private static void ConfigurePermission(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("permissions_pkey");
            entity.ToTable("permissions");

            entity.HasIndex(e => e.PermissionName, "permissions_permission_name_key").IsUnique();

            entity.Property(e => e.PermissionId).HasColumnName("permission_id");
            entity.Property(e => e.PermissionName)
                .HasMaxLength(100)
                .HasColumnName("permission_name");
            entity.Property(e => e.Description).HasColumnName("description");
        });
    }

    private static void ConfigureUserRole(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId }).HasName("user_roles_pkey");
            entity.ToTable("user_roles");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.GrantedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("granted_at");
            entity.Property(e => e.GrantedBy).HasColumnName("granted_by");

            // Relationships
            entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("user_roles_user_id_fkey");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("user_roles_role_id_fkey");

            entity.HasOne(d => d.GrantedByUser).WithMany()
                .HasForeignKey(d => d.GrantedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("user_roles_granted_by_fkey");
        });
    }

    private static void ConfigureRolePermission(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.PermissionId }).HasName("role_permissions_pkey");
            entity.ToTable("role_permissions");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.PermissionId).HasColumnName("permission_id");

            // Relationships
            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("role_permissions_role_id_fkey");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("role_permissions_permission_id_fkey");
        });
    }
    private static void ConfigureRefreshToken(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId);
            
            entity.Property(e => e.Token)
                .HasMaxLength(500)
                .IsRequired();
                
            entity.Property(e => e.CreatedByIp)
                .HasMaxLength(45);
                
            entity.Property(e => e.RevokedByIp)
                .HasMaxLength(45);
                
            entity.Property(e => e.ReplacedByToken)
                .HasMaxLength(500);
            
            entity.HasOne(d => d.User)
                .WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => e.Token)
                .IsUnique();
        });
    }
    
    
}