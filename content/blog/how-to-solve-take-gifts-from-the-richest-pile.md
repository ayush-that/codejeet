---
title: "How to Solve Take Gifts From the Richest Pile — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Take Gifts From the Richest Pile. Easy difficulty, 75.5% acceptance rate. Topics: Array, Heap (Priority Queue), Simulation."
date: "2026-02-01"
category: "dsa-patterns"
tags: ["take-gifts-from-the-richest-pile", "array", "heap-(priority-queue)", "simulation", "easy"]
---

# How to Solve Take Gifts From the Richest Pile

This problem asks us to repeatedly find the maximum value in an array, replace it with its square root (floored), and do this `k` times. What makes this interesting is that after each operation, the maximum value changes—we need to efficiently track and update the current maximum. While a brute force approach is straightforward, the optimal solution requires recognizing that we're repeatedly performing "extract max" and "insert" operations, which is exactly what a max-heap is designed for.

## Visual Walkthrough

Let's trace through a concrete example: `gifts = [25, 64, 9, 4, 100]` with `k = 4`.

**Initial state:** `[25, 64, 9, 4, 100]`  
Maximum is 100 (pile with 100 gifts)

**Step 1 (k=4):** Take from pile with 100 gifts  
Replace 100 with floor(√100) = floor(10) = 10  
New array: `[25, 64, 9, 4, 10]`  
Maximum is now 64

**Step 2 (k=3):** Take from pile with 64 gifts  
Replace 64 with floor(√64) = floor(8) = 8  
New array: `[25, 8, 9, 4, 10]`  
Maximum is now 25

**Step 3 (k=2):** Take from pile with 25 gifts  
Replace 25 with floor(√25) = floor(5) = 5  
New array: `[5, 8, 9, 4, 10]`  
Maximum is now 10

**Step 4 (k=1):** Take from pile with 10 gifts  
Replace 10 with floor(√10) = floor(3.162...) = 3  
New array: `[5, 8, 9, 4, 3]`

**Final sum:** 5 + 8 + 9 + 4 + 3 = 29

Notice how the maximum keeps changing after each operation. A naive approach that scans the entire array each time would be inefficient for large arrays or large k values.

## Brute Force Approach

The most straightforward solution is to simulate the process exactly as described:

1. For each of the k operations:
   - Scan the entire array to find the maximum value
   - Replace that maximum with its square root (floored)
2. After k operations, sum all values in the array

<div class="code-group">

```python
# Time: O(k * n) | Space: O(1)
def pickGiftsBruteForce(gifts, k):
    """
    Brute force solution: repeatedly scan for max and update.
    This is inefficient for large inputs.
    """
    for _ in range(k):
        # Step 1: Find the index of maximum element
        max_idx = 0
        for i in range(1, len(gifts)):
            if gifts[i] > gifts[max_idx]:
                max_idx = i

        # Step 2: Replace with floor(sqrt(max_value))
        gifts[max_idx] = int(gifts[max_idx] ** 0.5)

    # Step 3: Return sum of all gifts
    return sum(gifts)
```

```javascript
// Time: O(k * n) | Space: O(1)
function pickGiftsBruteForce(gifts, k) {
  // Brute force solution: repeatedly scan for max and update
  for (let operation = 0; operation < k; operation++) {
    // Step 1: Find the index of maximum element
    let maxIdx = 0;
    for (let i = 1; i < gifts.length; i++) {
      if (gifts[i] > gifts[maxIdx]) {
        maxIdx = i;
      }
    }

    // Step 2: Replace with floor(sqrt(max_value))
    gifts[maxIdx] = Math.floor(Math.sqrt(gifts[maxIdx]));
  }

  // Step 3: Return sum of all gifts
  return gifts.reduce((sum, val) => sum + val, 0);
}
```

