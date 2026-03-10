---
title: "How to Solve Fix Names in a Table — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Fix Names in a Table. Easy difficulty, 60.6% acceptance rate. Topics: Database."
date: "2027-06-15"
category: "dsa-patterns"
tags: ["fix-names-in-a-table", "database", "easy"]
---

# How to Solve Fix Names in a Table

This problem asks us to format names in a database table by capitalizing the first letter of each name and making the rest lowercase. While conceptually simple, it's a practical SQL problem that tests your understanding of string manipulation functions and proper formatting logic. The tricky part is handling names with multiple words correctly and ensuring consistent formatting across all records.

## Visual Walkthrough

Let's walk through a small example to understand the transformation needed. Suppose our `Users` table contains:

| user_id | name       |
| ------- | ---------- |
| 1       | alice      |
| 2       | bOB        |
| 3       | joHn sMith |
| 4       | MARY       |

We need to transform each name:

1. **alice** → "Alice" (first letter uppercase, rest lowercase)
2. **bOB** → "Bob" (first letter uppercase, rest lowercase)
3. **joHn sMith** → "John Smith" (each word separately capitalized)
4. **MARY** → "Mary" (first letter uppercase, rest lowercase)

The key insight is that we need to handle each word in the name separately. A name like "joHn sMith" has two words that both need individual capitalization. We can't just capitalize the first character of the entire string because "sMith" would become "Smith" instead of "Smith".

## Brute Force Approach

In SQL problems, there's rarely a true "brute force" approach, but a naive solution might try to handle the entire string at once without considering multiple words. For example, someone might try:

```sql
-- Incorrect approach for multi-word names
SELECT user_id,
       UPPER(LEFT(name, 1)) + LOWER(SUBSTRING(name, 2, LEN(name))) as name
FROM Users
ORDER BY user_id;
```

This would fail for "joHn sMith" because it would produce "John smith" (only the first word gets properly capitalized). The "smith" part would have lowercase 's' instead of uppercase.

Another naive approach might involve complex nested string operations without using proper string functions, which would be error-prone and difficult to maintain. The real issue is recognizing that we need to split the name into words, capitalize each word separately, then recombine them.

## Optimal Solution

The optimal solution uses SQL string functions to:

1. Split the name into individual words
2. Capitalize the first letter of each word
3. Make the rest of each word lowercase
4. Recombine the words with spaces

We'll use a combination of `SUBSTRING`, `UPPER`, `LOWER`, and `LEN` functions. For splitting and recombining words, we can use a recursive approach or leverage string functions available in specific SQL dialects. Here's the standard approach that works across most SQL implementations:

<div class="code-group">

```sql
-- MySQL Solution
-- Time: O(n * m) where n is number of rows, m is average words per name
-- Space: O(1) additional space
SELECT
    user_id,
    -- CONCAT_WS handles joining words with spaces
    CONCAT_WS(' ',
        -- Capitalize each word: first letter uppercase, rest lowercase
        CONCAT(UPPER(SUBSTRING(SUBSTRING_INDEX(name, ' ', 1), 1, 1)),
               LOWER(SUBSTRING(SUBSTRING_INDEX(name, ' ', 1), 2))),
        -- Handle second word if it exists
        IF(LOCATE(' ', name) > 0,
           CONCAT(UPPER(SUBSTRING(SUBSTRING_INDEX(name, ' ', -1), 1, 1)),
                  LOWER(SUBSTRING(SUBSTRING_INDEX(name, ' ', -1), 2))),
           '')
    ) as name
FROM Users
ORDER BY user_id;
```

```sql
-- SQL Server Solution
-- Time: O(n * m) where n is number of rows, m is average words per name
-- Space: O(1) additional space
SELECT
    user_id,
    -- STRING_AGG combines the capitalized words
    (SELECT STRING_AGG(
        -- Capitalize each word
        UPPER(LEFT(value, 1)) + LOWER(SUBSTRING(value, 2, LEN(value))),
        ' '
    ) FROM STRING_SPLIT(name, ' ')) as name
FROM Users
ORDER BY user_id;
```

```sql
-- PostgreSQL Solution
-- Time: O(n * m) where n is number of rows, m is average words per name
-- Space: O(1) additional space
SELECT
    user_id,
    -- INITCAP does exactly what we need in PostgreSQL
    INITCAP(name) as name
FROM Users
ORDER BY user_id;
```

</div>

Since different SQL dialects have different functions, let me show the most portable solution that works across most systems (assuming names have at most 2 words, which is common for this problem):

<div class="code-group">

```sql
-- Portable SQL Solution (works in MySQL, SQL Server, PostgreSQL, etc.)
-- Time: O(n) where n is number of rows
-- Space: O(1) additional space
SELECT
    user_id,
    -- Handle first word: capitalize first letter, lowercase the rest
    CONCAT(
        UPPER(SUBSTRING(name, 1, 1)),  -- First character uppercase
        LOWER(SUBSTRING(name, 2,
            CASE
                -- Find position of space or end of string
                WHEN LOCATE(' ', name) > 0 THEN LOCATE(' ', name) - 1
                ELSE LENGTH(name)
            END
        ))
    )
    -- Add second word if it exists
    CASE
        WHEN LOCATE(' ', name) > 0 THEN
            CONCAT(' ',
                UPPER(SUBSTRING(name, LOCATE(' ', name) + 1, 1)),  -- First char of second word
                LOWER(SUBSTRING(name, LOCATE(' ', name) + 2))      -- Rest of second word
            )
        ELSE ''
    END as name
FROM Users
ORDER BY user_id;
```

