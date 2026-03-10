---
title: "How to Solve Minimum Number Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Number Game. Easy difficulty, 85.4% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue), Simulation."
date: "2026-10-03"
category: "dsa-patterns"
tags: ["minimum-number-game", "array", "sorting", "heap-(priority-queue)", "easy"]
---

# How to Solve Minimum Number Game

This problem presents a game simulation where two players alternately remove and append numbers from an array according to specific rules. While the problem is rated "Easy," it tests your ability to understand and implement a multi-step process with careful ordering. The interesting part is recognizing that the optimal solution doesn't require actually simulating the game round-by-round — there's a clever mathematical pattern that emerges when you analyze the process.

## Visual Walkthrough

Let's trace through the example `nums = [5, 4, 2, 3]` step by step:

**Step 1: Sort the array**
First, we sort the array in ascending order: `[2, 3, 4, 5]`

**Step 2: Process pairs**
Now we process the sorted array in pairs (every two elements):

- First pair: `[2, 3]`
  - Alice removes the minimum (2)
  - Bob removes the next minimum (3)
  - Bob appends his number first (3)
  - Alice appends her number second (2)
  - Current `arr`: `[3, 2]`

- Second pair: `[4, 5]`
  - Alice removes the minimum (4)
  - Bob removes the next minimum (5)
  - Bob appends his number first (5)
  - Alice appends her number second (4)
  - Current `arr`: `[3, 2, 5, 4]`

**Final result**: `[3, 2, 5, 4]`

Notice the pattern: For each pair `[a, b]` where `a < b` (since we sorted), Bob's number `b` comes first, then Alice's number `a`. This gives us the sequence `[b, a, d, c, f, e, ...]` for sorted pairs `[a, b], [c, d], [e, f], ...`

## Brute Force Approach

A naive approach would be to actually simulate the game round-by-round:

