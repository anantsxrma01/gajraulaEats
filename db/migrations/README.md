# Database Migrations Documentation

This directory contains migration files for managing database schema changes in the local food delivery platform. 

## Migration Files

- Each migration file should be named in the format `YYYYMMDDHHMMSS_description.js` to ensure proper ordering.
- Migrations should include both `up` and `down` methods to apply and revert changes respectively.

## Running Migrations

To run the migrations, use the following command:

```
npm run migrate
```

Ensure that your database connection is properly configured in the environment variables.

## Rollback Migrations

To rollback the last migration, use:

```
npm run migrate:rollback
```

## Best Practices

- Always create a backup of your database before running migrations.
- Test migrations in a staging environment before applying them to production.
- Document any changes made in the migration files for future reference.