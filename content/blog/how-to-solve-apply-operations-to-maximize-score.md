---
title: "How to Solve Apply Operations to Maximize Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Apply Operations to Maximize Score. Hard difficulty, 53.7% acceptance rate. Topics: Array, Math, Stack, Greedy, Sorting."
date: "2027-12-08"
category: "dsa-patterns"
tags: ["apply-operations-to-maximize-score", "array", "math", "stack", "hard"]
---

# How to Solve Apply Operations to Maximize Score

You're given an array of positive integers and need to maximize your score by selecting subarrays at most `k` times, where your score multiplies by the minimum value in each chosen subarray. The challenge is that you cannot select the same subarray twice, and you need to strategically choose which subarrays to pick to maximize the final product. What makes this problem tricky is that the number of possible subarrays grows quadratically (O(n²)), and `k` can be large, so we need a clever way to determine which subarrays contribute most to the score without explicitly enumerating all of them.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 1, 4, 3]` with `k = 3`.

**Step 1: Understanding the operation**
When we choose a subarray, our score gets multiplied by the minimum value in that subarray. Since we start with score 1, the final score will be the product of the minimums of all chosen subarrays.

**Step 2: Thinking about subarray contributions**
Consider the element `4` at index 2. It will be the minimum of any subarray that:

- Starts somewhere before or at index 2
- Ends somewhere after or at index 2
- Contains no element smaller than 4 within that range

For `nums[2] = 4`:

- To the left: The nearest smaller element is `1` at index 1
- To the right: The nearest smaller element is `3` at index 3
- So `4` can be the minimum for subarrays starting from index 2 to 2, and ending from index 2 to 2
- That's just the single-element subarray `[4]`

**Step 3: Counting subarrays for each element**
Let's calculate for each element how many subarrays it can be the minimum of:

1. `nums[0] = 2`:
   - Left boundary: No smaller element to left, so can start from index 0
   - Right boundary: Next smaller is `1` at index 1, so can end at index 0
   - Subarrays: Just `[2]` → 1 subarray

2. `nums[1] = 1`:
   - Left boundary: No smaller to left, so start from index 0
   - Right boundary: No smaller to right, so end at index 3
   - Subarrays: Can start at 0,1 and end at 1,2,3 → 2 × 3 = 6 subarrays

3. `nums[2] = 4`:
   - Left boundary: Next smaller is `1` at index 1, so start from index 2
   - Right boundary: Next smaller is `3` at index 3, so end at index 2
   - Subarrays: Just `[4]` → 1 subarray

4. `nums[3] = 3`:
   - Left boundary: Next smaller is `1` at index 1, so start from index 2,3
   - Right boundary: No smaller to right, so end at index 3
   - Subarrays: Start at 2,3 and end at 3 → 2 × 1 = 2 subarrays

**Step 4: Maximizing the score**
We have counts of how many subarrays each element can be minimum of:

- `2`: 1 subarray
- `1`: 6 subarrays
- `4`: 1 subarray
- `3`: 2 subarrays

Since we can only choose `k=3` subarrays, we want to multiply by the largest possible values. We should choose:

1. First, use `4` (largest value) for its 1 subarray → score × 4
2. Then use `3` (next largest) for its 2 subarrays → score × 3 × 3
3. We've used 3 subarrays total (1 + 2), so we stop

Final score = 1 × 4 × 3 × 3 = 36

## Brute Force Approach

A naive approach would be to generate all possible subarrays, calculate their minimums, sort them in descending order, and multiply the top `k` values. However, this is extremely inefficient:

1. There are O(n²) subarrays in an array of length n
2. For each subarray, finding the minimum takes O(r-l) time
3. Sorting O(n²) elements takes O(n² log n²) = O(n² log n) time
4. The total would be O(n³) for generating and finding minimums, plus O(n² log n) for sorting

This approach fails because:

- For n = 10⁵ (typical constraint), n² = 10¹⁰, which is far too large
- Even with optimization, we cannot handle the quadratic growth

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O(n³) | Space: O(n²)
def maxScoreBruteForce(nums, k):
    n = len(nums)
    subarray_mins = []

    # Generate all subarrays and their minimums
    for i in range(n):
        for j in range(i, n):
            # Find minimum in subarray nums[i:j+1]
            min_val = min(nums[i:j+1])
            subarray_mins.append(min_val)

    # Sort in descending order
    subarray_mins.sort(reverse=True)

    # Multiply top k values (or all if fewer than k)
    result = 1
    for i in range(min(k, len(subarray_mins))):
        result *= subarray_mins[i]

    return result
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n³) | Space: O(n²)
function maxScoreBruteForce(nums, k) {
  const n = nums.length;
  const subarrayMins = [];

  // Generate all subarrays and their minimums
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Find minimum in subarray nums[i..j]
      let minVal = Infinity;
      for (let m = i; m <= j; m++) {
        minVal = Math.min(minVal, nums[m]);
      }
      subarrayMins.push(minVal);
    }
  }

  // Sort in descending order
  subarrayMins.sort((a, b) => b - a);

  // Multiply top k values (or all if fewer than k)
  let result = 1n; // Use BigInt for large products
  const limit = Math.min(k, subarrayMins.length);
  for (let i = 0; i < limit; i++) {
    result *= BigInt(subarrayMins[i]);
  }

  return Number(result);
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O(n³) | Space: O(n²)
public long maxScoreBruteForce(int[] nums, int k) {
    int n = nums.length;
    List<Integer> subarrayMins = new ArrayList<>();

    // Generate all subarrays and their minimums
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Find minimum in subarray nums[i..j]
            int minVal = Integer.MAX_VALUE;
            for (int m = i; m <= j; m++) {
                minVal = Math.min(minVal, nums[m]);
            }
            subarrayMins.add(minVal);
        }
    }

    // Sort in descending order
    Collections.sort(subarrayMins, Collections.reverseOrder());

    // Multiply top k values (or all if fewer than k)
    long result = 1L;
    int limit = Math.min(k, subarrayMins.size());
    for (int i = 0; i < limit; i++) {
        result *= subarrayMins.get(i);
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that instead of thinking about subarrays directly, we should think about **how many subarrays each element can be the minimum of**. This transforms the problem:

1. For each element `nums[i]`, find:
   - `left[i]`: How far to the left we can extend while keeping `nums[i]` as minimum
   - `right[i]`: How far to the right we can extend while keeping `nums[i]` as minimum
2. The number of subarrays where `nums[i]` is the minimum equals:
   `count[i] = (i - left[i]) * (right[i] - i)`
3. Now we have pairs `(value, count)` for each element, where `value = nums[i]` and `count` is how many subarrays it can be minimum of.

4. We sort these pairs by value in descending order and greedily take the largest values first, using up to their available counts, until we've selected `k` subarrays total.

The clever part is finding `left[i]` and `right[i]` efficiently using a **monotonic stack**:

- To find the next smaller element to the left, we maintain a stack of indices with increasing values
- To find the next smaller element to the right, we do a similar pass from right to left

This reduces the problem to O(n) for finding boundaries, O(n log n) for sorting, and O(k) for selecting the top values.

## Optimal Solution

Here's the complete solution using monotonic stacks to find boundaries, then greedily selecting the largest values:

<div class="code-group">

```python
# Optimal Solution using Monotonic Stack
# Time: O(n log n) | Space: O(n)
def maxScore(nums, k):
    MOD = 10**9 + 7
    n = len(nums)

    # Step 1: Find next smaller element to the left for each position
    # left[i] = index of next smaller element to the left, or -1 if none
    left = [-1] * n
    stack = []

    for i in range(n):
        # Maintain stack in increasing order of values
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()
        # If stack is empty, no smaller element to the left
        left[i] = stack[-1] if stack else -1
        stack.append(i)

    # Step 2: Find next smaller element to the right for each position
    # right[i] = index of next smaller element to the right, or n if none
    right = [n] * n
    stack.clear()

    for i in range(n - 1, -1, -1):
        # Maintain stack in increasing order of values
        while stack and nums[stack[-1]] > nums[i]:
            stack.pop()
        # Use >= for left and > for right to avoid double counting
        # when there are equal elements
        right[i] = stack[-1] if stack else n
        stack.append(i)

    # Step 3: Calculate how many subarrays each element is minimum of
    # For each nums[i], it's the minimum for subarrays starting from
    # (left[i] + 1) to i, and ending from i to (right[i] - 1)
    elements = []
    for i in range(n):
        # Count of subarrays where nums[i] is the minimum
        count = (i - left[i]) * (right[i] - i)
        elements.append((nums[i], count))

    # Step 4: Sort by value in descending order
    elements.sort(reverse=True)

    # Step 5: Greedily select the largest values
    result = 1
    remaining = k

    for value, count in elements:
        if remaining <= 0:
            break

        # We can take at most 'count' subarrays with this value,
        # but limited by how many we still need ('remaining')
        take = min(count, remaining)

        # Multiply result by value^take using fast exponentiation
        result = (result * pow(value, take, MOD)) % MOD
        remaining -= take

    return result
```

```javascript
// Optimal Solution using Monotonic Stack
// Time: O(n log n) | Space: O(n)
function maxScore(nums, k) {
  const MOD = BigInt(1000000007);
  const n = nums.length;

  // Step 1: Find next smaller element to the left for each position
  // left[i] = index of next smaller element to the left, or -1 if none
  const left = new Array(n).fill(-1);
  const stack = [];

  for (let i = 0; i < n; i++) {
    // Maintain stack in increasing order of values
    while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }
    // If stack is empty, no smaller element to the left
    left[i] = stack.length > 0 ? stack[stack.length - 1] : -1;
    stack.push(i);
  }

  // Step 2: Find next smaller element to the right for each position
  // right[i] = index of next smaller element to the right, or n if none
  const right = new Array(n).fill(n);
  stack.length = 0; // Clear the stack

  for (let i = n - 1; i >= 0; i--) {
    // Maintain stack in increasing order of values
    while (stack.length > 0 && nums[stack[stack.length - 1]] > nums[i]) {
      stack.pop();
    }
    // Use >= for left and > for right to avoid double counting
    // when there are equal elements
    right[i] = stack.length > 0 ? stack[stack.length - 1] : n;
    stack.push(i);
  }

  // Step 3: Calculate how many subarrays each element is minimum of
  const elements = [];
  for (let i = 0; i < n; i++) {
    // Count of subarrays where nums[i] is the minimum
    const count = (i - left[i]) * (right[i] - i);
    elements.push({ value: nums[i], count: count });
  }

  // Step 4: Sort by value in descending order
  elements.sort((a, b) => b.value - a.value);

  // Step 5: Greedily select the largest values
  let result = 1n;
  let remaining = k;

  // Fast exponentiation function
  const powMod = (base, exp) => {
    let result = 1n;
    let b = BigInt(base) % MOD;
    let e = BigInt(exp);

    while (e > 0n) {
      if (e % 2n === 1n) {
        result = (result * b) % MOD;
      }
      b = (b * b) % MOD;
      e = e / 2n;
    }
    return result;
  };

  for (const elem of elements) {
    if (remaining <= 0) break;

    // We can take at most 'count' subarrays with this value,
    // but limited by how many we still need ('remaining')
    const take = Math.min(elem.count, remaining);

    // Multiply result by value^take using fast exponentiation
    result = (result * powMod(elem.value, take)) % MOD;
    remaining -= take;
  }

  return Number(result);
}
```

```java
// Optimal Solution using Monotonic Stack
// Time: O(n log n) | Space: O(n)
public int maxScore(int[] nums, int k) {
    final int MOD = 1000000007;
    int n = nums.length;

    // Step 1: Find next smaller element to the left for each position
    // left[i] = index of next smaller element to the left, or -1 if none
    int[] left = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        // Maintain stack in increasing order of values
        while (!stack.isEmpty() && nums[stack.peek()] >= nums[i]) {
            stack.pop();
        }
        // If stack is empty, no smaller element to the left
        left[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(i);
    }

    // Step 2: Find next smaller element to the right for each position
    // right[i] = index of next smaller element to the right, or n if none
    int[] right = new int[n];
    stack.clear();

    for (int i = n - 1; i >= 0; i--) {
        // Maintain stack in increasing order of values
        while (!stack.isEmpty() && nums[stack.peek()] > nums[i]) {
            stack.pop();
        }
        // Use >= for left and > for right to avoid double counting
        // when there are equal elements
        right[i] = stack.isEmpty() ? n : stack.peek();
        stack.push(i);
    }

    // Step 3: Calculate how many subarrays each element is minimum of
    List<int[]> elements = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        // Count of subarrays where nums[i] is the minimum
        long count = (long)(i - left[i]) * (right[i] - i);
        elements.add(new int[]{nums[i], (int)Math.min(count, Integer.MAX_VALUE)});
    }

    // Step 4: Sort by value in descending order
    elements.sort((a, b) -> Integer.compare(b[0], a[0]));

    // Step 5: Greedily select the largest values
    long result = 1L;
    int remaining = k;

    for (int[] elem : elements) {
        if (remaining <= 0) break;

        int value = elem[0];
        int count = elem[1];

        // We can take at most 'count' subarrays with this value,
        // but limited by how many we still need ('remaining')
        int take = Math.min(count, remaining);

        // Multiply result by value^take using fast exponentiation
        result = (result * fastPow(value, take, MOD)) % MOD;
        remaining -= take;
    }

    return (int) result;
}

// Fast exponentiation with modulo
private long fastPow(long base, int exp, int mod) {
    long result = 1L;
    long b = base % mod;
    int e = exp;

    while (e > 0) {
        if ((e & 1) == 1) {
            result = (result * b) % mod;
        }
        b = (b * b) % mod;
        e >>= 1;
    }
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Finding left boundaries: O(n) - each element pushed and popped from stack at most once
- Finding right boundaries: O(n) - same reasoning
- Sorting the elements: O(n log n) - sorting n elements by value
- Selecting top k values: O(n) in worst case, but could stop early
- Fast exponentiation: O(log k) per multiplication, but k ≤ n so O(log n) per operation

**Space Complexity: O(n)**

- `left` array: O(n)
- `right` array: O(n)
- `stack`: O(n) in worst case
- `elements` list: O(n)

The bottleneck is the sorting step, making the overall complexity O(n log n).

## Common Mistakes

1. **Double counting equal elements**: When finding boundaries for equal elements, you need to be careful. The standard approach is to use `>=` when finding the left boundary and `>` when finding the right boundary (or vice versa) to ensure each subarray's minimum is counted exactly once.

2. **Integer overflow in count calculation**: The number of subarrays for an element can be as large as `n × n`, which for n = 10⁵ would be 10¹⁰, exceeding 32-bit integer range. Use 64-bit integers (long in Java/JavaScript, normal int in Python handles big integers).

3. **Forgetting modulo operations during exponentiation**: When computing `value^take`, the result can be enormous. You need to apply modulo at each multiplication step, not just at the end. Use fast exponentiation with modulo to compute this efficiently.

4. **Not handling k > total subarrays**: There are at most n(n+1)/2 subarrays, but k could be larger in theory. The code should handle this by taking all available subarrays when k exceeds the total.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Monotonic Stack for Next Greater/Smaller Element**: Used to find boundaries where an element remains minimum. Similar problems:
   - [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) (Easy)
   - [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) (Medium)
   - [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) (Hard)

2. **Counting Subarrays with Property**: The technique of counting how many subarrays satisfy a property (like having a specific element as minimum) appears in:
   - [Number of Subarrays with Bounded Maximum](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/) (Medium)
   - [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) (Medium)

3. **Greedy Selection with Counts**: Selecting items based on value with limited availability appears in:
   - [Maximum Score From Removing Stones](https://leetcode.com/problems/maximum-score-from-removing-stones/) (Medium)
   - [Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team/) (Hard)

## Key Takeaways

1. **Transform the problem**: Instead of enumerating all subarrays (O(n²)), think about what each element contributes. For "minimum of subarray" problems, calculate how many subarrays each element can be the minimum of using boundary finding.

2. **Monotonic stacks find boundaries efficiently**: When you need to find the next greater/smaller element, or the range where an element is extreme, monotonic stacks provide an O(n) solution.

3. **Greedy works with sorting**: When you need to maximize a product by selecting items, sorting by value and taking the largest first is often optimal if items are independent (which they are here since subarrays cannot overlap in the selection).

Related problems: [Next Greater Element IV](/problem/next-greater-element-iv)
