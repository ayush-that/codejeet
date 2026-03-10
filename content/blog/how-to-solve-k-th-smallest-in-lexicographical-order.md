---
title: "How to Solve K-th Smallest in Lexicographical Order — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode K-th Smallest in Lexicographical Order. Hard difficulty, 46.2% acceptance rate. Topics: Trie."
date: "2026-06-04"
category: "dsa-patterns"
tags: ["k-th-smallest-in-lexicographical-order", "trie", "hard"]
---

# How to Solve K-th Smallest in Lexicographical Order

Finding the k-th smallest integer in lexicographical order from 1 to n sounds deceptively simple, but it's actually a challenging problem that requires thinking about numbers as strings and navigating a virtual trie structure. The tricky part is that we can't actually generate all n numbers (which could be up to 10^9) and sort them as strings - that would be far too slow. Instead, we need to count how many numbers fall under each "prefix" without explicitly generating them.

## Visual Walkthrough

Let's trace through a concrete example: `n = 13, k = 2`. We want the 2nd smallest number when numbers 1-13 are sorted lexicographically (like dictionary order).

First, let's list all numbers 1-13 in lexicographical order:

1. 1
2. 10
3. 11
4. 12
5. 13
6. 2
7. 3
8. 4
9. 5
10. 6
11. 7
12. 8
13. 9

So the answer should be 10. But how do we find this efficiently without generating all numbers?

Think of the numbers as forming a virtual trie (prefix tree). Starting from the root, we have branches 1-9 (since numbers can't start with 0). From each node, we can append digits 0-9 to form longer numbers.

The key insight: We can navigate this trie level by level. Starting with prefix = 1, we count how many numbers in [1, n] have prefix "1" (including 1, 10, 11, 12, 13). That's 5 numbers. Since k = 2 ≤ 5, we know our answer starts with "1". We then go deeper: prefix = 10, and repeat.

If k were 6, we'd find that prefix "1" covers only 5 numbers, so we'd move to prefix "2" and look for the (6-5) = 1st number starting with "2".

## Brute Force Approach

The most straightforward approach would be:

1. Generate all numbers from 1 to n
2. Convert each to a string
3. Sort the strings lexicographically
4. Return the k-th element converted back to integer

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def findKthNumber_brute(n, k):
    # Convert all numbers to strings
    nums_as_strings = [str(i) for i in range(1, n + 1)]

    # Sort lexicographically
    nums_as_strings.sort()

    # Convert the k-th string back to integer
    return int(nums_as_strings[k - 1])
```

```javascript
// Time: O(n log n) | Space: O(n)
function findKthNumberBrute(n, k) {
  // Generate array of numbers as strings
  const numsAsStrings = [];
  for (let i = 1; i <= n; i++) {
    numsAsStrings.push(i.toString());
  }

  // Sort lexicographically
  numsAsStrings.sort();

  // Convert k-th element back to number
  return parseInt(numsAsStrings[k - 1]);
}
```

```java
// Time: O(n log n) | Space: O(n)
public int findKthNumberBrute(int n, int k) {
    // Create list of number strings
    List<String> numsAsStrings = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        numsAsStrings.add(Integer.toString(i));
    }

    // Sort lexicographically
    Collections.sort(numsAsStrings);

    // Convert k-th string back to integer
    return Integer.parseInt(numsAsStrings.get(k - 1));
}
```

</div>

**Why this fails:** With n up to 10^9, we can't possibly store n strings in memory (O(n) space), and sorting them would take O(n log n) time, which is completely infeasible. We need a solution that works in logarithmic time relative to n.

## Optimized Approach

The optimal solution uses a **virtual trie traversal** approach. Here's the step-by-step reasoning:

1. **Think in prefixes**: Instead of generating all numbers, we work with prefixes. Starting with an empty prefix, we decide which digit to append next.

2. **Counting numbers with a given prefix**: For a prefix `p`, we need to count how many numbers ≤ n have prefix `p`. For example, with prefix "1" and n=13, the numbers are: 1, 10, 11, 12, 13. We can count these efficiently by:
   - Starting with `first = p` and `last = p`
   - While `first ≤ n`, multiply both by 10 to get the next level
   - Count = min(last, n) - first + 1

3. **Navigating the trie**:
   - If the count of numbers with current prefix ≥ k, our answer has this prefix. Go deeper by appending 0 (multiply by 10).
   - If count < k, skip this entire subtree. Move to next prefix (add 1 to current prefix) and reduce k by the count we skipped.

4. **Termination**: When k becomes 1, we've found our answer - it's the current prefix.

This is essentially a depth-first search in the virtual trie, but instead of visiting each node, we use counting to skip entire subtrees when possible.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log² n) | Space: O(1)
def findKthNumber(n, k):
    """
    Find the k-th smallest number in lexicographical order from 1 to n.

    The key insight is to think of numbers as forming a virtual trie.
    We navigate this trie by counting how many numbers exist under each prefix.
    """

    def count_numbers_with_prefix(prefix, n):
        """
        Count how many numbers in [1, n] have the given prefix.

        For prefix p, the numbers are: p, p0, p1, ..., p9, p00, p01, ...
        We count them level by level until we exceed n.
        """
        count = 0
        first = prefix
        last = prefix

        # While we're still within bounds
        while first <= n:
            # Count numbers at current level: min(last, n) - first + 1
            # We use min(last, n) because last might exceed n
            count += min(last, n) - first + 1

            # Move to next level: append digits 0-9
            first *= 10      # First number at next level: p0
            last = last * 10 + 9  # Last number at next level: p9

        return count

    # Start with the first number
    current = 1
    # Adjust k since we're starting at 1
    k -= 1

    # Navigate through the virtual trie
    while k > 0:
        # Count how many numbers are under the current prefix
        count = count_numbers_with_prefix(current, n)

        if count <= k:
            # Skip the entire subtree under current prefix
            # Move to next sibling in the trie
            current += 1
            k -= count
        else:
            # Our answer is in the subtree of current prefix
            # Go one level deeper (append 0)
            current *= 10
            k -= 1

    return current
```

