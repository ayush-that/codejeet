---
title: "How to Solve Count Special Quadruplets — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Special Quadruplets. Easy difficulty, 64.4% acceptance rate. Topics: Array, Hash Table, Enumeration."
date: "2028-04-13"
category: "dsa-patterns"
tags: ["count-special-quadruplets", "array", "hash-table", "enumeration", "easy"]
---

# How to Solve Count Special Quadruplets

This problem asks us to count distinct quadruplets `(a, b, c, d)` from a 0-indexed array where `nums[a] + nums[b] + nums[c] == nums[d]` and `a < b < c < d`. While labeled "Easy," the constraint that `d` must be greater than `a, b, c` adds an interesting twist—we can't simply check all combinations of four elements. The ordering matters, and we need to efficiently find triple sums that equal later elements in the array.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 3, 6]` step by step:

We need to find all quadruplets `(a, b, c, d)` where:

- `a < b < c < d`
- `nums[a] + nums[b] + nums[c] == nums[d]`

**Step-by-step check:**

- For `d = 3` (value 6): Check all `(a, b, c)` where `a < b < c < 3`
  - `(0, 1, 2)`: `nums[0] + nums[1] + nums[2] = 1 + 2 + 3 = 6` ✅ Found one!
- No other `d` values work since `d` must be at index 3 (last element)

So the answer is 1 quadruplet: `(0, 1, 2, 3)`.

The key insight: For each possible `d`, we need to check all combinations of `(a, b, c)` that come before it. This suggests we should iterate `d` from the end of the array backward, and for each `d`, check all possible `(a, b, c)` triples where `a < b < c < d`.

## Brute Force Approach

The most straightforward solution is to check all possible quadruplets using four nested loops:

<div class="code-group">

```python
# Time: O(n^4) | Space: O(1)
def countQuadruplets(nums):
    n = len(nums)
    count = 0

    # Check all possible quadruplets
    for a in range(n):
        for b in range(a + 1, n):
            for c in range(b + 1, n):
                for d in range(c + 1, n):
                    if nums[a] + nums[b] + nums[c] == nums[d]:
                        count += 1

    return count
```

```javascript
// Time: O(n^4) | Space: O(1)
function countQuadruplets(nums) {
  const n = nums.length;
  let count = 0;

  // Check all possible quadruplets
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      for (let c = b + 1; c < n; c++) {
        for (let d = c + 1; d < n; d++) {
          if (nums[a] + nums[b] + nums[c] === nums[d]) {
            count++;
          }
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n^4) | Space: O(1)
public int countQuadruplets(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Check all possible quadruplets
    for (int a = 0; a < n; a++) {
        for (int b = a + 1; b < n; b++) {
            for (int c = b + 1; c < n; c++) {
                for (int d = c + 1; d < n; d++) {
                    if (nums[a] + nums[b] + nums[c] == nums[d]) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With `n` up to 50, `O(n^4)` means checking up to 50⁴ = 6.25 million operations. While this might pass for small inputs, it's inefficient and won't scale well. Interviewers expect optimization even when brute force technically works within constraints.

## Optimal Solution

We can optimize by noticing that for each `d`, we're looking for `(a, b, c)` triples where `a < b < c < d`. Instead of checking all triples for each `d`, we can use a hash map to store sums of pairs `(a, b)` and then check for each `(c, d)` pair.

**Key insight:** Fix `c` and `d` where `c < d`. Then we need to find `(a, b)` where `a < b < c` such that `nums[a] + nums[b] = nums[d] - nums[c]`. We can use a hash map to count how many pairs `(a, b)` sum to each value.

**Algorithm:**

1. Initialize `count = 0` and a hash map to store pair sums
2. Iterate `c` from 2 to `n-2` (we need at least 2 indices before `c` for `a, b` and at least 1 after for `d`)
3. For each `c`, iterate `b` from 1 to `c-1` and `a` from 0 to `b-1`, adding `nums[a] + nums[b]` to the hash map
4. For each `d` from `c+1` to `n-1`, check if `nums[d] - nums[c]` exists in the hash map and add its count to result

This gives us `O(n^3)` time complexity, which is acceptable for `n ≤ 50`.

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n^2) for storing pair sums
def countQuadruplets(nums):
    n = len(nums)
    count = 0

    # Iterate c from 2 to n-2 (need at least 2 before, 1 after)
    for c in range(2, n - 1):
        # Store sums of all (a, b) pairs where a < b < c
        sum_count = {}

        # Generate all (a, b) pairs before c
        for a in range(c):
            for b in range(a + 1, c):
                pair_sum = nums[a] + nums[b]
                sum_count[pair_sum] = sum_count.get(pair_sum, 0) + 1

        # Check all d > c
        for d in range(c + 1, n):
            # We need nums[a] + nums[b] = nums[d] - nums[c]
            target = nums[d] - nums[c]
            if target in sum_count:
                count += sum_count[target]

    return count
```

