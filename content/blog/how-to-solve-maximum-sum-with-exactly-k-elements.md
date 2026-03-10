---
title: "How to Solve Maximum Sum With Exactly K Elements  — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Sum With Exactly K Elements . Easy difficulty, 80.5% acceptance rate. Topics: Array, Greedy."
date: "2027-05-26"
category: "dsa-patterns"
tags: ["maximum-sum-with-exactly-k-elements", "array", "greedy", "easy"]
---

# How to Solve Maximum Sum With Exactly K Elements

This problem asks us to maximize our score by performing exactly `k` operations on an array. In each operation, we select an element `m`, remove it, and add a new element with value `m + 1`. The key insight is that we want to repeatedly select the largest available element to maximize our total sum. While this seems straightforward, the challenge lies in recognizing that after each operation, the element we modify becomes even larger, making it potentially the best choice for subsequent operations.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [1, 2, 3]` and `k = 2`.

**Initial state:** `nums = [1, 2, 3]`, total = 0

**Operation 1:**

- Select the largest element: 3
- Remove 3 from array: `nums = [1, 2]`
- Add 3 + 1 = 4: `nums = [1, 2, 4]`
- Add 3 to total: total = 3

**Operation 2:**

- Select the largest element: 4
- Remove 4 from array: `nums = [1, 2]`
- Add 4 + 1 = 5: `nums = [1, 2, 5]`
- Add 4 to total: total = 7

**Final result:** 7

Notice the pattern: we always pick the current maximum, and the sequence of values we add to our total forms an arithmetic progression. For our example, we added 3 and then 4, which is 3 + (2-1) = 4. In general, if the maximum element is `max_num`, after `k` operations we'll add:
`max_num + (max_num + 1) + (max_num + 2) + ... + (max_num + k - 1)`

This simplifies to: `k * max_num + (0 + 1 + 2 + ... + (k-1)) = k * max_num + k*(k-1)/2`

## Brute Force Approach

A naive approach would simulate all `k` operations exactly as described:

1. For each of `k` operations:
   - Find the maximum element in the current array
   - Add it to the total sum
   - Remove it from the array
   - Insert `max_element + 1` back into the array

The problem with this approach is efficiency. Finding the maximum in an unsorted array takes O(n) time, and we need to do this `k` times, resulting in O(k·n) time complexity. Since both `k` and `n` can be up to 50 (based on typical constraints), this could be 2500 operations, which might be acceptable but is inefficient. More importantly, it misses the mathematical pattern that allows us to solve this in O(1) time after finding the initial maximum.

Here's what the brute force simulation might look like:

<div class="code-group">

```python
# Time: O(k * n) | Space: O(n)
def maximizeSum(nums, k):
    total = 0
    for _ in range(k):
        # Find maximum element - O(n)
        max_val = max(nums)
        total += max_val

        # Remove the maximum element - O(n)
        nums.remove(max_val)

        # Add max_val + 1 back to the array
        nums.append(max_val + 1)

    return total
```

```javascript
// Time: O(k * n) | Space: O(n)
function maximizeSum(nums, k) {
  let total = 0;
  for (let i = 0; i < k; i++) {
    // Find maximum element - O(n)
    let maxVal = Math.max(...nums);
    total += maxVal;

    // Remove the maximum element - O(n)
    const maxIndex = nums.indexOf(maxVal);
    nums.splice(maxIndex, 1);

    // Add maxVal + 1 back to the array
    nums.push(maxVal + 1);
  }
  return total;
}
```

```java
// Time: O(k * n) | Space: O(n)
public int maximizeSum(int[] nums, int k) {
    List<Integer> list = new ArrayList<>();
    for (int num : nums) {
        list.add(num);
    }

    int total = 0;
    for (int i = 0; i < k; i++) {
        // Find maximum element - O(n)
        int maxVal = Collections.max(list);
        total += maxVal;

        // Remove the maximum element - O(n)
        list.remove(Integer.valueOf(maxVal));

        // Add maxVal + 1 back to the list
        list.add(maxVal + 1);
    }
    return total;
}
```

</div>

## Optimal Solution

The optimal solution recognizes the mathematical pattern we observed in the visual walkthrough. After finding the initial maximum value `m`, the sequence of values we'll add to our total is: `m, m+1, m+2, ..., m+(k-1)`. This is an arithmetic sequence with:

- First term: `m`
- Last term: `m + k - 1`
- Number of terms: `k`

The sum of an arithmetic sequence is: `(first + last) * n / 2 = (m + (m + k - 1)) * k / 2`

This simplifies to: `k * m + k * (k - 1) / 2`

We only need to find the initial maximum once, giving us O(n) time to find it, then O(1) time to compute the result.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximizeSum(nums, k):
    # Step 1: Find the maximum element in the array
    # We need this because we'll always pick the largest element first
    max_num = max(nums)

    # Step 2: Calculate the sum using the arithmetic sequence formula
    # The sequence is: max_num, max_num+1, max_num+2, ..., max_num+(k-1)
    # Sum = k * max_num + (0 + 1 + 2 + ... + (k-1))
    # The sum of first (k-1) natural numbers is k*(k-1)/2
    return k * max_num + k * (k - 1) // 2
```

