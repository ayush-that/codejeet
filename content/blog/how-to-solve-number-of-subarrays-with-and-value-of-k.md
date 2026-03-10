---
title: "How to Solve Number of Subarrays With AND Value of K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Subarrays With AND Value of K. Hard difficulty, 35.0% acceptance rate. Topics: Array, Binary Search, Bit Manipulation, Segment Tree."
date: "2026-03-04"
category: "dsa-patterns"
tags:
  ["number-of-subarrays-with-and-value-of-k", "array", "binary-search", "bit-manipulation", "hard"]
---

## How to Solve Number of Subarrays With AND Value of K

This problem asks us to count all subarrays where the bitwise AND of all elements equals exactly `k`. What makes this tricky is that AND is a non-monotonic operation—adding more elements to a subarray can only keep the same value or reduce it (since each bit can only go from 1 to 0, never back to 1). This property is key to solving it efficiently.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3, 4]`, `k = 2`.

**Step 1: Understanding AND behavior**

- AND of a subarray can only stay the same or decrease as we extend it rightward
- Once AND becomes less than `k`, it can never become `k` again by adding more elements
- If AND equals `k`, we have a valid subarray

**Step 2: Manual counting**
Let's check all subarrays:

- `[1]`: AND = 1 ≠ 2
- `[1,2]`: AND = 1 & 2 = 0 ≠ 2
- `[1,2,3]`: AND = 0 & 3 = 0 ≠ 2
- `[1,2,3,4]`: AND = 0 & 4 = 0 ≠ 2
- `[2]`: AND = 2 = 2 ✓
- `[2,3]`: AND = 2 & 3 = 2 ✓
- `[2,3,4]`: AND = 2 & 3 & 4 = 0 ≠ 2
- `[3]`: AND = 3 ≠ 2
- `[3,4]`: AND = 3 & 4 = 0 ≠ 2
- `[4]`: AND = 4 ≠ 2

Total valid subarrays: 2 (`[2]` and `[2,3]`)

The key insight: When we fix a right endpoint, we need to find left endpoints where the AND from left to right equals `k`. Since AND can only decrease, there will be at most 32 distinct AND values for any fixed right endpoint (one for each bit position that gets cleared).

## Brute Force Approach

The brute force checks every possible subarray:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def bruteForce(nums, k):
    n = len(nums)
    count = 0

    # Check every possible subarray
    for i in range(n):
        current_and = nums[i]
        for j in range(i, n):
            if i == j:
                current_and = nums[i]
            else:
                current_and &= nums[j]

            if current_and == k:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function bruteForce(nums, k) {
  let count = 0;
  const n = nums.length;

  // Check every possible subarray
  for (let i = 0; i < n; i++) {
    let currentAnd = nums[i];
    for (let j = i; j < n; j++) {
      if (i === j) {
        currentAnd = nums[i];
      } else {
        currentAnd &= nums[j];
      }

      if (currentAnd === k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int bruteForce(int[] nums, int k) {
    int count = 0;
    int n = nums.length;

    // Check every possible subarray
    for (int i = 0; i < n; i++) {
        int currentAnd = nums[i];
        for (int j = i; j < n; j++) {
            if (i == j) {
                currentAnd = nums[i];
            } else {
                currentAnd &= nums[j];
            }

            if (currentAnd == k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With `n` up to 10⁵, O(n²) is far too slow (10¹⁰ operations). We need to leverage the property that AND values change at most 32 times for any fixed right endpoint.

## Optimized Approach

The key insight: For a fixed right endpoint `r`, as we move leftwards from `r`, the AND value changes at most 32 times (once for each bit that gets cleared). We can maintain these distinct AND values and their counts efficiently.

**Step-by-step reasoning:**

1. For each position `r` as right endpoint, maintain a list of unique AND values from subarrays ending at `r`
2. Each new element `nums[r]` creates new AND values by AND-ing with previous values
3. Since AND can only clear bits, we get at most 32 distinct values
4. Count how many subarrays ending at `r` have AND equal to `k`
5. Use a hashmap to store (AND value → count) for the current position

**Why this works:**

- When we process `nums[r]`, we take all AND values from position `r-1` and AND them with `nums[r]`
- Duplicate values will appear—we sum their counts
- We also start a new subarray `[r, r]` with value `nums[r]`
- For each AND value equal to `k`, we add its count to our answer

## Optimal Solution

<div class="code-group">

```python
# Time: O(32n) ≈ O(n) | Space: O(32) ≈ O(1)
def countSubarrays(nums, k):
    """
    Count subarrays where bitwise AND equals k.

    Approach:
    1. Track all distinct AND values ending at current position
    2. For each new element, compute new AND values with previous ones
    3. Since AND can only clear bits, at most 32 distinct values exist
    4. Count occurrences where AND equals k
    """
    total_count = 0
    # Store (AND value -> count) for subarrays ending at previous position
    prev_and_counts = {}

    for num in nums:
        # Current AND values for subarrays ending at this position
        curr_and_counts = {}

        # Start new subarray with just current element
        curr_and_counts[num] = curr_and_counts.get(num, 0) + 1

        # Combine with all AND values from previous position
        for prev_and, count in prev_and_counts.items():
            new_and = prev_and & num
            curr_and_counts[new_and] = curr_and_counts.get(new_and, 0) + count

        # Count subarrays ending here with AND = k
        total_count += curr_and_counts.get(k, 0)

        # Update for next iteration
        prev_and_counts = curr_and_counts

    return total_count