```javascript
// Time: O(n^3) | Space: O(n^2) for storing pair sums
function countQuadruplets(nums) {
  const n = nums.length;
  let count = 0;

  // Iterate c from 2 to n-2 (need at least 2 before, 1 after)
  for (let c = 2; c < n - 1; c++) {
    // Store sums of all (a, b) pairs where a < b < c
    const sumCount = new Map();

    // Generate all (a, b) pairs before c
    for (let a = 0; a < c; a++) {
      for (let b = a + 1; b < c; b++) {
        const pairSum = nums[a] + nums[b];
        sumCount.set(pairSum, (sumCount.get(pairSum) || 0) + 1);
      }
    }

    // Check all d > c
    for (let d = c + 1; d < n; d++) {
      // We need nums[a] + nums[b] = nums[d] - nums[c]
      const target = nums[d] - nums[c];
      if (sumCount.has(target)) {
        count += sumCount.get(target);
      }
    }
  }

  return count;
}
```

```java
// Time: O(n^3) | Space: O(n^2) for storing pair sums
public int countQuadruplets(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Iterate c from 2 to n-2 (need at least 2 before, 1 after)
    for (int c = 2; c < n - 1; c++) {
        // Store sums of all (a, b) pairs where a < b < c
        Map<Integer, Integer> sumCount = new HashMap<>();

        // Generate all (a, b) pairs before c
        for (int a = 0; a < c; a++) {
            for (int b = a + 1; b < c; b++) {
                int pairSum = nums[a] + nums[b];
                sumCount.put(pairSum, sumCount.getOrDefault(pairSum, 0) + 1);
            }
        }

        // Check all d > c
        for (int d = c + 1; d < n; d++) {
            // We need nums[a] + nums[b] = nums[d] - nums[c]
            int target = nums[d] - nums[c];
            if (sumCount.containsKey(target)) {
                count += sumCount.get(target);
            }
        }
    }

    return count;
}
```

</div>

**Alternative optimization:** We can achieve `O(n^2)` time complexity by fixing `b` and `c`, but the above `O(n^3)` solution is simpler to understand and implement, and is perfectly acceptable for the given constraints.

## Complexity Analysis

**Time Complexity:** `O(n^3)`

- Outer loop: `c` runs `O(n)` times
- First inner loop: Generating `(a, b)` pairs takes `O(c^2)` which is `O(n^2)` in worst case
- Second inner loop: Checking `d > c` takes `O(n)` times
- Total: `O(n) * (O(n^2) + O(n)) = O(n^3)`

**Space Complexity:** `O(n^2)`

- In the worst case, we store all possible pair sums `(a, b)` before position `c`
- There are `C(c, 2)` pairs, which is `O(c^2)` = `O(n^2)` in worst case

## Common Mistakes

1. **Off-by-one errors in loop bounds:** Forgetting that indices must be strictly increasing (`a < b < c < d`). A common mistake is using `≤` instead of `<` or incorrect loop ranges that allow indices to be equal.

2. **Missing the ordering constraint:** Some candidates try to sort the array first, which breaks the index ordering requirement. Remember: we're counting quadruplets based on **indices**, not values.

3. **Double counting or missing pairs:** When using hash maps, forgetting that multiple `(a, b)` pairs can have the same sum. We need to count all of them, not just check if a sum exists.

4. **Inefficient brute force:** While the brute force `O(n^4)` solution might pass for small inputs, interviewers expect you to recognize and optimize it. Always mention the time complexity and suggest improvements.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Pair sum with ordering constraints:** Similar to [Two Sum](/problem/two-sum) but with additional ordering requirements. The technique of fixing one element and using a hash map for the complement appears in many problems.

2. **Counting combinations with constraints:** Like [Count Good Triplets](/problem/count-good-triplets), which also requires counting valid index combinations with specific conditions.

3. **Multi-sum problems:** A simpler version of [4Sum](/problem/4sum), which asks for all unique quadruplets that sum to a target value (though 4Sum typically doesn't have the `a < b < c < d` index constraint).

## Key Takeaways

1. **When dealing with ordered quadruplets/triplets, fix middle elements:** Instead of checking all four elements, fix `b` and `c` (or just `c` in our solution) and use hash maps to efficiently find the other elements that satisfy the equation.

2. **Transform the equation:** `nums[a] + nums[b] + nums[c] == nums[d]` can be rewritten as `nums[a] + nums[b] == nums[d] - nums[c]`. This allows us to use pair sum techniques.

3. **Consider constraints when choosing approach:** With `n ≤ 50`, `O(n^3)` is acceptable (125,000 operations). For larger `n`, we'd need `O(n^2)` solutions using more sophisticated hash map techniques.

Related problems: [4Sum](/problem/4sum), [Increasing Triplet Subsequence](/problem/increasing-triplet-subsequence), [Count Good Triplets](/problem/count-good-triplets)