1. While `nums` is not empty:
   - Find and remove the minimum element (Alice's move)
   - Find and remove the new minimum element (Bob's move)
   - Append Bob's element to `arr`
   - Append Alice's element to `arr`

This approach has several inefficiencies:

- Finding the minimum each time takes O(n) if we scan the array
- Removing elements from the middle of an array takes O(n) due to shifting
- Overall complexity becomes O(n²), which is inefficient for larger inputs

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def numberGame(nums):
    arr = []
    while nums:
        # Alice's move: find and remove minimum
        alice_num = min(nums)
        nums.remove(alice_num)

        # Bob's move: find and remove new minimum
        bob_num = min(nums)
        nums.remove(bob_num)

        # Append in reverse order (Bob first, then Alice)
        arr.append(bob_num)
        arr.append(alice_num)

    return arr
```

```javascript
// Time: O(n²) | Space: O(n)
function numberGame(nums) {
  const arr = [];
  while (nums.length > 0) {
    // Alice's move: find and remove minimum
    const aliceNum = Math.min(...nums);
    const aliceIndex = nums.indexOf(aliceNum);
    nums.splice(aliceIndex, 1);

    // Bob's move: find and remove new minimum
    const bobNum = Math.min(...nums);
    const bobIndex = nums.indexOf(bobNum);
    nums.splice(bobIndex, 1);

    // Append in reverse order (Bob first, then Alice)
    arr.push(bobNum);
    arr.push(aliceNum);
  }
  return arr;
}
```

```java
// Time: O(n²) | Space: O(n)
import java.util.*;

public List<Integer> numberGame(List<Integer> nums) {
    List<Integer> arr = new ArrayList<>();
    List<Integer> mutableNums = new ArrayList<>(nums);

    while (!mutableNums.isEmpty()) {
        // Alice's move: find and remove minimum
        int aliceNum = Collections.min(mutableNums);
        int aliceIndex = mutableNums.indexOf(aliceNum);
        mutableNums.remove(aliceIndex);

        // Bob's move: find and remove new minimum
        int bobNum = Collections.min(mutableNums);
        int bobIndex = mutableNums.indexOf(bobNum);
        mutableNums.remove(bobIndex);

        // Append in reverse order (Bob first, then Alice)
        arr.add(bobNum);
        arr.add(aliceNum);
    }

    return arr;
}
```

</div>

This brute force works but is inefficient because:

- `min()` or `Math.min()` scans the entire array each time: O(n)
- `remove()` or `splice()` shifts elements: O(n)
- With n/2 rounds, we get O(n²) total time complexity

## Optimal Solution

The key insight is that we don't need to simulate the game dynamically. After sorting, we can see that:

1. The game always processes numbers in increasing order
2. Each round takes the two smallest available numbers
3. The result always has Bob's number (the larger of the pair) before Alice's number (the smaller of the pair)

Therefore, we can simply:

1. Sort the array
2. Process it in pairs, swapping each pair

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for the result array
def numberGame(nums):
    # Step 1: Sort the array in ascending order
    # This groups the numbers into natural pairs for each round
    nums.sort()

    # Step 2: Initialize result array
    arr = []

    # Step 3: Process the sorted array in pairs
    # We iterate with step 2 to process [i, i+1] as a pair
    for i in range(0, len(nums), 2):
        # For each pair [a, b] where a < b (due to sorting):
        # - Bob gets b (the larger) and appends first
        # - Alice gets a (the smaller) and appends second
        # So we append b first, then a
        arr.append(nums[i + 1])  # Bob's number (larger in the pair)
        arr.append(nums[i])      # Alice's number (smaller in the pair)

    return arr
```

```javascript
// Time: O(n log n) | Space: O(n) for the result array
function numberGame(nums) {
  // Step 1: Sort the array in ascending order
  // This groups the numbers into natural pairs for each round
  nums.sort((a, b) => a - b);

  // Step 2: Initialize result array
  const arr = [];

  // Step 3: Process the sorted array in pairs
  // We iterate with step 2 to process [i, i+1] as a pair
  for (let i = 0; i < nums.length; i += 2) {
    // For each pair [a, b] where a < b (due to sorting):
    // - Bob gets b (the larger) and appends first
    // - Alice gets a (the smaller) and appends second
    // So we append b first, then a
    arr.push(nums[i + 1]); // Bob's number (larger in the pair)
    arr.push(nums[i]); // Alice's number (smaller in the pair)
  }

  return arr;
}
```

```java
// Time: O(n log n) | Space: O(n) for the result array
import java.util.*;

public List<Integer> numberGame(int[] nums) {
    // Step 1: Sort the array in ascending order
    // This groups the numbers into natural pairs for each round
    Arrays.sort(nums);

    // Step 2: Initialize result list
    List<Integer> arr = new ArrayList<>();

    // Step 3: Process the sorted array in pairs
    // We iterate with step 2 to process [i, i+1] as a pair
    for (int i = 0; i < nums.length; i += 2) {
        // For each pair [a, b] where a < b (due to sorting):
        // - Bob gets b (the larger) and appends first
        // - Alice gets a (the smaller) and appends second
        // So we append b first, then a
        arr.add(nums[i + 1]);  // Bob's number (larger in the pair)
        arr.add(nums[i]);      // Alice's number (smaller in the pair)
    }

    return arr;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array dominates the time complexity: O(n log n)
- The subsequent loop runs n/2 iterations, each doing constant work: O(n)
- Total: O(n log n + n) = O(n log n)

**Space Complexity: O(n) or O(1) depending on interpretation**

- If we count the output array: O(n) space for the result
- If we consider only auxiliary space (excluding output): O(1) for the sorting (in-place sort in most languages)
- The sorting algorithm typically uses O(log n) stack space for recursion (for quicksort variants) or O(1) for heapsort

## Common Mistakes

1. **Forgetting to sort the array first**: Some candidates try to find minimums dynamically without realizing the sorted order reveals the pattern. Always test with unsorted examples to see why sorting is necessary.

2. **Incorrect pair ordering**: The most common error is appending Alice's number first, then Bob's. Remember: Bob always appends his number first in each round. In the sorted array `[a, b, c, d]` where `a < b < c < d`, the order should be `[b, a, d, c]`, not `[a, b, c, d]` or `[a, b, d, c]`.

3. **Index out of bounds errors**: When iterating with `i += 2`, you must access `nums[i+1]`. Since the array length is guaranteed to be even, this is safe, but candidates sometimes use `i < len(nums)-1` instead of `i < len(nums)` which misses the last iteration.

4. **Modifying the input array unnecessarily**: Some solutions remove elements from the input array while building the result. This is inefficient and can cause index errors. The optimal solution only reads from the sorted array.

## When You'll See This Pattern

This problem teaches the **"sorted pairs processing"** pattern, which appears in several other problems:

1. **Array Partition I (LeetCode 561)**: Similar concept of sorting and processing in pairs to maximize the sum of minimums in each pair.

2. **Sort Array By Parity II (LeetCode 922)**: While not identical, it involves processing arrays with specific ordering constraints based on indices.

3. **Reorder Data in Log Files (LeetCode 937)**: Involves sorting with custom comparison logic, similar to how we need to understand the ordering rules before implementing the solution.

The core insight is recognizing when a problem's constraints allow you to transform it into a simpler sorting problem rather than simulating a complex process.

## Key Takeaways

1. **Look for patterns in the process**: Before coding, work through examples to identify if there's a simpler mathematical or structural pattern. Here, sorting revealed that the game always processes numbers in increasing pairs with swapped order.

2. **Sorting often simplifies problems**: When a problem involves repeatedly finding minimums or maximums, sorting first can transform an O(n²) process into O(n log n).

3. **Read constraints carefully**: The guarantee that the array has even length is crucial—it ensures we can always form complete pairs without special edge cases.

[Practice this problem on CodeJeet](/problem/minimum-number-game)
