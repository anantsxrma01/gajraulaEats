# Database Seeding Documentation

This directory contains scripts and instructions for seeding the database with initial data for the local food delivery platform. 

## Purpose

Seeding the database is essential for setting up the application with necessary data such as users, shops, menu items, and initial configurations. This helps in testing and development by providing a realistic dataset.

## How to Seed the Database

1. **Setup Environment**: Ensure that your environment is configured correctly with the necessary database connection settings.

2. **Run Seed Script**: Execute the seed script using the command:
   ```
   npm run seed
   ```
   or
   ```
   yarn seed
   ```

3. **Verify Data**: After running the seed script, verify that the data has been populated correctly in the database.

## Seed Data Structure

The seed data typically includes:
- Users: Sample users for testing.
- Shops: Example shops with menu items.
- Menu Items: Various food items associated with the shops.
- Other necessary configurations.

## Notes

- Ensure that the database is empty or reset before seeding to avoid duplicate entries.
- Modify the seed data as necessary to fit your testing requirements.