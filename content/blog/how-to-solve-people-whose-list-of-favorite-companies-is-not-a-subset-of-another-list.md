---
title: "How to Solve People Whose List of Favorite Companies Is Not a Subset of Another List — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode People Whose List of Favorite Companies Is Not a Subset of Another List. Medium difficulty, 60.5% acceptance rate. Topics: Array, Hash Table, String."
date: "2029-02-11"
category: "dsa-patterns"
tags:
  [
    "people-whose-list-of-favorite-companies-is-not-a-subset-of-another-list",
    "array",
    "hash-table",
    "string",
    "medium",
  ]
---

# How to Solve "People Whose List of Favorite Companies Is Not a Subset of Another List"

This problem asks us to identify which people have favorite company lists that aren't subsets of any other person's list. The challenge comes from efficiently checking subset relationships between lists of strings — a naive approach would be far too slow for the maximum constraints.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
favoriteCompanies = [
    ["leetcode","google","facebook"],
    ["google","microsoft"],
    ["google","facebook"],
    ["google"],
    ["amazon"]
]
```

**Step-by-step reasoning:**

1. **Person 0**: `["leetcode","google","facebook"]`
   - Check if it's a subset of Person 1: `["google","microsoft"]` → No (missing "leetcode", "facebook")
   - Person 2: `["google","facebook"]` → No (missing "leetcode")
   - Person 3: `["google"]` → No (missing "leetcode", "facebook")
   - Person 4: `["amazon"]` → No (completely different)
   - Not a subset of anyone → **Include Person 0**

2. **Person 1**: `["google","microsoft"]`
   - Person 0: `["leetcode","google","facebook"]` → No (missing "microsoft")
   - Person 2: `["google","facebook"]` → No (missing "microsoft")
   - Person 3: `["google"]` → No (missing "microsoft")
   - Person 4: `["amazon"]` → No
   - Not a subset of anyone → **Include Person 1**

3. **Person 2**: `["google","facebook"]`
   - Person 0: `["leetcode","google","facebook"]` → Yes! All of Person 2's companies are in Person 0's list
   - Since it's a subset of Person 0, we **exclude Person 2**

4. **Person 3**: `["google"]`
   - Person 0: `["leetcode","google","facebook"]` → Yes (subset)
   - Already found to be a subset → **Exclude Person 3**

5. **Person 4**: `["amazon"]`
   - Check all others → Not a subset of anyone
   - **Include Person 4**

**Output:** `[0, 1, 4]`

The key insight: We need to efficiently check if one set is a subset of another. Converting lists to sets gives us O(1) membership checks, but we still need to compare each person against all others.

## Brute Force Approach

The most straightforward approach is to compare every person's list against every other person's list:

1. Convert each list to a set for faster membership checks
2. For each person i, check if their set is a subset of any other person j's set (where i ≠ j)
3. If person i is not a subset of anyone, add their index to the result

**Why this is problematic:**

- With n people, we have O(n²) comparisons
- Each subset check takes O(k) where k is the size of the smaller set
- Worst case: O(n² × m) where m is the average list length
- For n=100 and m=500, that's 100×100×500 = 5,000,000 operations (might pass)
- But constraints could be larger, and we can do better

## Optimized Approach

The key optimization comes from two observations:

1. **Sorting by list length**: If list A is a subset of list B, then A must be shorter or equal in length to B. By processing people from longest to shortest lists, we only need to check if a person's list is a subset of **longer or equal length** lists that we've already processed.

2. **Using bitmasks for faster subset checks**: Instead of storing strings, we can map each unique company to a bit position. Then checking if set A ⊆ set B becomes checking if `(bitmask_A & bitmask_B) == bitmask_A`, which is an O(1) operation!

**Step-by-step reasoning:**

1. Create a mapping from company names to unique indices
2. Convert each person's list to a bitmask (integer where bit i is 1 if the person likes company i)
3. Sort people by the number of companies they like (descending)
4. For each person (starting with longest list), check if their bitmask is a subset of any previously processed person's bitmask
5. If not, add them to the result

This reduces the complexity significantly because:

- We only compare against people with longer or equal lists
- Each comparison is O(1) instead of O(m)
- The mapping step is O(total_companies) which is manageable

## Optimal Solution

Here's the complete implementation using the bitmask optimization:

<div class="code-group">

```python
# Time: O(n * m + n^2) where n = number of people, m = total companies
# Space: O(n + m) for the bitmasks and company mapping
def peopleIndexes(favoriteCompanies):
    """
    Returns indices of people whose favorite companies list
    is not a subset of any other person's list.
    """
    # Step 1: Create mapping from company names to unique indices
    company_to_id = {}
    company_id = 0

    # First pass: assign unique IDs to all companies
    for companies in favoriteCompanies:
        for company in companies:
            if company not in company_to_id:
                company_to_id[company] = company_id
                company_id += 1

    # Step 2: Convert each person's list to a bitmask
    bitmasks = []
    for companies in favoriteCompanies:
        mask = 0
        for company in companies:
            # Set the bit corresponding to this company
            mask |= 1 << company_to_id[company]
        bitmasks.append(mask)

    # Step 3: Create list of (index, bitmask, length) tuples
    people = []
    for i, mask in enumerate(bitmasks):
        # Count number of set bits (companies) in the mask
        length = bin(mask).count('1')
        people.append((i, mask, length))

    # Step 4: Sort by length descending (longest lists first)
    people.sort(key=lambda x: x[2], reverse=True)

    # Step 5: Find people whose lists are not subsets
    result = []

    for i in range(len(people)):
        idx_i, mask_i, len_i = people[i]
        is_subset = False

        # Only check against people with longer or equal lists
        # (who come before us in the sorted list)
        for j in range(i):
            idx_j, mask_j, len_j = people[j]

            # Check if mask_i is a subset of mask_j
            # This is true if all bits set in mask_i are also set in mask_j
            if (mask_i & mask_j) == mask_i:
                is_subset = True
                break  # No need to check further

        if not is_subset:
            result.append(idx_i)

    # Step 6: Sort result to match expected output order
    result.sort()
    return result
