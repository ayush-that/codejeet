---
title: "How to Solve Number of Distinct Averages — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Distinct Averages. Easy difficulty, 58.9% acceptance rate. Topics: Array, Hash Table, Two Pointers, Sorting."
date: "2028-01-04"
category: "dsa-patterns"
tags: ["number-of-distinct-averages", "array", "hash-table", "two-pointers", "easy"]
---

# How to Solve Number of Distinct Averages

This problem asks us to repeatedly pair the smallest and largest numbers from an array, calculate their average, and count how many unique averages we get. What makes this interesting is that the pairing process is deterministic—we always pair the current minimum with the current maximum—but we need to efficiently track which numbers remain after each removal. The challenge lies in finding an approach that avoids repeatedly scanning for min/max values.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 1, 4, 3, 5, 2]`

**Step 1:** Sort the array first: `[1, 2, 3, 4, 4, 5]`

**Step 2:** Pair the smallest and largest remaining numbers:

- Pair 1 and 5 → average = (1 + 5) / 2 = 3.0
- Remove these from consideration

**Step 3:** Next smallest and largest:

- Pair 2 and 4 → average = (2 + 4) / 2 = 3.0
- Remove these

**Step 4:** Final pair:

- Pair 3 and 4 → average = (3 + 4) / 2 = 3.5
- Remove these

We get averages: 3.0, 3.0, 3.5 → Distinct averages: {3.0, 3.5} → **Answer: 2**

Notice that sorting allows us to easily access the smallest (left end) and largest (right end) values without repeatedly scanning. We can use two pointers to track which elements we've already paired.

## Brute Force Approach

A naive approach would be to repeatedly:

1. Scan the array to find the minimum value
2. Scan again to find the maximum value
3. Remove both from the array
4. Calculate and store their average
5. Repeat until the array is empty

This is inefficient because:

- Finding min/max requires O(n) time each scan
- Removing elements from an array requires shifting elements, which is O(n)
- With n/2 iterations, this becomes O(n²) time complexity

While this would work for small inputs, it fails for larger arrays. Let's see why we need a better approach:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def distinctAveragesBrute(nums):
    averages = set()

    while nums:
        # Find minimum - O(n)
        min_val = min(nums)
        nums.remove(min_val)  # O(n) due to shifting

        # Find maximum - O(n)
        max_val = max(nums)
        nums.remove(max_val)  # O(n) due to shifting

        # Calculate average
        avg = (min_val + max_val) / 2
        averages.add(avg)

    return len(averages)
```

```javascript
// Time: O(n²) | Space: O(n)
function distinctAveragesBrute(nums) {
  const averages = new Set();

  while (nums.length > 0) {
    // Find minimum - O(n)
    const minVal = Math.min(...nums);
    const minIndex = nums.indexOf(minVal);
    nums.splice(minIndex, 1); // O(n) due to shifting

    // Find maximum - O(n)
    const maxVal = Math.max(...nums);
    const maxIndex = nums.indexOf(maxVal);
    nums.splice(maxIndex, 1); // O(n) due to shifting

    // Calculate average
    const avg = (minVal + maxVal) / 2;
    averages.add(avg);
  }

  return averages.size;
}
```

```java
// Time: O(n²) | Space: O(n)
public int distinctAveragesBrute(int[] nums) {
    List<Integer> list = new ArrayList<>();
    for (int num : nums) {
        list.add(num);
    }

    Set<Double> averages = new HashSet<>();

    while (!list.isEmpty()) {
        // Find minimum - O(n)
        int minVal = Collections.min(list);
        list.remove(Integer.valueOf(minVal));  // O(n) due to shifting

        // Find maximum - O(n)
        int maxVal = Collections.max(list);
        list.remove(Integer.valueOf(maxVal));  // O(n) due to shifting

        // Calculate average
        double avg = (minVal + maxVal) / 2.0;
        averages.add(avg);
    }

    return averages.size;
}
```

</div>

The brute force approach has O(n²) time complexity because for each of the n/2 pairs, we perform O(n) operations to find and remove elements. We need to optimize this.

## Optimal Solution

The key insight is that we don't need to physically remove elements. If we sort the array first, the smallest elements will be at the beginning and the largest at the end. We can use two pointers to pair them without modifying the original array.

**Algorithm:**

1. Sort the array in ascending order
2. Initialize two pointers: `left = 0` (start) and `right = n-1` (end)
3. Initialize a set to store unique averages
4. While `left < right`:
   - Pair `nums[left]` (smallest remaining) with `nums[right]` (largest remaining)
   - Calculate average = `(nums[left] + nums[right]) / 2.0`
   - Add to set
   - Move `left` forward and `right` backward
5. Return the size of the set

This works because after sorting, as we move inward from both ends, we're always pairing the next smallest with the next largest—exactly what the problem requires.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def distinctAverages(nums):
    """
    Counts the number of distinct averages formed by pairing
    the smallest and largest numbers repeatedly.

    Args:
        nums: List of integers with even length

    Returns:
        Number of distinct averages
    """
    # Step 1: Sort the array to easily access min and max values
    # Sorting groups smallest values at start, largest at end
    nums.sort()

    # Step 2: Initialize two pointers
    left = 0           # Points to smallest remaining element
    right = len(nums) - 1  # Points to largest remaining element
    averages = set()   # Store unique averages

    # Step 3: Pair smallest with largest until pointers meet
    # We use < instead of <= because we need pairs (two elements)
    while left < right:
        # Calculate average of current pair
        # Using float division to handle integer inputs correctly
        avg = (nums[left] + nums[right]) / 2.0

        # Add to set (duplicates are automatically ignored)
        averages.add(avg)

        # Move pointers inward to next pair
        left += 1   # Next smallest element
        right -= 1  # Next largest element

    # Step 4: Return count of distinct averages
    return len(averages)