```java
// Time: O(k * n) | Space: O(1)
public long pickGiftsBruteForce(int[] gifts, int k) {
    // Brute force solution: repeatedly scan for max and update
    for (int operation = 0; operation < k; operation++) {
        // Step 1: Find the index of maximum element
        int maxIdx = 0;
        for (int i = 1; i < gifts.length; i++) {
            if (gifts[i] > gifts[maxIdx]) {
                maxIdx = i;
            }
        }

        // Step 2: Replace with floor(sqrt(max_value))
        gifts[maxIdx] = (int) Math.sqrt(gifts[maxIdx]);
    }

    // Step 3: Return sum of all gifts
    long total = 0;
    for (int gift : gifts) {
        total += gift;
    }
    return total;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(k × n) where n is the number of piles and k is the number of operations
- For each of k operations, we scan all n elements to find the maximum
- If k is large (up to 10⁹ in constraints) or n is large, this becomes prohibitively slow
- We need a way to find the maximum faster than O(n) each time

## Optimal Solution

The key insight is that we need to repeatedly:

1. Find the current maximum value
2. Remove it (temporarily)
3. Insert its square root (floored)

This is exactly what a **max-heap** (priority queue) is designed for! A max-heap lets us:

- Get the maximum in O(1) time
- Remove the maximum in O(log n) time
- Insert a new value in O(log n) time

By using a max-heap, we reduce the time per operation from O(n) to O(log n).

<div class="code-group">

```python
# Time: O(n + k log n) | Space: O(n)
def pickGifts(gifts, k):
    """
    Optimal solution using max-heap (implemented with negative values in min-heap).

    Steps:
    1. Convert all gifts to negative values and push into a min-heap
       (This simulates a max-heap since Python only has min-heap)
    2. For k operations:
       a. Pop the maximum (negative of smallest negative)
       b. Calculate its square root (floored)
       c. Push the negative of the new value back
    3. Sum all values (converting back from negatives)
    """
    import heapq

    # Step 1: Create a max-heap using negative values
    # Python's heapq is a min-heap, so we store negatives to simulate max-heap
    max_heap = []
    for gift in gifts:
        heapq.heappush(max_heap, -gift)  # Store negative for max-heap behavior

    # Step 2: Perform k operations
    for _ in range(k):
        # Get the current maximum (negative of what we stored)
        current_max = -heapq.heappop(max_heap)

        # Calculate floor(sqrt(current_max))
        new_value = int(current_max ** 0.5)

        # Push the new value back (as negative for max-heap)
        heapq.heappush(max_heap, -new_value)

    # Step 3: Calculate total sum
    # Convert negatives back to positives and sum
    total = 0
    while max_heap:
        total += -heapq.heappop(max_heap)

    return total