```

```javascript
// Time: O(n * m + n^2) where n = number of people, m = total companies
// Space: O(n + m) for the bitmasks and company mapping
function peopleIndexes(favoriteCompanies) {
  // Step 1: Create mapping from company names to unique indices
  const companyToId = new Map();
  let companyId = 0;

  // First pass: assign unique IDs to all companies
  for (const companies of favoriteCompanies) {
    for (const company of companies) {
      if (!companyToId.has(company)) {
        companyToId.set(company, companyId);
        companyId++;
      }
    }
  }

  // Step 2: Convert each person's list to a bitmask
  const bitmasks = [];
  for (const companies of favoriteCompanies) {
    let mask = 0;
    for (const company of companies) {
      // Set the bit corresponding to this company
      const id = companyToId.get(company);
      mask |= 1 << id;
    }
    bitmasks.push(mask);
  }

  // Step 3: Create array of objects with index, bitmask, and length
  const people = [];
  for (let i = 0; i < bitmasks.length; i++) {
    const mask = bitmasks[i];
    // Count number of set bits (companies) in the mask
    const length = countBits(mask);
    people.push({ index: i, mask: mask, length: length });
  }

  // Helper function to count bits in an integer
  function countBits(n) {
    let count = 0;
    while (n > 0) {
      count += n & 1;
      n >>= 1;
    }
    return count;
  }

  // Step 4: Sort by length descending (longest lists first)
  people.sort((a, b) => b.length - a.length);

  // Step 5: Find people whose lists are not subsets
  const result = [];

  for (let i = 0; i < people.length; i++) {
    const { index: idxI, mask: maskI } = people[i];
    let isSubset = false;

    // Only check against people with longer or equal lists
    // (who come before us in the sorted list)
    for (let j = 0; j < i; j++) {
      const { mask: maskJ } = people[j];

      // Check if maskI is a subset of maskJ
      // This is true if all bits set in maskI are also set in maskJ
      if ((maskI & maskJ) === maskI) {
        isSubset = true;
        break; // No need to check further
      }
    }

    if (!isSubset) {
      result.push(idxI);
    }
  }

  // Step 6: Sort result to match expected output order
  result.sort((a, b) => a - b);
  return result;
}
```

```java
// Time: O(n * m + n^2) where n = number of people, m = total companies
// Space: O(n + m) for the bitmasks and company mapping
import java.util.*;

