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

    public virtual DbSet<BorrowRequest> BorrowRequests { get; set; }

    public virtual DbSet<Loan> Loans { get; set; }

    public virtual DbSet<MediaType> MediaTypes { get; set; }

    public virtual DbSet<Media> Media { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserMediaCopy> UserMediaCopies { get; set; }

    public virtual DbSet<UserPreference> UserPreferences { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BorrowRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("borrow_requests_pkey");

            entity.ToTable("borrow_requests");

            entity.HasIndex(e => e.BorrowerId, "idx_borrow_requests_borrower_id");

            entity.HasIndex(e => e.CopyId, "idx_borrow_requests_copy_id");

            entity.HasIndex(e => e.Status, "idx_borrow_requests_status");

            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.ApprovedAt)
                .HasColumnType("timestamptz")
                .HasColumnName("approved_at");
            entity.Property(e => e.BorrowerId).HasColumnName("borrower_id");
            entity.Property(e => e.CopyId).HasColumnName("copy_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("created_at");
            entity.Property(e => e.DenialReason).HasColumnName("denial_reason");
            entity.Property(e => e.DeniedAt)
                .HasColumnType("timestamptz")
                .HasColumnName("denied_at");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.RequestedEndDate).HasColumnName("requested_end_date");
            entity.Property(e => e.RequestedStartDate).HasColumnName("requested_start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'pending'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Borrower).WithMany(p => p.BorrowRequests)
                .HasForeignKey(d => d.BorrowerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("borrow_requests_borrower_id_fkey");

            entity.HasOne(d => d.Copy).WithMany(p => p.BorrowRequests)
                .HasForeignKey(d => d.CopyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("borrow_requests_copy_id_fkey");
        });

        modelBuilder.Entity<Loan>(entity =>
        {
            entity.HasKey(e => e.LoanId).HasName("loans_pkey");

            entity.ToTable("loans");

            entity.HasIndex(e => e.RequestId, "idx_loans_request_id");

            entity.HasIndex(e => e.Status, "idx_loans_status");

            entity.HasIndex(e => e.RequestId, "loans_request_id_key").IsUnique();

            entity.Property(e => e.LoanId).HasColumnName("loan_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("created_at");
            entity.Property(e => e.DueDate).HasColumnName("due_date");
            entity.Property(e => e.LateFeeAmount)
                .HasPrecision(10, 2)
                .HasDefaultValueSql("0.00")
                .HasColumnName("late_fee_amount");
            entity.Property(e => e.LateFeePaid)
                .HasDefaultValue(false)
                .HasColumnName("late_fee_paid");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.ReturnNotes).HasColumnName("return_notes");
            entity.Property(e => e.ReturnedDate).HasColumnName("returned_date");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'active'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Request).WithOne(p => p.Loan)
                .HasForeignKey<Loan>(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("loans_request_id_fkey");
        });

        modelBuilder.Entity<MediaType>(entity =>
        {
            entity.HasKey(e => e.MediaTypeId).HasName("media_types_pkey");

            entity.ToTable("media_types");

            entity.HasIndex(e => e.Name, "media_types_name_key").IsUnique();

            entity.Property(e => e.MediaTypeId).HasColumnName("media_type_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
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
                .HasColumnType("timestamptz")
                .HasColumnName("updated_at");
        });

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
                .HasColumnType("timestamptz")
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
                .HasColumnType("timestamptz")
                .HasColumnName("updated_at");
            entity.Property(e => e.Volume)
                .HasMaxLength(50)
                .HasColumnName("volume");

            entity.HasOne(d => d.MediaType).WithMany(p => p.Media)
                .HasForeignKey(d => d.MediaTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("media_media_type_id_fkey");
        });

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
                .HasColumnType("timestamptz")
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
                .HasColumnType("timestamptz")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<UserMediaCopy>(entity =>
        {
            entity.HasKey(e => e.CopyId).HasName("user_media_copies_pkey");

            entity.ToTable("user_media_copies");

            entity.HasIndex(e => e.MediaId, "idx_user_media_copies_media_id");

            entity.HasIndex(e => e.UserId, "idx_user_media_copies_user_id");

            entity.Property(e => e.CopyId).HasColumnName("copy_id");
            entity.Property(e => e.Condition)
                .HasMaxLength(50)
                .HasColumnName("condition");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("created_at");
            entity.Property(e => e.IsAvailable)
                .HasDefaultValue(true)
                .HasColumnName("is_available");
            entity.Property(e => e.MaxLoanDays)
                .HasDefaultValue(14)
                .HasColumnName("max_loan_days");
            entity.Property(e => e.MediaId).HasColumnName("media_id");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.RequiresApproval)
                .HasDefaultValue(true)
                .HasColumnName("requires_approval");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Media).WithMany(p => p.UserMediaCopies)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_media_copies_media_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.UserMediaCopies)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_media_copies_user_id_fkey");
        });

        modelBuilder.Entity<UserPreference>(entity =>
        {
            entity.HasKey(e => e.PreferenceId).HasName("user_preferences_pkey");

            entity.ToTable("user_preferences");

            entity.HasIndex(e => e.UserId, "idx_user_preferences_user_id");

            entity.HasIndex(e => e.UserId, "user_preferences_user_id_key").IsUnique();

            entity.Property(e => e.PreferenceId).HasColumnName("preference_id");
            entity.Property(e => e.AutoApproveRequests)
                .HasDefaultValue(false)
                .HasColumnName("auto_approve_requests");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("created_at");
            entity.Property(e => e.DefaultLoanDays)
                .HasDefaultValue(14)
                .HasColumnName("default_loan_days");
            entity.Property(e => e.EmailNotifications)
                .HasDefaultValue(true)
                .HasColumnName("email_notifications");
            entity.Property(e => e.NotificationSettings)
                .HasColumnType("json")
                .HasColumnName("notification_settings");
            entity.Property(e => e.SmsNotifications)
                .HasDefaultValue(false)
                .HasColumnName("sms_notifications");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamptz")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithOne(p => p.UserPreference)
                .HasForeignKey<UserPreference>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_preferences_user_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