```

```javascript
// Time: O(n + k log n) | Space: O(n)
function pickGifts(gifts, k) {
  /**
   * Optimal solution using max-heap.
   *
   * Steps:
   * 1. Build a max-heap from the gifts array
   * 2. For k operations:
   *    a. Extract the maximum value
   *    b. Calculate floor(sqrt(max_value))
   *    c. Insert the new value back
   * 3. Sum all values in the heap
   */

  // Helper function to maintain max-heap property
  function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }

  // Step 1: Build max-heap
  const n = gifts.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(gifts, n, i);
  }

  // Step 2: Perform k operations
  for (let operation = 0; operation < k; operation++) {
    // The maximum is at index 0 in max-heap
    const currentMax = gifts[0];

    // Calculate floor(sqrt(current_max))
    const newValue = Math.floor(Math.sqrt(currentMax));

    // Replace root with new value and heapify
    gifts[0] = newValue;
    heapify(gifts, n, 0);
  }

  // Step 3: Calculate total sum
  return gifts.reduce((sum, val) => sum + val, 0);
}
```

```java
// Time: O(n + k log n) | Space: O(n)
public long pickGifts(int[] gifts, int k) {
    /**
     * Optimal solution using PriorityQueue as max-heap.
     *
     * Steps:
     * 1. Create a max-heap (PriorityQueue with reverse order)
     * 2. Add all gifts to the heap
     * 3. For k operations:
     *    a. Poll the maximum value
     *    b. Calculate floor(sqrt(max_value))
     *    c. Offer the new value back
     * 4. Sum all values remaining in the heap
     */

    // Step 1: Create max-heap using PriorityQueue with reverse order
    // Comparator.reverseOrder() makes it a max-heap
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

    // Add all gifts to the max-heap
    for (int gift : gifts) {
        maxHeap.offer(gift);
    }

    // Step 2: Perform k operations
    for (int operation = 0; operation < k; operation++) {
        // Get and remove the current maximum
        int currentMax = maxHeap.poll();

        // Calculate floor(sqrt(current_max))
        int newValue = (int) Math.sqrt(currentMax);

        // Add the new value back to the heap
        maxHeap.offer(newValue);
    }

    // Step 3: Calculate total sum
    long total = 0;
    while (!maxHeap.isEmpty()) {
        total += maxHeap.poll();
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k log n)**

- **Heap construction:** O(n) to build the initial max-heap
- **k operations:** Each operation involves:
  - Extracting maximum: O(log n)
  - Calculating square root: O(1)
  - Inserting new value: O(log n)
  - Total per operation: O(log n)
- **Sum calculation:** O(n) to extract and sum all values
- **Overall:** O(n + k log n + n) = O(n + k log n)

**Space Complexity: O(n)**

- We need to store all n elements in the heap
- In Python/Java, we create a new heap structure
- In JavaScript, we modify the input array in-place, so O(1) additional space, but typically we'd consider O(n) for the heap structure

## Common Mistakes

1. **Using array scanning instead of a heap:** The most common mistake is implementing the brute force O(k × n) solution. This fails on large inputs where k or n is large. Always ask yourself: "Am I repeatedly finding/extracting maximums?" If yes, think "heap!"

2. **Forgetting to floor the square root:** The problem specifies "reduce the number of gifts in the pile to the floor of the square root." Using regular square root without flooring gives incorrect results. In Python, `int()` truncates toward zero, which works for positive numbers. In JavaScript/Java, use `Math.floor()`.

3. **Incorrect heap implementation:**
   - In Python: Forgetting to use negative values to simulate a max-heap
   - In Java: Using default `PriorityQueue` (which is min-heap) without `Comparator.reverseOrder()`
   - In JavaScript: Not properly implementing heapify or using the wrong comparison operators

4. **Not handling large sums correctly:** The total can exceed 32-bit integer limits. Use `long` in Java, and be mindful of integer overflow in other languages.

## When You'll See This Pattern

This "repeatedly extract max/min and insert modified value" pattern appears in many problems:

1. **Remove Stones to Minimize the Total (Medium)** - Almost identical! Instead of square root, you halve the maximum value. The heap approach is exactly the same.

2. **Last Stone Weight (Easy)** - Repeatedly take the two heaviest stones, smash them together, and insert the result if non-zero. Uses a max-heap to efficiently track the heaviest stones.

3. **Maximum Score From Removing Stones (Medium)** - You have three piles, repeatedly remove from the two largest piles. While simpler (only 3 piles), it uses the same "find two maximums" logic.

The pattern to recognize: **When you need to repeatedly find and modify extreme values (maximum/minimum) in a collection, think "priority queue/heap."**

## Key Takeaways

1. **Heap for repeated max/min operations:** Whenever a problem involves repeatedly finding and updating the maximum or minimum element, a heap (priority queue) is usually the optimal solution. It reduces these operations from O(n) to O(log n).

2. **Simulation problems often need optimization:** Many "simulation" problems (like this one) have a straightforward brute force solution that's too slow. The challenge is recognizing the pattern and applying the right data structure.

3. **Language-specific heap implementations:**
   - Python: Use `heapq` (min-heap only, use negatives for max-heap)
   - Java: Use `PriorityQueue` (min-heap by default, use `Comparator.reverseOrder()` for max-heap)
   - JavaScript: No built-in heap, implement your own or use a library

Related problems: [Remove Stones to Minimize the Total](/problem/remove-stones-to-minimize-the-total)
