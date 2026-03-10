---
title: "How to Solve Sum of Even Numbers After Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Even Numbers After Queries. Medium difficulty, 68.8% acceptance rate. Topics: Array, Simulation."
date: "2026-08-23"
category: "dsa-patterns"
tags: ["sum-of-even-numbers-after-queries", "array", "simulation", "medium"]
---

# How to Solve Sum of Even Numbers After Queries

You're given an array `nums` and a list of queries where each query adds a value to a specific index in `nums`. After each update, you need to calculate the sum of all even numbers in the array. The challenge is that recalculating the entire sum from scratch for each query would be too slow — the key insight is to maintain a running sum and update it intelligently based on how each query affects the parity of the modified element.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
nums = [1, 2, 3, 4]
queries = [[1, 0], [-3, 1], [-4, 0], [2, 3]]
```

**Initial state:**

- `nums = [1, 2, 3, 4]`
- Even numbers: 2 and 4 → `even_sum = 2 + 4 = 6`

**Query 1: [1, 0]** (add 1 to index 0)

- Before update: `nums[0] = 1` (odd)
- After update: `nums[0] = 1 + 1 = 2` (now even)
- Since an odd became even, we add the new value to `even_sum`
- `even_sum = 6 + 2 = 8`
- `nums = [2, 2, 3, 4]`

**Query 2: [-3, 1]** (subtract 3 from index 1)

- Before update: `nums[1] = 2` (even)
- After update: `nums[1] = 2 - 3 = -1` (now odd)
- Since an even became odd, we subtract the old value from `even_sum`
- `even_sum = 8 - 2 = 6`
- `nums = [2, -1, 3, 4]`

**Query 3: [-4, 0]** (subtract 4 from index 0)

- Before update: `nums[0] = 2` (even)
- After update: `nums[0] = 2 - 4 = -2` (still even)
- Since it remained even, we need to adjust: subtract old value, add new value
- `even_sum = 6 - 2 + (-2) = 2`
- `nums = [-2, -1, 3, 4]`

**Query 4: [2, 3]** (add 2 to index 3)

- Before update: `nums[3] = 4` (even)
- After update: `nums[3] = 4 + 2 = 6` (still even)
- Adjust: `even_sum = 2 - 4 + 6 = 4`
- `nums = [-2, -1, 3, 6]`

**Output:** `[8, 6, 2, 4]`

Notice the pattern: we only need to consider how the query affects the specific element being modified, not the entire array.

## Brute Force Approach

The most straightforward approach is to simulate exactly what the problem asks: for each query, update the array and then scan through all elements to calculate the sum of even values.

**Why this is inefficient:**

- If `n` is the length of `nums` and `m` is the number of queries, the brute force takes O(m × n) time
- For each of the `m` queries, we're doing O(n) work scanning the entire array
- With constraints where both `n` and `m` can be up to 10^4, this becomes 10^8 operations — too slow

**Brute force code (for illustration):**

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m) for the answer array
def sumEvenAfterQueries(nums, queries):
    answer = []

    for val, idx in queries:
        # Apply the query
        nums[idx] += val

        # Calculate sum of even values
        total = 0
        for num in nums:
            if num % 2 == 0:
                total += num

        answer.append(total)

    return answer
```

```javascript
// Time: O(m * n) | Space: O(m) for the answer array
function sumEvenAfterQueries(nums, queries) {
  const answer = [];

  for (const [val, idx] of queries) {
    // Apply the query
    nums[idx] += val;

    // Calculate sum of even values
    let total = 0;
    for (const num of nums) {
      if (num % 2 === 0) {
        total += num;
      }
    }

    answer.push(total);
  }

  return answer;
}
```

```java
// Time: O(m * n) | Space: O(m) for the answer array
public int[] sumEvenAfterQueries(int[] nums, int[][] queries) {
    int[] answer = new int[queries.length];

    for (int i = 0; i < queries.length; i++) {
        int val = queries[i][0];
        int idx = queries[i][1];

        // Apply the query
        nums[idx] += val;

        // Calculate sum of even values
        int total = 0;
        for (int num : nums) {
            if (num % 2 == 0) {
                total += num;
            }
        }

        answer[i] = total;
    }

    return answer;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to recalculate the entire sum from scratch after each query. Instead, we can maintain a running sum of even values and update it based on how each query affects the specific element being modified.

**Step-by-step reasoning:**

1. **Initialize:** Calculate the initial sum of all even numbers in `nums`. This is our starting point.

2. **For each query:**
   - Check the parity (even/odd) of the element **before** the update
   - Check the parity of the element **after** the update
   - There are 4 possible cases:
     - **Even → Even:** The element was even and remains even. We need to adjust the sum: subtract the old value and add the new value (or simply add the difference: `new_val - old_val`)
     - **Even → Odd:** The element was even but becomes odd. Subtract the old (even) value from the sum
     - **Odd → Even:** The element was odd but becomes even. Add the new (even) value to the sum
     - **Odd → Odd:** The element was odd and remains odd. No change to the sum needed

3. **Update the array** and store the result for this query

This approach only requires O(1) work per query after the initial O(n) setup, making it much more efficient.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums), m = len(queries)
# Space: O(m) for the answer array (O(1) extra space besides output)
def sumEvenAfterQueries(nums, queries):
    # Step 1: Calculate initial sum of even numbers
    even_sum = 0
    for num in nums:
        if num % 2 == 0:
            even_sum += num

    # Step 2: Initialize answer array
    answer = []

    # Step 3: Process each query
    for val, idx in queries:
        # Get the original value before update
        original = nums[idx]

        # Calculate the new value after applying the query
        new_val = original + val

        # Update the array
        nums[idx] = new_val

        # Case analysis for updating even_sum:
        if original % 2 == 0:  # Original was even
            if new_val % 2 == 0:  # Still even
                # Adjust: remove old value, add new value
                even_sum += (new_val - original)
            else:  # Became odd
                # Remove the old even value
                even_sum -= original
        else:  # Original was odd
            if new_val % 2 == 0:  # Became even
                # Add the new even value
                even_sum += new_val
            # else: odd -> odd, no change needed

        # Store the result for this query
        answer.append(even_sum)

    return answer
```

