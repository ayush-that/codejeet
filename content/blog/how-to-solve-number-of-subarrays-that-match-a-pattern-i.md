---
title: "How to Solve Number of Subarrays That Match a Pattern I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Subarrays That Match a Pattern I. Medium difficulty, 68.4% acceptance rate. Topics: Array, Rolling Hash, String Matching, Hash Function."
date: "2029-02-02"
category: "dsa-patterns"
tags:
  [
    "number-of-subarrays-that-match-a-pattern-i",
    "array",
    "rolling-hash",
    "string-matching",
    "medium",
  ]
---

# How to Solve Number of Subarrays That Match a Pattern I

This problem asks us to count how many subarrays of length `m+1` in `nums` match a given pattern array. The pattern consists of -1, 0, and 1, where -1 means the next element should be less than the current one, 0 means equal, and 1 means greater. What makes this tricky is that we need to efficiently compare relationships between consecutive elements rather than exact values, and we need to check many overlapping subarrays.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
nums = [1, 4, 4, 1, 2, 3]
pattern = [1, 0, -1]
m = 3 (pattern length)
```

We need to find subarrays of length `m+1 = 4` that match the pattern. Let's examine each possible starting index:

**Starting at i=0**: nums[0..3] = [1, 4, 4, 1]

- Compare nums[0] and nums[1]: 1 < 4 → relationship = 1 (matches pattern[0]=1 ✓)
- Compare nums[1] and nums[2]: 4 = 4 → relationship = 0 (matches pattern[1]=0 ✓)
- Compare nums[2] and nums[3]: 4 > 1 → relationship = -1 (matches pattern[2]=-1 ✓)
  ✅ This subarray matches!

**Starting at i=1**: nums[1..4] = [4, 4, 1, 2]

- 4 = 4 → relationship = 0 (but pattern[0]=1 ✗)
  ❌ Fails immediately

**Starting at i=2**: nums[2..5] = [4, 1, 2, 3]

- 4 > 1 → relationship = -1 (but pattern[0]=1 ✗)
  ❌ Fails immediately

So for this example, the answer is 1.

The key insight: we need to check relationships between consecutive elements, not the values themselves. This is similar to string matching problems where we compare patterns of relationships rather than exact characters.

## Brute Force Approach

The most straightforward solution is to check every possible starting position `i` from `0` to `n - m - 1`, and for each one, compare the relationships between consecutive elements in the subarray with the pattern.

**Algorithm:**

1. For each starting index `i` from 0 to `n - m - 1`:
2. For each pattern index `k` from 0 to `m - 1`:
3. Compare `nums[i+k]` and `nums[i+k+1]` to get their relationship
4. If any relationship doesn't match `pattern[k]`, break and move to next `i`
5. If all relationships match, increment count

**Why it's too slow:**

- Time complexity: O(n × m) where n is nums length and m is pattern length
- For each of O(n) starting positions, we do O(m) comparisons
- In the worst case (n=1000, m=100), that's 100,000 operations
- While this might pass for small inputs, it's inefficient and won't scale well

<div class="code-group">

```python
# Time: O(n × m) | Space: O(1)
def countMatchingSubarrays(nums, pattern):
    n = len(nums)
    m = len(pattern)
    count = 0

    # Check each possible starting position
    for i in range(n - m):
        match = True

        # Check each element in the pattern
        for k in range(m):
            # Get relationship between consecutive elements
            if nums[i + k] < nums[i + k + 1]:
                rel = 1
            elif nums[i + k] > nums[i + k + 1]:
                rel = -1
            else:
                rel = 0

            # Compare with pattern
            if rel != pattern[k]:
                match = False
                break

        if match:
            count += 1

    return count