public List<Integer> peopleIndexes(List<List<String>> favoriteCompanies) {
    // Step 1: Create mapping from company names to unique indices
    Map<String, Integer> companyToId = new HashMap<>();
    int companyId = 0;

    // First pass: assign unique IDs to all companies
    for (List<String> companies : favoriteCompanies) {
        for (String company : companies) {
            if (!companyToId.containsKey(company)) {
                companyToId.put(company, companyId);
                companyId++;
            }
        }
    }

    // Step 2: Convert each person's list to a bitmask
    long[] bitmasks = new long[favoriteCompanies.size()];
    // Use long to handle up to 64 companies; for more, use BitSet
    for (int i = 0; i < favoriteCompanies.size(); i++) {
        long mask = 0;
        for (String company : favoriteCompanies.get(i)) {
            // Set the bit corresponding to this company
            int id = companyToId.get(company);
            mask |= (1L << id);
        }
        bitmasks[i] = mask;
    }

    // Step 3: Create list of Person objects
    List<Person> people = new ArrayList<>();
    for (int i = 0; i < bitmasks.length; i++) {
        long mask = bitmasks[i];
        int length = Long.bitCount(mask);  // Count set bits
        people.add(new Person(i, mask, length));
    }

    // Step 4: Sort by length descending (longest lists first)
    Collections.sort(people, (a, b) -> b.length - a.length);

    // Step 5: Find people whose lists are not subsets
    List<Integer> result = new ArrayList<>();

    for (int i = 0; i < people.size(); i++) {
        Person p1 = people.get(i);
        boolean isSubset = false;

        // Only check against people with longer or equal lists
        for (int j = 0; j < i; j++) {
            Person p2 = people.get(j);

            // Check if p1.mask is a subset of p2.mask
            // This is true if all bits set in p1.mask are also set in p2.mask
            if ((p1.mask & p2.mask) == p1.mask) {
                isSubset = true;
                break;  // No need to check further
            }
        }

        if (!isSubset) {
            result.add(p1.index);
        }
    }

    // Step 6: Sort result to match expected output order
    Collections.sort(result);
    return result;
}

// Helper class to store person information
class Person {
    int index;
    long mask;
    int length;

    Person(int index, long mask, int length) {
        this.index = index;
        this.mask = mask;
        this.length = length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

1. Building company mapping: O(n × m) where n = number of people, m = average companies per person
2. Creating bitmasks: O(n × m)
3. Sorting people by list length: O(n log n)
4. Checking subsets: O(n²) in worst case, but each check is O(1) bitwise operation

Total: **O(n × m + n²)** in practice, which is much better than the brute force O(n² × m).

**Space Complexity:**

1. Company mapping: O(total unique companies)
2. Bitmasks: O(n)
3. Sorted people list: O(n)

Total: **O(n + m)** where m is the number of unique companies.

## Common Mistakes

1. **Not handling duplicate companies within a list**: The problem states "list of favorites" but doesn't explicitly forbid duplicates. Always convert to sets first or handle duplicates in your bitmask creation.

2. **Forgetting to sort the result**: The problem expects indices in ascending order. After finding which people to include, you must sort the result list.

3. **Using integer bitmasks for more than 64 companies**: In languages with fixed-width integers, if there are more than 64 unique companies, you'll need to use a different approach like `BitSet` in Java or arrays of integers. Always check constraints!

4. **Incorrect subset check**: The condition `(A & B) == A` checks if A is a subset of B. A common mistake is using `(A & B) == B` which checks if B is a subset of A.

5. **Not optimizing with sorting by length**: Without sorting by length first, you'd need to check every pair (i, j) where i ≠ j, resulting in more comparisons. The length-based optimization cuts this roughly in half.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask representation of sets**: Used when you have small, discrete elements and need fast set operations. See also:
   - [LeetCode 78: Subsets](https://leetcode.com/problems/subsets/) - Generating all subsets using bitmasks
   - [LeetCode 136: Single Number](https://leetcode.com/problems/single-number/) - Using XOR with bit manipulation
   - [LeetCode 187: Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/) - Encoding sequences as bitmasks

2. **Subset checking optimization**: The technique of sorting by size to reduce comparisons appears in:
   - [LeetCode 416: Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) - Dynamic programming with optimization
   - Problems involving comparing multiple sets or sequences

3. **Efficient set operations**: Converting to sets/bitmasks for O(1) membership checks is common in:
   - [LeetCode 349: Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)
   - [LeetCode 128: Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)

## Key Takeaways

1. **Bitmasks are powerful for small sets**: When dealing with sets of up to ~64 elements, bitmask representation gives you O(1) subset, union, and intersection operations.

2. **Sorting can reduce comparisons**: When checking "is A a subset of B," you know A must be no larger than B. Sorting by size lets you skip many unnecessary checks.

3. **Map strings to integers for efficiency**: String comparisons are expensive. Mapping unique strings to integers once at the beginning makes all subsequent operations faster.

4. **Always consider edge cases**: Empty lists, duplicate entries, maximum constraints, and output ordering matter in interview settings.

[Practice this problem on CodeJeet](/problem/people-whose-list-of-favorite-companies-is-not-a-subset-of-another-list)