```

```javascript
// Time: O(32n) ≈ O(n) | Space: O(32) ≈ O(1)
function countSubarrays(nums, k) {
  /**
   * Count subarrays where bitwise AND equals k.
   *
   * Approach:
   * 1. Track all distinct AND values ending at current position
   * 2. For each new element, compute new AND values with previous ones
   * 3. Since AND can only clear bits, at most 32 distinct values exist
   * 4. Count occurrences where AND equals k
   */
  let totalCount = 0;
  // Store {AND value: count} for subarrays ending at previous position
  let prevAndCounts = new Map();

  for (const num of nums) {
    // Current AND values for subarrays ending at this position
    const currAndCounts = new Map();

    // Start new subarray with just current element
    currAndCounts.set(num, (currAndCounts.get(num) || 0) + 1);

    // Combine with all AND values from previous position
    for (const [prevAnd, count] of prevAndCounts) {
      const newAnd = prevAnd & num;
      currAndCounts.set(newAnd, (currAndCounts.get(newAnd) || 0) + count);
    }

    // Count subarrays ending here with AND = k
    totalCount += currAndCounts.get(k) || 0;

    // Update for next iteration
    prevAndCounts = currAndCounts;
  }

  return totalCount;
}
```

```java
// Time: O(32n) ≈ O(n) | Space: O(32) ≈ O(1)
public int countSubarrays(int[] nums, int k) {
    /**
     * Count subarrays where bitwise AND equals k.
     *
     * Approach:
     * 1. Track all distinct AND values ending at current position
     * 2. For each new element, compute new AND values with previous ones
     * 3. Since AND can only clear bits, at most 32 distinct values exist
     * 4. Count occurrences where AND equals k
     */
    int totalCount = 0;
    // Store (AND value -> count) for subarrays ending at previous position
    Map<Integer, Integer> prevAndCounts = new HashMap<>();

    for (int num : nums) {
        // Current AND values for subarrays ending at this position
        Map<Integer, Integer> currAndCounts = new HashMap<>();

        // Start new subarray with just current element
        currAndCounts.put(num, currAndCounts.getOrDefault(num, 0) + 1);

        // Combine with all AND values from previous position
        for (Map.Entry<Integer, Integer> entry : prevAndCounts.entrySet()) {
            int prevAnd = entry.getKey();
            int count = entry.getValue();
            int newAnd = prevAnd & num;
            currAndCounts.put(newAnd, currAndCounts.getOrDefault(newAnd, 0) + count);
        }

        // Count subarrays ending here with AND = k
        totalCount += currAndCounts.getOrDefault(k, 0);

        // Update for next iteration
        prevAndCounts = currAndCounts;
    }

    return totalCount;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(32n) ≈ O(n)

- For each of the n elements, we process at most 32 distinct AND values from the previous position
- The constant 32 comes from the number of bits in integers (assuming 32-bit integers)
- Even with 64-bit integers, it would be O(64n) ≈ O(n)

**Space Complexity:** O(32) ≈ O(1)

- We store at most 32 distinct AND values at any time
- The hashmap size is bounded by the number of possible distinct AND values

## Common Mistakes

1. **Using brute force O(n²) approach:** Candidates often start with checking all subarrays, not realizing the constraints make this impossible. Always check constraints first—here n ≤ 10⁵ means O(n²) is impossible.

2. **Forgetting that AND can only decrease:** This is the key property that limits distinct values to at most 32. Without this insight, you might try to track all possible subarrays.

3. **Not handling k = 0 correctly:** When k = 0, many subarrays will qualify. The algorithm still works because we count all subarrays with AND = 0. Some candidates mistakenly think they need special handling.

4. **Incorrectly updating the AND counts:** Each iteration, we must:
   - Start with the new element alone
   - Combine with all previous AND values
   - Sum counts for duplicate AND values
     Forgetting to sum counts leads to undercounting subarrays.

## When You'll See This Pattern

This "limited distinct values due to bit operations" pattern appears in several problems:

1. **Subarray ORs (LeetCode 898):** Similar concept but with OR instead of AND. OR can only increase or stay the same, also limiting distinct values.

2. **Bitwise AND of Numbers Range (LeetCode 201):** While not about subarrays, it uses the property that AND clears bits from the right, creating a common prefix.

3. **Maximum AND Value of Pair in an Array (GeeksforGeeks):** Uses bit properties to efficiently find maximum AND pair.

The core pattern: When a bitwise operation (AND, OR, XOR) has monotonic properties or limited distinct outcomes, you can often achieve O(n) or O(n log max_value) solutions instead of O(n²).

## Key Takeaways

1. **Bitwise operations often have monotonic properties:** AND can only decrease, OR can only increase. This limits the number of distinct values you need to track.

2. **For subarray problems with bit operations:** Consider fixing the right endpoint and track all possible values for subarrays ending at that point. The number of distinct values is often logarithmic in the input range.

3. **Always check constraints first:** When n ≤ 10⁵, O(n²) is impossible. Look for properties that can reduce the search space, like the limited distinct AND values here.

[Practice this problem on CodeJeet](/problem/number-of-subarrays-with-and-value-of-k)
