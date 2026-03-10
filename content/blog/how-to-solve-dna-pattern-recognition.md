---
title: "How to Solve DNA Pattern Recognition  — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode DNA Pattern Recognition . Medium difficulty, 84.9% acceptance rate. Topics: Database."
date: "2029-10-28"
category: "dsa-patterns"
tags: ["dna-pattern-recognition", "database", "medium"]
---

# How to Solve DNA Pattern Recognition

This problem asks us to analyze DNA sequences to find patterns that appear across multiple species. Given a table of DNA samples with species information, we need to identify DNA sequences that contain a specific pattern (like "ATCG") and count how many _unique_ species have samples containing that pattern. The challenge lies in efficiently searching within text fields and performing accurate deduplication across species.

## Visual Walkthrough

Let's walk through a small example. Suppose our `Samples` table contains:

| sample_id | dna_sequence | species      |
| --------- | ------------ | ------------ |
| 1         | "ATCGGCTA"   | "Human"      |
| 2         | "GGATCGAT"   | "Human"      |
| 3         | "TTATCGAA"   | "Chimpanzee" |
| 4         | "CCCCCCCC"   | "Gorilla"    |

We're looking for the pattern "ATCG". Let's trace what happens:

1. **Sample 1**: "ATCGGCTA" contains "ATCG" starting at position 1 → Human qualifies
2. **Sample 2**: "GGATCGAT" contains "ATCG" starting at position 3 → Human already counted
3. **Sample 3**: "TTATCGAA" contains "ATCG" starting at position 3 → Chimpanzee qualifies
4. **Sample 4**: "CCCCCCCC" doesn't contain "ATCG" → Gorilla doesn't qualify

The key insight: we need to count _unique species_ with _any_ sample containing the pattern. So even though Human appears twice, they only count once. Our final result should show "ATCG" appears in 2 unique species (Human and Chimpanzee).

## Brute Force Approach

A naive approach would be to:

1. Fetch all rows from the table
2. For each row, check if the dna_sequence contains the pattern
3. Collect species from matching rows into a list
4. Remove duplicates from the list
5. Count the unique species

In SQL, a brute force implementation might use a subquery with `LIKE` and then count distinct species:

```sql
SELECT COUNT(DISTINCT species)
FROM Samples
WHERE dna_sequence LIKE '%ATCG%';
```

Wait — this is actually the optimal solution! For database problems, the "brute force" concept works differently than in algorithmic problems. The naive thinking here would be to:

- Download all data to application memory and process it there (inefficient)
- Use complex string parsing functions when simple `LIKE` works
- Forget about the `DISTINCT` keyword and overcount species

The real "brute force" mistake would be writing procedural code to fetch and process each row individually instead of letting the database do what it's optimized for: set-based operations.

## Optimized Approach

The key insight for this problem is recognizing that databases are optimized for pattern matching and aggregation. We need to:

1. **Filter efficiently**: Use the `LIKE` operator with wildcards (`%`) to find sequences containing our pattern. The `%` acts as a wildcard for any characters (0 or more), so `%ATCG%` means "any sequence containing 'ATCG' anywhere".

2. **Count correctly**: Use `COUNT(DISTINCT species)` instead of just `COUNT(species)` to avoid double-counting when the same species has multiple matching samples.

3. **Handle the pattern dynamically**: The problem asks for "ATCG" specifically, so we hardcode that pattern. In a more general version, we might use a parameter.

The database engine will use its internal indexing and optimization to scan the table efficiently. While we can't control the exact algorithm the database uses, we write our query to give the optimizer the best chance to work efficiently.

## Optimal Solution

Here's the complete solution with detailed explanations:

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows (depends on database implementation)
-- Space: O(1) for the query itself, though database uses memory for processing

