---
title: "How to Solve Patients With a Condition — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Patients With a Condition. Easy difficulty, 38.8% acceptance rate. Topics: Database."
date: "2027-07-05"
category: "dsa-patterns"
tags: ["patients-with-a-condition", "database", "easy"]
---

# How to Solve Patients With a Condition

This problem asks us to filter a `Patients` table to find patients who have a specific condition in their `conditions` field. The challenge comes from the fact that conditions are stored as a space-separated string, and we need to find patients where "DIAB1" appears as a standalone condition—not as part of another condition like "ADIAB100". This requires careful string matching rather than simple substring searching.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this data:

| patient_id | patient_name | conditions    |
| ---------- | ------------ | ------------- |
| 1          | Daniel       | YFEV COUGH    |
| 2          | Alice        | DIAB1 MYOP    |
| 3          | Bob          | ACUTE DIAB100 |
| 4          | George       | ACNE DIAB100  |
| 5          | Alain        | DIAB201       |

We want patients with condition "DIAB1". Let's examine each row:

1. **Patient 1 (Daniel)**: Conditions = "YFEV COUGH"
   - No "DIAB1" anywhere → ❌ Not selected

2. **Patient 2 (Alice)**: Conditions = "DIAB1 MYOP"
   - Split into ["DIAB1", "MYOP"]
   - "DIAB1" appears as the first condition → ✅ Selected

3. **Patient 3 (Bob)**: Conditions = "ACUTE DIAB100"
   - Split into ["ACUTE", "DIAB100"]
   - "DIAB100" contains "DIAB1" but isn't exactly "DIAB1" → ❌ Not selected
   - This is the key distinction: we need exact word match

4. **Patient 4 (George)**: Conditions = "ACNE DIAB100"
   - Similar to Bob → ❌ Not selected

5. **Patient 5 (Alain)**: Conditions = "DIAB201"
   - Contains "DIAB2" not "DIAB1" → ❌ Not selected

The correct result should only include patient 2 (Alice). The tricky part is ensuring we don't match "DIAB100" or "ADIAB1" where "DIAB1" appears as part of a larger word.

## Brute Force Approach

A naive approach would be to use `LIKE '%DIAB1%'` which searches for the substring "DIAB1" anywhere in the conditions string. Let's see why this fails:

```sql
-- INCORRECT SOLUTION
SELECT * FROM Patients
WHERE conditions LIKE '%DIAB1%';
```

This would incorrectly select:

- Patient 2: "DIAB1 MYOP" ✓ (correct)
- Patient 3: "ACUTE DIAB100" ✗ (incorrect - matches "DIAB1" within "DIAB100")
- Patient 4: "ACNE DIAB100" ✗ (incorrect - same issue)

The problem is that `LIKE '%DIAB1%'` doesn't respect word boundaries. It matches "DIAB1" anywhere in the string, including as part of longer words.

Another naive approach might try to split the string in the WHERE clause, but standard SQL doesn't have a straightforward way to split and check array membership in a single query without creating functions.

## Optimal Solution

The correct solution uses word boundary patterns. We need to ensure "DIAB1" appears as a complete word, not as part of another word. There are two effective approaches:

**Approach 1: Using REGEXP with word boundaries**  
We can use regular expressions to match "DIAB1" as a standalone word. The pattern `\\bDIAB1\\b` ensures "DIAB1" has word boundaries on both sides.

**Approach 2: Using LIKE with space patterns**  
Since conditions are space-separated, we can check for:

1. "DIAB1" at the start of the string: `conditions LIKE 'DIAB1 %'`
2. "DIAB1" in the middle: `conditions LIKE '% DIAB1 %'`
3. "DIAB1" at the end: `conditions LIKE '% DIAB1'`

We need to combine all three cases with OR.

Here's the complete solution using both approaches:

<div class="code-group">

```sql
/*
Approach 1: Using REGEXP (Cleaner)
Time: O(n) where n is number of rows (database scans all rows)
Space: O(1) (no additional storage)
*/
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions REGEXP '\\bDIAB1\\b';
-- \\b represents word boundary in regular expressions
-- This matches "DIAB1" only when it appears as a complete word
```

