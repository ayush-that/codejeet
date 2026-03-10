---
title: "How to Solve Coupon Code Validator — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Coupon Code Validator. Easy difficulty, 65.0% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2027-01-21"
category: "dsa-patterns"
tags: ["coupon-code-validator", "array", "hash-table", "string", "easy"]
---

# How to Solve Coupon Code Validator

This problem asks us to validate a list of coupons by checking for duplicates. We're given three parallel arrays describing `n` coupons: their unique code, business line, and active status. A coupon is considered **valid** if it's the **first occurrence** of that specific `(code, businessLine)` combination where `isActive` is `true`. All other occurrences of the same combination should be marked invalid. The tricky part is that we need to track both the code AND business line together as a unique identifier, and we must respect the order of first occurrence while ignoring inactive coupons entirely.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
code = ["A", "B", "A", "C", "B"]
businessLine = ["Retail", "Food", "Retail", "Retail", "Food"]
isActive = [true, false, true, true, true]
```

**Step-by-step validation:**

1. **Coupon 0:** `("A", "Retail")`, active = `true`
   - First time seeing this combination
   - Mark as **valid** ✅
   - Record that we've seen `("A", "Retail")`

2. **Coupon 1:** `("B", "Food")`, active = `false`
   - Coupon is inactive
   - Mark as **invalid** ❌ (inactive coupons are always invalid)
   - Do NOT record this combination (inactive coupons don't count as first occurrence)

3. **Coupon 2:** `("A", "Retail")`, active = `true`
   - We've already seen `("A", "Retail")` from coupon 0
   - Mark as **invalid** ❌ (duplicate of first valid occurrence)

4. **Coupon 3:** `("C", "Retail")`, active = `true`
   - First time seeing this combination
   - Mark as **valid** ✅
   - Record that we've seen `("C", "Retail")`

5. **Coupon 4:** `("B", "Food")`, active = `true`
   - We haven't seen `("B", "Food")` as a valid coupon yet (coupon 1 was inactive)
   - Mark as **valid** ✅
   - Record that we've seen `("B", "Food")`

**Output:** `[true, false, false, true, true]`

The key insight: inactive coupons are always invalid AND they don't prevent later active coupons with the same combination from being valid.

## Brute Force Approach

A naive approach would be to check each coupon against all previous coupons:

For each coupon `i`:

1. If `isActive[i]` is false, mark invalid
2. Otherwise, check all previous coupons `j` from `0` to `i-1`:
   - If `code[i] == code[j]` AND `businessLine[i] == businessLine[j]` AND `isActive[j]` is true
   - Then this is a duplicate → mark invalid
3. If no such `j` found, mark valid

**Why this fails:**

- Time complexity: O(n²) - for each of n coupons, we check up to n-1 previous coupons
- With n up to 10⁵ (typical constraint), this would be ~10¹⁰ operations → far too slow
- We're repeatedly checking the same combinations against each other

The brute force helps us understand the problem but isn't practical for large inputs. We need a way to track seen combinations in constant time.

## Optimal Solution

The optimal solution uses a hash set to track which `(code, businessLine)` combinations we've already seen as valid coupons. We iterate through the coupons once, building our result array as we go.

**Key insights:**

1. Inactive coupons are always invalid
2. Only active coupons can be "first occurrences"
3. We need to track the combination of both code AND business line
4. Order matters - the first valid occurrence of a combination wins

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def validateCoupons(code, businessLine, isActive):
    """
    Validates coupons based on first occurrence of active (code, businessLine) pairs.

    Args:
        code: List of coupon codes
        businessLine: List of business categories
        isActive: List of boolean activation statuses

    Returns:
        List of booleans indicating valid (True) or invalid (False) coupons
    """
    n = len(code)
    result = [False] * n  # Initialize all as invalid
    seen = set()  # Track seen (code, businessLine) combinations from ACTIVE coupons

    for i in range(n):
        # Step 1: Check if coupon is inactive
        if not isActive[i]:
            # Inactive coupons are always invalid
            result[i] = False
            continue

        # Step 2: Create a unique key from code and businessLine
        key = (code[i], businessLine[i])

        # Step 3: Check if we've seen this combination before in an active coupon
        if key in seen:
            # Duplicate of a previously seen valid coupon
            result[i] = False
        else:
            # First time seeing this active combination
            result[i] = True
            seen.add(key)  # Mark this combination as seen

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function validateCoupons(code, businessLine, isActive) {
  /**
   * Validates coupons based on first occurrence of active (code, businessLine) pairs.
   *
   * @param {string[]} code - Array of coupon codes
   * @param {string[]} businessLine - Array of business categories
   * @param {boolean[]} isActive - Array of activation statuses
   * @return {boolean[]} - Array indicating valid (true) or invalid (false) coupons
   */
  const n = code.length;
  const result = new Array(n).fill(false); // Initialize all as invalid
  const seen = new Set(); // Track seen combinations from ACTIVE coupons

  for (let i = 0; i < n; i++) {
    // Step 1: Check if coupon is inactive
    if (!isActive[i]) {
      // Inactive coupons are always invalid
      result[i] = false;
      continue;
    }

    // Step 2: Create a unique key from code and businessLine
    const key = `${code[i]}|${businessLine[i]}`;

    // Step 3: Check if we've seen this combination before in an active coupon
    if (seen.has(key)) {
      // Duplicate of a previously seen valid coupon
      result[i] = false;
    } else {
      // First time seeing this active combination
      result[i] = true;
      seen.add(key); // Mark this combination as seen
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

public class Solution {
    public boolean[] validateCoupons(String[] code, String[] businessLine, boolean[] isActive) {
        /**
         * Validates coupons based on first occurrence of active (code, businessLine) pairs.
         *
         * @param code - Array of coupon codes
         * @param businessLine - Array of business categories
         * @param isActive - Array of activation statuses
         * @return - Array indicating valid (true) or invalid (false) coupons
         */
        int n = code.length;
        boolean[] result = new boolean[n]; // Initialize all as false (invalid)
        Set<String> seen = new HashSet<>(); // Track seen combinations from ACTIVE coupons

        for (int i = 0; i < n; i++) {
            // Step 1: Check if coupon is inactive
            if (!isActive[i]) {
                // Inactive coupons are always invalid
                result[i] = false;
                continue;
            }

            // Step 2: Create a unique key from code and businessLine
            String key = code[i] + "|" + businessLine[i];

            // Step 3: Check if we've seen this combination before in an active coupon
            if (seen.contains(key)) {
                // Duplicate of a previously seen valid coupon
                result[i] = false;
            } else {
                // First time seeing this active combination
                result[i] = true;
                seen.add(key); // Mark this combination as seen
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all `n` coupons exactly once
- Each iteration performs constant-time operations:
  - Boolean check for `isActive`
  - String concatenation (or tuple creation) for the key
  - Hash set lookup and insertion (O(1) average case)
- Total: O(n) operations

**Space Complexity: O(n)**

- Output array: O(n) to store the result for each coupon
- Hash set: In worst case, all coupons could be unique and active → O(n) entries
- String keys: Each key combines two strings, but we're already storing the original strings in input
- Total: O(n) additional space

The space complexity is optimal because we need to return an array of size `n`, and we need some way to track seen combinations.

## Common Mistakes

1. **Forgetting that inactive coupons don't count toward "first occurrence"**
   - Mistake: Adding inactive coupons to the seen set
   - Consequence: Later active coupons with same combination incorrectly marked invalid
   - Fix: Only add to `seen` set when `isActive` is true AND it's the first occurrence

2. **Using separate tracking for code and businessLine**
   - Mistake: Tracking codes and business lines independently in separate sets
   - Consequence: `("A", "Retail")` and `("A", "Food")` incorrectly treated as duplicates
   - Fix: Always combine code and businessLine into a single key

3. **Not handling the delimiter in key creation properly**
   - Mistake: Simple concatenation like `code + businessLine` without separator
   - Consequence: `("AB", "C")` and `("A", "BC")` both become `"ABC"` → false duplicates
   - Fix: Use a delimiter that won't appear in the strings, or use a tuple/object

4. **Initializing result array incorrectly**
   - Mistake: Starting with all `true` then marking duplicates as `false`
   - Consequence: Inactive coupons incorrectly marked as valid
   - Fix: Start with all `false`, only mark as `true` when conditions are met

## When You'll See This Pattern

This problem uses the **"first unique occurrence"** pattern with hash sets for O(1) lookups. You'll see similar patterns in:

1. **First Unique Character in a String (LeetCode 387)**
   - Find the first non-repeating character
   - Similar pattern: Track counts in first pass, find first with count=1 in second pass
   - Both use hash maps/sets to track occurrences

2. **Two Sum (LeetCode 1)**
   - Find two numbers that add to target
   - Uses hash map to track seen numbers for O(1) lookups
   - Similar "seen before" checking pattern

3. **Contains Duplicate (LeetCode 217)**
   - Check if array contains duplicates
   - Uses hash set to track seen elements
   - Simpler version of our problem (no additional conditions like `isActive`)

4. **Logger Rate Limiter (LeetCode 359)**
   - Should print message only if not printed in last 10 seconds
   - Uses hash map to track last printed timestamp
   - Similar "has this been seen before (recently)?" logic

## Key Takeaways

1. **Hash sets are perfect for tracking "have I seen this before?" problems**
   - When you need O(1) lookups to check for duplicates or previous occurrences
   - Always consider what makes an item "unique" for your key

2. **Multiple conditions require careful ordering of checks**
   - In this problem: check `isActive` first, then check for duplicates
   - The order matters because inactive coupons shouldn't affect the seen set
   - Write conditions in the order they should short-circuit

3. **Real-world validation logic often has subtle rules**
   - Business rules like "inactive doesn't count as first occurrence" are common
   - Always clarify edge cases before coding
   - Test with examples that exercise all rule combinations

[Practice this problem on CodeJeet](/problem/coupon-code-validator)