-- Select the count of unique species that have DNA sequences containing 'ATCG'
SELECT COUNT(DISTINCT species) AS species_count
FROM Samples
-- WHERE clause filters rows: only include samples where dna_sequence contains 'ATCG'
-- The '%' are wildcards: '%ATCG%' means "any characters, then ATCG, then any characters"
WHERE dna_sequence LIKE '%ATCG%';
```

</div>

**Line-by-line explanation:**

1. `SELECT COUNT(DISTINCT species) AS species_count` - This is the core of our solution. `COUNT()` aggregates rows, but `DISTINCT` inside ensures we only count each species once, even if multiple samples from the same species match the pattern. The `AS species_count` gives a clear name to our result column.

2. `FROM Samples` - Specifies the table we're querying. Simple but essential.

3. `WHERE dna_sequence LIKE '%ATCG%'` - The filtering condition. `LIKE` is the pattern matching operator in SQL. The `%` symbols are wildcards that match any sequence of characters (including zero characters). So `%ATCG%` matches any string that contains "ATCG" anywhere within it. This is more efficient than checking every possible substring position manually.

## Complexity Analysis

**Time Complexity**: O(n) in the worst case, where n is the number of rows in the table. The database must scan each row to check the `LIKE` condition. However, modern databases have optimizations:

- Some databases can use indexes on text columns for prefix searches (like `'ATCG%'`), but for `'%ATCG%'` (wildcards on both sides), a full scan is typically needed
- Parallel scanning on multi-core systems
- Early termination if all necessary rows are found

**Space Complexity**: O(k) where k is the number of unique species that match the pattern. The database needs to track which species it has seen to apply the `DISTINCT` operation. In practice, this is minimal compared to the table size.

## Common Mistakes

1. **Forgetting DISTINCT**: Using `COUNT(species)` instead of `COUNT(DISTINCT species)` is the most common error. This would count each matching sample separately, so if Human has 5 samples with "ATCG", it would count as 5 instead of 1.

2. **Incorrect LIKE pattern**:
   - `'ATCG%'` only matches sequences starting with ATCG
   - `'%ATCG'` only matches sequences ending with ATCG
   - `'ATCG'` (no wildcards) only matches sequences that are exactly "ATCG"
     Only `'%ATCG%'` correctly finds the pattern anywhere in the sequence.

3. **Case sensitivity issues**: SQL `LIKE` is typically case-insensitive, but this depends on the database collation. If the problem specified exact case matching, you might need `LIKE BINARY '%ATCG%'` in some databases.

4. **Overcomplicating with string functions**: Some candidates try using `INSTR()`, `POSITION()`, or `SUBSTRING()` functions to manually search for the pattern. While these work, `LIKE` is simpler and more readable for this specific "contains" check.

## When You'll See This Pattern

This problem combines several fundamental SQL patterns that appear frequently:

1. **Pattern matching with LIKE**: Similar to LeetCode 1667 "Fix Names in a Table" where you use `LIKE` or string functions to transform data.

2. **Counting distinct values**: Appears in almost every aggregation problem, like LeetCode 1693 "Daily Leads and Partners" where you count distinct dates or partners.

3. **Filtering before aggregation**: The `WHERE` clause executes before `COUNT()`, which is crucial for performance. This pattern appears in LeetCode 1141 "User Activity for the Past 30 Days" where you filter by date range before counting.

The core technique is understanding SQL's order of operations: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`. Here, we filter in `WHERE`, then aggregate in `SELECT`.

## Key Takeaways

1. **Use the right tool for the job**: Databases excel at set operations. Let the database engine handle filtering and aggregation rather than fetching data to application code.

2. **DISTINCT matters in aggregation**: When counting groups, think carefully about whether you want `COUNT(*)` (all rows), `COUNT(column)` (non-null values), or `COUNT(DISTINCT column)` (unique values).

3. **LIKE wildcards have specific meanings**: `%` matches any sequence of characters, `_` matches exactly one character. For "contains" queries, you need wildcards on both sides.

[Practice this problem on CodeJeet](/problem/dna-pattern-recognition)