```

```javascript
// Time: O(n × m) | Space: O(1)
function countMatchingSubarrays(nums, pattern) {
  const n = nums.length;
  const m = pattern.length;
  let count = 0;

  // Check each possible starting position
  for (let i = 0; i <= n - m - 1; i++) {
    let match = true;

    // Check each element in the pattern
    for (let k = 0; k < m; k++) {
      // Get relationship between consecutive elements
      let rel;
      if (nums[i + k] < nums[i + k + 1]) {
        rel = 1;
      } else if (nums[i + k] > nums[i + k + 1]) {
        rel = -1;
      } else {
        rel = 0;
      }

      // Compare with pattern
      if (rel !== pattern[k]) {
        match = false;
        break;
      }
    }

    if (match) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n × m) | Space: O(1)
public int countMatchingSubarrays(int[] nums, int[] pattern) {
    int n = nums.length;
    int m = pattern.length;
    int count = 0;

    // Check each possible starting position
    for (int i = 0; i <= n - m - 1; i++) {
        boolean match = true;

        // Check each element in the pattern
        for (int k = 0; k < m; k++) {
            // Get relationship between consecutive elements
            int rel;
            if (nums[i + k] < nums[i + k + 1]) {
                rel = 1;
            } else if (nums[i + k] > nums[i + k + 1]) {
                rel = -1;
            } else {
                rel = 0;
            }

            // Compare with pattern
            if (rel != pattern[k]) {
                match = false;
                break;
            }
        }

        if (match) {
            count++;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can precompute all relationships between consecutive elements in `nums` once, then treat this as a string matching problem. Here's the step-by-step reasoning:

1. **Convert relationships to a comparable form**: First, create an array `rels` where `rels[i]` represents the relationship between `nums[i]` and `nums[i+1]` (1 for <, 0 for =, -1 for >).

2. **Now we have a pattern matching problem**: We need to find all occurrences of `pattern` in `rels`. The pattern has length `m`, and `rels` has length `n-1`.

3. **Use efficient string matching**: We can use the KMP (Knuth-Morris-Pratt) algorithm which finds all pattern occurrences in O(n + m) time. KMP is perfect here because:
   - It handles the case where we need to find all matches
   - It's efficient for patterns of any length
   - It doesn't require backtracking in the text (rels array)

4. **How KMP works for this problem**:
   - Build a "prefix function" (also called LPS - Longest Prefix Suffix) for the pattern
   - Use this function to avoid re-checking characters when a mismatch occurs
   - Scan through `rels` once, using the prefix function to know where to continue matching after mismatches

## Optimal Solution

Here's the complete solution using the KMP algorithm:

<div class="code-group">

```python
# Time: O(n + m) | Space: O(m)
def countMatchingSubarrays(nums, pattern):
    n = len(nums)
    m = len(pattern)

    # Step 1: Convert nums to relationship array
    # Compare each pair of consecutive elements
    rels = [0] * (n - 1)
    for i in range(n - 1):
        if nums[i] < nums[i + 1]:
            rels[i] = 1
        elif nums[i] > nums[i + 1]:
            rels[i] = -1
        else:
            rels[i] = 0

    # Step 2: Build prefix function (LPS) for pattern
    # lps[i] = length of longest proper prefix that is also suffix in pattern[0..i]
    lps = [0] * m
    length = 0  # Length of previous longest prefix suffix
    i = 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                # Fall back to previous longest prefix
                length = lps[length - 1]
            else:
                # No matching prefix
                lps[i] = 0
                i += 1

    # Step 3: Use KMP to find pattern in rels
    count = 0
    i = 0  # Index for rels
    j = 0  # Index for pattern

    while i < len(rels):
        if pattern[j] == rels[i]:
            i += 1
            j += 1

            # Found a complete match
            if j == m:
                count += 1
                # Use LPS to continue searching for more matches
                j = lps[j - 1]
        else:
            # Mismatch after j matches
            if j != 0:
                # Use LPS to skip unnecessary comparisons
                j = lps[j - 1]
            else:
                # No match at all, move to next character in rels
                i += 1

    return count
```

```javascript
// Time: O(n + m) | Space: O(m)
function countMatchingSubarrays(nums, pattern) {
  const n = nums.length;
  const m = pattern.length;

  // Step 1: Convert nums to relationship array
  const rels = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    if (nums[i] < nums[i + 1]) {
      rels[i] = 1;
    } else if (nums[i] > nums[i + 1]) {
      rels[i] = -1;
    } else {
      rels[i] = 0;
    }
  }

  // Step 2: Build prefix function (LPS) for pattern
  const lps = new Array(m).fill(0);
  let length = 0; // Length of previous longest prefix suffix
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        // Fall back to previous longest prefix
        length = lps[length - 1];
      } else {
        // No matching prefix
        lps[i] = 0;
        i++;
      }
    }
  }

  // Step 3: Use KMP to find pattern in rels
  let count = 0;
  i = 0; // Index for rels
  let j = 0; // Index for pattern

  while (i < rels.length) {
    if (pattern[j] === rels[i]) {
      i++;
      j++;

      // Found a complete match
      if (j === m) {
        count++;
        // Use LPS to continue searching for more matches
        j = lps[j - 1];
      }
    } else {
      // Mismatch after j matches
      if (j !== 0) {
        // Use LPS to skip unnecessary comparisons
        j = lps[j - 1];
      } else {
        // No match at all, move to next character in rels
        i++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n + m) | Space: O(m)
public int countMatchingSubarrays(int[] nums, int[] pattern) {
    int n = nums.length;
    int m = pattern.length;

    // Step 1: Convert nums to relationship array
    int[] rels = new int[n - 1];
    for (int i = 0; i < n - 1; i++) {
        if (nums[i] < nums[i + 1]) {
            rels[i] = 1;
        } else if (nums[i] > nums[i + 1]) {
            rels[i] = -1;
        } else {
            rels[i] = 0;
        }
    }

    // Step 2: Build prefix function (LPS) for pattern
    int[] lps = new int[m];
    int length = 0;  // Length of previous longest prefix suffix
    int i = 1;

    while (i < m) {
        if (pattern[i] == pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                // Fall back to previous longest prefix
                length = lps[length - 1];
            } else {
                // No matching prefix
                lps[i] = 0;
                i++;
            }
        }
    }

    // Step 3: Use KMP to find pattern in rels
    int count = 0;
    i = 0;  // Index for rels
    int j = 0;  // Index for pattern

    while (i < rels.length) {
        if (pattern[j] == rels[i]) {
            i++;
            j++;

            // Found a complete match
            if (j == m) {
                count++;
                // Use LPS to continue searching for more matches
                j = lps[j - 1];
            }
        } else {
            // Mismatch after j matches
            if (j != 0) {
                // Use LPS to skip unnecessary comparisons
                j = lps[j - 1];
            } else {
                // No match at all, move to next character in rels
                i++;
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the relationship array: O(n) - we iterate through nums once
- Building the LPS array: O(m) - we process each pattern element once
- KMP search: O(n) - we process each relationship once without backtracking
- Total: O(n + m), which is linear in the input size

**Space Complexity: O(m)**

- We store the LPS array of size m
- We store the relationship array of size n-1, but this could be optimized to O(1) by computing relationships on the fly during KMP
- The pattern itself takes O(m) space
- Total: O(m) for the algorithm itself, plus input storage

## Common Mistakes

1. **Off-by-one errors in subarray length**: Remember that a subarray matching a pattern of length m must have m+1 elements. A common mistake is using `n - m` instead of `n - m - 1` as the upper bound for the starting index.

2. **Incorrect relationship calculation**: Mixing up the mapping between comparisons and pattern values. Remember:
   - `nums[i] < nums[i+1]` → relationship = 1 (pattern expects 1)
   - `nums[i] > nums[i+1]` → relationship = -1 (pattern expects -1)
   - `nums[i] == nums[i+1]` → relationship = 0 (pattern expects 0)

3. **Forgetting to handle edge cases**:
   - When `n <= m`: no subarray can match (return 0)
   - When `m == 0`: pattern of length 0 matches any subarray of length 1, so answer is n
   - When all elements are equal: all relationships are 0

4. **Inefficient KMP implementation**: The tricky part of KMP is building the LPS array correctly. Common errors include:
   - Not resetting `length` properly when there's a mismatch
   - Incorrectly updating indices in the LPS construction loop
   - Forgetting to use `lps[j-1]` when a complete match is found

## When You'll See This Pattern

This problem combines two important patterns:

1. **Relationship-based comparison**: Problems where you compare relationships (greater than, less than, equal) rather than exact values appear in:
   - **Find the Index of the First Occurrence in a String (LeetCode 28)**: Exact string matching
   - **Repeated DNA Sequences (LeetCode 187)**: Finding repeating patterns
   - **Detect Pattern of Length M Repeated K or More Times (LeetCode 1566)**: Finding repeating patterns in arrays

2. **KMP/Pattern Matching**: The KMP algorithm is useful for:
   - **Implement strStr() (LeetCode 28)**: The classic string matching problem
   - **Repeated Substring Pattern (LeetCode 459)**: Checking if a string can be formed by repeating a substring
   - **Shortest Palindrome (LeetCode 214)**: Finding the longest palindrome prefix

The core insight is recognizing when a problem can be reduced to pattern matching. Whenever you need to find occurrences of one sequence within another, especially when the sequences represent relationships or transformations of the original data, consider KMP or other string matching algorithms.

## Key Takeaways

1. **Transform before comparing**: When you need to match patterns based on relationships between elements (not the elements themselves), first transform the data into a comparable form. Here, we converted number comparisons to -1/0/1 values.

2. **Recognize string matching in disguise**: Many array problems are actually string matching problems in disguise. If you're looking for a specific pattern or sequence within a larger array, consider using efficient string matching algorithms like KMP, Rabin-Karp, or Boyer-Moore.

3. **KMP is your friend for pattern matching**: The KMP algorithm provides O(n+m) pattern matching by using preprocessing to avoid redundant comparisons. Remember the two-phase approach: 1) Build LPS array for the pattern, 2) Use LPS to efficiently search the text.

Related problems: [Count the Number of Incremovable Subarrays I](/problem/count-the-number-of-incremovable-subarrays-i)