```javascript
// Time: O(n) | Space: O(1)
function maximizeSum(nums, k) {
  // Step 1: Find the maximum element in the array
  // We need this because we'll always pick the largest element first
  let maxNum = Math.max(...nums);

  // Step 2: Calculate the sum using the arithmetic sequence formula
  // The sequence is: maxNum, maxNum+1, maxNum+2, ..., maxNum+(k-1)
  // Sum = k * maxNum + (0 + 1 + 2 + ... + (k-1))
  // The sum of first (k-1) natural numbers is k*(k-1)/2
  return k * maxNum + (k * (k - 1)) / 2;
}
```

```java
// Time: O(n) | Space: O(1)
public int maximizeSum(int[] nums, int k) {
    // Step 1: Find the maximum element in the array
    // We need this because we'll always pick the largest element first
    int maxNum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > maxNum) {
            maxNum = nums[i];
        }
    }

    // Step 2: Calculate the sum using the arithmetic sequence formula
    // The sequence is: maxNum, maxNum+1, maxNum+2, ..., maxNum+(k-1)
    // Sum = k * maxNum + (0 + 1 + 2 + ... + (k-1))
    // The sum of first (k-1) natural numbers is k*(k-1)/2
    return k * maxNum + k * (k - 1) / 2;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We need to scan through the array once to find the maximum element, which takes O(n) time
- The arithmetic calculation takes O(1) time
- Total: O(n) + O(1) = O(n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space to store variables like `max_num` and the result
- No additional data structures that grow with input size

## Common Mistakes

1. **Simulating all k operations:** Some candidates try to actually perform all k operations by repeatedly finding the maximum, removing it, and adding max+1. While this gives the correct answer, it's inefficient (O(k·n) time) and misses the opportunity to use the mathematical formula.

2. **Integer overflow in the calculation:** When k is large (close to 50), k*(k-1)/2 can be up to 1225, and k*max_num could be up to 50\*50 = 2500. The total 3725 fits in standard 32-bit integers, but in languages with fixed-width integers or with larger constraints, this could overflow. Always check constraints and use appropriate data types.

3. **Forgetting to use integer division:** In Python, using `/` instead of `//` for the division by 2 will result in a float. In Java and JavaScript, integer division happens automatically with `/` when both operands are integers, but be mindful of this difference across languages.

4. **Assuming the array is sorted:** The problem doesn't state that the array is sorted, so we can't assume nums[n-1] is the maximum. We must explicitly find the maximum element.

## When You'll See This Pattern

This problem teaches the **greedy selection** pattern combined with **mathematical optimization**. You'll see similar patterns in:

1. **Maximum Product After K Increments (LeetCode 2233)** - Similar greedy approach where you always increment the smallest element to maximize the product, which can be optimized with a min-heap.

2. **Maximum Score From Removing Stones (LeetCode 1753)** - Another greedy problem where you always remove from the two largest piles, with a mathematical formula to compute the result efficiently.

3. **Minimum Operations to Make Array Equal (LeetCode 1551)** - Uses arithmetic sequence sum to find the minimum operations needed to make all elements equal.

The key insight in all these problems is recognizing when a greedy approach is optimal (always pick the maximum/minimum) and then finding a mathematical formula to avoid simulation.

## Key Takeaways

1. **Greedy with mathematical optimization:** When a problem involves repeatedly applying an operation that always benefits from choosing the extreme value (maximum or minimum), look for a mathematical pattern or formula that can replace simulation.

2. **Arithmetic sequence sums appear frequently:** The formula for the sum of an arithmetic sequence (n/2 \* (first + last)) is useful in many optimization problems where values increase or decrease linearly.

3. **Always verify greedy correctness:** Before implementing a greedy solution, think through why it's optimal. In this case, picking the maximum each time is optimal because it gives us the largest immediate gain and creates an even larger element for future operations.

[Practice this problem on CodeJeet](/problem/maximum-sum-with-exactly-k-elements)