```javascript
// Time: O(n + m) where n = nums.length, m = queries.length
// Space: O(m) for the answer array (O(1) extra space besides output)
function sumEvenAfterQueries(nums, queries) {
  // Step 1: Calculate initial sum of even numbers
  let evenSum = 0;
  for (const num of nums) {
    if (num % 2 === 0) {
      evenSum += num;
    }
  }

  // Step 2: Initialize answer array
  const answer = [];

  // Step 3: Process each query
  for (const [val, idx] of queries) {
    // Get the original value before update
    const original = nums[idx];

    // Calculate the new value after applying the query
    const newVal = original + val;

    // Update the array
    nums[idx] = newVal;

    // Case analysis for updating evenSum:
    if (original % 2 === 0) {
      // Original was even
      if (newVal % 2 === 0) {
        // Still even
        // Adjust: remove old value, add new value
        evenSum += newVal - original;
      } else {
        // Became odd
        // Remove the old even value
        evenSum -= original;
      }
    } else {
      // Original was odd
      if (newVal % 2 === 0) {
        // Became even
        // Add the new even value
        evenSum += newVal;
      }
      // odd -> odd: no change needed
    }

    // Store the result for this query
    answer.push(evenSum);
  }

  return answer;
}
```

```java
// Time: O(n + m) where n = nums.length, m = queries.length
// Space: O(m) for the answer array (O(1) extra space besides output)
public int[] sumEvenAfterQueries(int[] nums, int[][] queries) {
    // Step 1: Calculate initial sum of even numbers
    int evenSum = 0;
    for (int num : nums) {
        if (num % 2 == 0) {
            evenSum += num;
        }
    }

    // Step 2: Initialize answer array
    int[] answer = new int[queries.length];

    // Step 3: Process each query
    for (int i = 0; i < queries.length; i++) {
        int val = queries[i][0];
        int idx = queries[i][1];

        // Get the original value before update
        int original = nums[idx];

        // Calculate the new value after applying the query
        int newVal = original + val;

        // Update the array
        nums[idx] = newVal;

        // Case analysis for updating evenSum:
        if (original % 2 == 0) {  // Original was even
            if (newVal % 2 == 0) {  // Still even
                // Adjust: remove old value, add new value
                evenSum += (newVal - original);
            } else {  // Became odd
                // Remove the old even value
                evenSum -= original;
            }
        } else {  // Original was odd
            if (newVal % 2 == 0) {  // Became even
                // Add the new even value
                evenSum += newVal;
            }
            // odd -> odd: no change needed
        }

        // Store the result for this query
        answer[i] = evenSum;
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- **O(n):** Initial pass through `nums` to calculate the starting sum of even numbers
- **O(m):** Processing each query. Each query takes O(1) time since we only examine and update one element
- Total: O(n + m), which is linear in the total input size

**Space Complexity: O(m)**

- We need to store the answer array of length `m`
- The algorithm uses O(1) extra space besides the input and output arrays
- We modify `nums` in place, so no additional space needed for a copy

## Common Mistakes

1. **Forgetting to handle negative numbers correctly with modulo:** In some languages, `-3 % 2` might return `-1` instead of `1`. Always check your language's behavior. A safer approach is to check `num % 2 == 0` for evenness, which works correctly for negatives in most languages.

2. **Updating the array before checking the original value:** You must check whether the original value was even **before** applying the update. If you update first, you lose this information.

3. **Not considering all four parity transition cases:** Candidates sometimes miss one of the four cases (even→even, even→odd, odd→even, odd→odd). Each requires different handling.

4. **Recalculating the entire sum for each query:** This is the brute force approach that leads to O(m × n) time complexity. Interviewers expect you to optimize this.

5. **Off-by-one errors with array indices:** Double-check that you're accessing `nums[idx]` not `nums[i]` when processing queries.

## When You'll See This Pattern

This problem teaches the **"maintain a running aggregate"** pattern, which appears in many optimization problems:

1. **Range Sum Query - Immutable (LeetCode 303):** Similar concept of maintaining prefix sums to answer range queries quickly.

2. **Product of Array Except Self (LeetCode 238):** Uses running products from left and right to avoid recalculating for each position.

3. **Maximum Subarray (LeetCode 53):** Maintains a running sum while tracking the maximum.

4. **Corporate Flight Bookings (LeetCode 1109):** Uses difference arrays to efficiently apply range updates.

The core idea is to avoid redundant calculations by maintaining some state that can be incrementally updated as changes occur, rather than recomputing from scratch.

## Key Takeaways

1. **Look for incremental updates:** When a problem involves repeated queries or updates, consider whether you can maintain a running value that can be adjusted in O(1) time rather than recalculating from scratch.

2. **Analyze state transitions:** Break down what changes between operations. Here, we analyzed the four possible parity transitions (even→even, even→odd, odd→even, odd→odd) to determine how to update our running sum.

3. **Check edge cases with mathematical operations:** Always test your solution with negative numbers, zeros, and boundary values. The behavior of `%` with negatives varies by language.

[Practice this problem on CodeJeet](/problem/sum-of-even-numbers-after-queries)