```

```javascript
// Time: O(n log n) | Space: O(n)
function distinctAverages(nums) {
  /**
   * Counts the number of distinct averages formed by pairing
   * the smallest and largest numbers repeatedly.
   *
   * @param {number[]} nums - Array of integers with even length
   * @return {number} - Number of distinct averages
   */
  // Step 1: Sort the array in ascending order
  // This ensures smallest values are at start, largest at end
  nums.sort((a, b) => a - b);

  // Step 2: Initialize pointers and set
  let left = 0; // Points to smallest remaining element
  let right = nums.length - 1; // Points to largest remaining element
  const averages = new Set(); // Store unique averages

  // Step 3: Pair elements until pointers meet
  // We need left < right because each pair requires two elements
  while (left < right) {
    // Calculate average of current pair
    // Divide by 2.0 to ensure floating-point result
    const avg = (nums[left] + nums[right]) / 2.0;

    // Add to set (duplicates are automatically ignored)
    averages.add(avg);

    // Move pointers inward for next iteration
    left++; // Move to next smallest element
    right--; // Move to next largest element
  }

  // Step 4: Return count of distinct averages
  return averages.size;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int distinctAverages(int[] nums) {
    /**
     * Counts the number of distinct averages formed by pairing
     * the smallest and largest numbers repeatedly.
     *
     * @param nums - Array of integers with even length
     * @return Number of distinct averages
     */
    // Step 1: Sort the array in ascending order
    // Arrays.sort uses dual-pivot quicksort for primitives
    Arrays.sort(nums);

    // Step 2: Initialize pointers and set
    int left = 0;                 // Points to smallest remaining element
    int right = nums.length - 1;  // Points to largest remaining element
    Set<Double> averages = new HashSet<>();  // Store unique averages

    // Step 3: Pair elements until pointers meet
    // We need left < right because each pair requires two elements
    while (left < right) {
        // Calculate average of current pair
        // Cast to double to ensure floating-point division
        double avg = (nums[left] + nums[right]) / 2.0;

        // Add to set (duplicates are automatically ignored)
        averages.add(avg);

        // Move pointers inward for next iteration
        left++;   // Move to next smallest element
        right--;  // Move to next largest element
    }

    // Step 4: Return count of distinct averages
    return averages.size;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time (dominant term)
- The two-pointer traversal takes O(n) time (n/2 iterations)
- Set operations (add, contains) take O(1) average time
- Overall: O(n log n) + O(n) = O(n log n)

**Space Complexity: O(n)**

- Sorting may use O(log n) to O(n) space depending on the algorithm
- The set stores at most n/2 averages → O(n) space
- Overall: O(n) for the set dominates

## Common Mistakes

1. **Forgetting to sort the array**: Without sorting, you can't efficiently pair min and max values. Some candidates try to maintain min-heap and max-heap, which is overkill for this problem.

2. **Integer division error**: Calculating `(a + b) / 2` with integers performs integer division in some languages (like Java), truncating the decimal. Always use `2.0` or cast to float/double.

3. **Incorrect pointer condition**: Using `left <= right` instead of `left < right` would try to pair an element with itself when the array has odd length (though the problem guarantees even length, it's still logically incorrect).

4. **Modifying the original array**: Some candidates physically remove elements after pairing, which is inefficient. The two-pointer approach avoids this by just moving pointers.

5. **Not using a Set for uniqueness**: Using a list or array to store averages and then checking for duplicates would require O(n²) time for uniqueness checking. A Set gives us O(1) lookups.

## When You'll See This Pattern

The "two pointers from ends" pattern appears in many array problems:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Similar two-pointer approach where you move inward based on whether the sum is too small or too large.

2. **Container With Most Water (LeetCode 11)**: Uses two pointers from ends, moving the pointer with the smaller height inward to potentially find a better container.

3. **3Sum (LeetCode 15)**: After fixing one element, uses two pointers to find pairs that sum to a target value.

4. **Valid Palindrome (LeetCode 125)**: Two pointers from both ends comparing characters as they move inward.

The pattern is useful when you need to pair or compare elements from opposite ends of a sorted collection, or when you need to find pairs that satisfy some condition.

## Key Takeaways

1. **Sorting enables efficient pairing**: When you need to repeatedly pair min and max values, sorting transforms an O(n²) problem into O(n log n) by making min/max access O(1).

2. **Two pointers avoid modifications**: Instead of physically removing elements (which is expensive), use pointers to track which elements have been "used" without modifying the data structure.

3. **Sets for uniqueness tracking**: When you need to count distinct values, a Set is the natural choice with O(1) average time operations.

4. **Watch for integer division**: In statically-typed languages, integer division truncates decimals. Always use floating-point division when averages or ratios are needed.

Related problems: [Two Sum](/problem/two-sum), [Finding Pairs With a Certain Sum](/problem/finding-pairs-with-a-certain-sum), [Minimum Average of Smallest and Largest Elements](/problem/minimum-average-of-smallest-and-largest-elements)