```javascript
// Time: O(log² n) | Space: O(1)
function findKthNumber(n, k) {
  /**
   * Count how many numbers in [1, n] have the given prefix.
   *
   * For example, with prefix 1 and n=13:
   * Level 0: 1 (1 number)
   * Level 1: 10, 11, 12, 13 (4 numbers)
   * Total: 5 numbers
   */
  const countNumbersWithPrefix = (prefix, n) => {
    let count = 0;
    let first = prefix;
    let last = prefix;

    // Count numbers level by level
    while (first <= n) {
      // Add count for current level
      count += Math.min(last, n) - first + 1;

      // Move to next level
      first *= 10; // First number at next level
      last = last * 10 + 9; // Last number at next level
    }

    return count;
  };

  let current = 1; // Start from the smallest number
  k -= 1; // Convert to 0-based index for easier calculation

  // Navigate the virtual trie
  while (k > 0) {
    // Count numbers under current prefix
    const count = countNumbersWithPrefix(current, n);

    if (count <= k) {
      // Skip entire subtree, move to next sibling
      current += 1;
      k -= count;
    } else {
      // Go deeper into current subtree
      current *= 10;
      k -= 1;
    }
  }

  return current;
}
```

```java
// Time: O(log² n) | Space: O(1)
public int findKthNumber(int n, int k) {
    /**
     * Count numbers in [1, n] with given prefix.
     * Works by examining each level of the virtual trie.
     */
    private long countNumbersWithPrefix(long prefix, long n) {
        long count = 0;
        long first = prefix;
        long last = prefix;

        // Count level by level until we exceed n
        while (first <= n) {
            // Add numbers at current level
            count += Math.min(last, n) - first + 1;

            // Move to next level
            first *= 10;
            last = last * 10 + 9;
        }

        return count;
    }

    long current = 1;  // Use long to avoid overflow
    k -= 1;            // Work with 0-based k for easier math

    // Navigate through the virtual trie
    while (k > 0) {
        long count = countNumbersWithPrefix(current, n);

        if (count <= k) {
            // Skip entire subtree under current
            current += 1;
            k -= count;
        } else {
            // Go deeper into current subtree
            current *= 10;
            k -= 1;
        }
    }

    return (int) current;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log² n)**

- The `count_numbers_with_prefix` function runs in O(log n) time because in each iteration we multiply by 10, so we do at most log₁₀(n) iterations.
- In the main loop, we might traverse O(log n) levels of the trie (each time either going deeper or moving to a sibling).
- Multiplying these gives us O(log n × log n) = O(log² n).

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables like `current`, `k`, and temporary variables in the counting function.
- No recursion or data structures that grow with input size.

## Common Mistakes

1. **Integer overflow in counting**: When n is large (up to 10^9), multiplying by 10 can quickly exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C) for intermediate calculations in the counting function.

2. **Off-by-one errors in counting**: The formula `min(last, n) - first + 1` is crucial. Forgetting the `+1` will undercount by exactly 1 at each level. Test with small examples like n=13, prefix=1 to verify your counting is correct.

3. **Incorrect termination condition**: The loop should continue while `k > 0`, not `k > 1`. Since we start with `k -= 1` to convert to 0-based indexing, when k becomes 0, we've found our answer. Some implementations incorrectly use `while k > 1` with 1-based k, which can fail on edge cases.

4. **Not handling the case when last exceeds n**: In the counting function, using `last - first + 1` without the `min(last, n)` will overcount when the last number in a level exceeds n. Always cap `last` at `n`.

## When You'll See This Pattern

This "virtual trie traversal with counting" pattern appears in several problems where you need to find the k-th element in some lexicographical ordering without explicitly generating all elements:

1. **Lexicographical Numbers (LeetCode 386)**: List all numbers from 1 to n in lexicographical order. This is essentially the same problem but asking for all numbers instead of just the k-th.

2. **K-th Smallest Number in Multiplication Table (LeetCode 668)**: While not exactly the same, it uses a similar "counting then navigating" approach to find the k-th element in a sorted structure without explicitly building it.

3. **Count Special Integers (LeetCode 2376)**: This problem also deals with counting numbers based on digit constraints and uses similar prefix-based counting techniques.

The core pattern is: when you can't generate all elements, but you can **count** how many elements would be in a certain range or under a certain prefix, you can use counting to navigate to the desired element.

## Key Takeaways

1. **Think in prefixes, not whole numbers**: When dealing with lexicographical order, it's often more efficient to work with prefixes and build the answer digit by digit rather than generating and comparing full numbers.

2. **Counting enables skipping**: If you can efficiently count how many elements satisfy a condition (like having a certain prefix), you can skip entire groups of elements without examining each one individually.

3. **Virtual data structures are powerful**: You don't always need to physically build a trie or tree. If you understand the structure conceptually, you can navigate it using mathematical operations (multiplication, addition) rather than pointer chasing.

Related problems: [Count Special Integers](/problem/count-special-integers)