</div>

For a cleaner solution that handles any number of words, here's an approach using a recursive CTE (Common Table Expression):

<div class="code-group">

```sql
-- Recursive CTE Solution (handles any number of words)
-- Time: O(n * m) where n is number of rows, m is average words per name
-- Space: O(m) for the recursion stack
WITH RECURSIVE split_words AS (
    -- Base case: first word
    SELECT
        user_id,
        name,
        1 as word_num,
        SUBSTRING_INDEX(name, ' ', 1) as word,
        LENGTH(SUBSTRING_INDEX(name, ' ', 1)) as word_len
    FROM Users

    UNION ALL

    -- Recursive case: subsequent words
    SELECT
        sw.user_id,
        sw.name,
        sw.word_num + 1,
        SUBSTRING_INDEX(SUBSTRING_INDEX(sw.name, ' ', sw.word_num + 1), ' ', -1),
        LENGTH(SUBSTRING_INDEX(SUBSTRING_INDEX(sw.name, ' ', sw.word_num + 1), ' ', -1))
    FROM split_words sw
    WHERE sw.word_num < LENGTH(sw.name) - LENGTH(REPLACE(sw.name, ' ', '')) + 1
),
capitalized_words AS (
    SELECT
        user_id,
        word_num,
        -- Capitalize the word: first letter uppercase, rest lowercase
        CONCAT(
            UPPER(SUBSTRING(word, 1, 1)),
            LOWER(SUBSTRING(word, 2))
        ) as capitalized_word
    FROM split_words
)
SELECT
    user_id,
    -- Combine all words for each user
    GROUP_CONCAT(capitalized_word ORDER BY word_num SEPARATOR ' ') as name
FROM capitalized_words
GROUP BY user_id
ORDER BY user_id;
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m) where n is the number of rows in the table and m is the average number of words per name. Each name needs to be processed word by word. For the simple solution that assumes at most 2 words, this simplifies to O(n).

**Space Complexity:** O(1) for the simple solutions that don't create intermediate tables. For the recursive CTE solution, it's O(m) where m is the maximum number of words in any name, due to the recursion stack.

The dominant factor is the string manipulation operations which are generally O(k) where k is the length of the string being processed. Since we process each character of each name once, the total time is proportional to the total number of characters across all names.

## Common Mistakes

1. **Not handling multiple words correctly**: The most common mistake is applying capitalization to the entire string instead of each word separately. For "joHn sMith", `UPPER(name[0]) + LOWER(name[1:])` gives "John smith" instead of "John Smith".

2. **Forgetting the ORDER BY clause**: The problem requires results ordered by user_id. While not always explicitly stated in the output requirements, it's good practice to include ORDER BY when the problem mentions it.

3. **Incorrect string indexing**: SQL string functions often use 1-based indexing (unlike many programming languages which use 0-based indexing). Using 0 as the starting position in `SUBSTRING()` will give unexpected results.

4. **Not handling single-character names**: Names like "A" or "b" need special care. When using `SUBSTRING(name, 2)`, if the name has only one character, this might return an empty string or cause an error depending on the SQL dialect.

5. **Case sensitivity issues with string comparison**: When checking for spaces or other characters, remember that some SQL implementations might have case-sensitive string comparisons in certain collations.

## When You'll See This Pattern

This pattern of string manipulation and transformation appears in various database problems:

1. **1517. Find Users With Valid E-Mails**: Similar string parsing and validation using SQL functions.
2. **1667. Fix Names in a Table**: This is the exact same problem.
3. **1873. Calculate Special Bonus**: Uses CASE statements with string conditions.
4. **196. Delete Duplicate Emails**: While not about string manipulation, it uses similar SQL thinking patterns for data transformation.

The core technique of using built-in string functions (`SUBSTRING`, `UPPER`, `LOWER`, `CONCAT`) for data cleaning and formatting is essential for many real-world database tasks like data migration, report generation, and data validation.

## Key Takeaways

1. **SQL has powerful string functions**: Learn the string manipulation functions available in your SQL dialect. Common ones include `SUBSTRING()`, `UPPER()`, `LOWER()`, `CONCAT()`, `LENGTH()`, and `REPLACE()`.

2. **Always consider edge cases**: For string problems, think about empty strings, single characters, multiple words, and extra whitespace. Test your solution with various inputs.

3. **Break down complex transformations**: When faced with a complex string transformation, break it into steps: split, transform each part, then recombine. This modular thinking helps solve many string manipulation problems.

4. **Know your SQL dialect's special functions**: Some dialects have helpful functions like `INITCAP()` in PostgreSQL or `STRING_SPLIT()` in SQL Server that can simplify your solution.

[Practice this problem on CodeJeet](/problem/fix-names-in-a-table)