```sql
/*
Approach 2: Using LIKE with multiple patterns (More portable)
Time: O(n)
Space: O(1)
*/
SELECT patient_id, patient_name, conditions
FROM Patients
WHERE conditions LIKE 'DIAB1 %'    -- Case 1: "DIAB1" at beginning
   OR conditions LIKE '% DIAB1 %'  -- Case 2: "DIAB1" in middle
   OR conditions LIKE '% DIAB1';   -- Case 3: "DIAB1" at end

-- Note: We need all three cases because:
-- 1. "DIAB1 %" catches "DIAB1 MYOP"
-- 2. "% DIAB1 %" catches "ACUTE DIAB1 MYOP"
-- 3. "% DIAB1" catches "ACUTE DIAB1"
```

</div>

**Why both approaches work:**

- **REGEXP approach**: The `\\b` (word boundary) anchor ensures "DIAB1" is preceded and followed by either a non-word character (space, start/end of string) or nothing. This handles all edge cases automatically.
- **LIKE approach**: We manually check all possible positions where "DIAB1" could appear as a complete word. The space characters act as natural word separators.

## Complexity Analysis

**Time Complexity: O(n)**

- Where `n` is the number of rows in the Patients table
- The database must scan each row and apply the pattern matching
- Pattern matching (REGEXP or LIKE) on each string takes O(m) where m is string length, but since m is typically small and constant, we simplify to O(n)

**Space Complexity: O(1)**

- No additional data structures are created
- The query returns a subset of existing rows without creating intermediate tables (in most database implementations)

## Common Mistakes

1. **Using `LIKE '%DIAB1%'` without word boundaries**
   - This is the most common mistake (38.8% acceptance rate suggests many make this error)
   - **Why it's wrong**: Matches "DIAB100", "ADIAB1", etc.
   - **How to avoid**: Always consider whether you need exact word matching vs substring matching

2. **Forgetting the case where "DIAB1" is the only condition**
   - If you only use `LIKE '% DIAB1 %'`, you'll miss patients with just "DIAB1" as their condition
   - **Solution**: Include `conditions = 'DIAB1'` or use `LIKE '% DIAB1'` which matches end of string

3. **Not handling the beginning-of-string case**
   - If you use `LIKE '% DIAB1 %' OR conditions LIKE '% DIAB1'`, you'll miss "DIAB1 MYOP"
   - **Solution**: Always check all three positions: beginning, middle, and end

4. **Assuming conditions are always separated by single spaces**
   - While the problem states conditions are space-separated, real data might have multiple spaces
   - **Solution**: Use REGEXP with `\\s` (whitespace) or trim spaces first, though for this problem, single space assumption is safe

## When You'll See This Pattern

This pattern of **exact word matching in delimited strings** appears in various database and string manipulation problems:

1. **LeetCode 1517: Find Users With Valid E-Mails**
   - Similar pattern: Need to validate email format using REGEXP with specific patterns
   - Both require understanding of regular expressions for string validation

2. **LeetCode 1527: Patients With a Condition** (this problem)
   - Direct application of word boundary matching in database queries

3. **LeetCode 1484: Group Sold Products By The Date**
   - Involves string aggregation and manipulation, though less focused on pattern matching
   - Teaches how to work with comma-separated values in SQL

4. **Real-world scenarios**:
   - Searching tags or categories stored as delimited strings
   - Filtering log entries for specific error codes
   - Validating formatted data (phone numbers, IDs, codes)

## Key Takeaways

1. **Word boundaries matter**: When searching for complete words in delimited strings, always consider whether you need `LIKE '%word%'` (substring) or word-boundary matching. The difference is critical.

2. **SQL pattern matching options**: Know when to use:
   - `LIKE` for simple patterns with `%` and `_`
   - `REGEXP`/`RLIKE` for complex patterns with word boundaries (`\\b`), character classes, etc.
   - Different databases may use `REGEXP`, `RLIKE`, or `~` for regular expressions

3. **Test edge cases**: Always test:
   - Word at the beginning of string
   - Word at the end of string
   - Word as the only element
   - Words that contain the target as a substring
   - Multiple occurrences of the word

[Practice this problem on CodeJeet](/problem/patients-with-a-condition)
