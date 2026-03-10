---
title: "How to Solve Find the Kth Largest Integer in the Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Kth Largest Integer in the Array. Medium difficulty, 47.6% acceptance rate. Topics: Array, String, Divide and Conquer, Sorting, Heap (Priority Queue)."
date: "2027-06-19"
category: "dsa-patterns"
tags:
  ["find-the-kth-largest-integer-in-the-array", "array", "string", "divide-and-conquer", "medium"]
---

# How to Solve "Find the Kth Largest Integer in the Array"

This problem asks us to find the kth largest integer in an array of strings, where each string represents a non-negative integer without leading zeros. The twist is that we're dealing with string representations, not actual integers, and the numbers can be extremely large—potentially exceeding typical integer limits in programming languages. This makes direct numeric conversion risky, requiring careful string-based comparison.

## Visual Walkthrough

Let's trace through an example: `nums = ["3", "30", "1", "12", "25"]`, `k = 3`

We need the 3rd largest integer. First, let's understand what "largest" means here:

1. **Convert to actual numbers for comparison**: 3, 30, 1, 12, 25
2. **Sort in descending order**: 30, 25, 12, 3, 1
3. **Find the 3rd largest**: 12 (1st largest is 30, 2nd is 25, 3rd is 12)

But wait—we can't just convert to numbers if they're extremely large! Instead, we need to compare strings directly. How do we compare "30" vs "25"? We compare digit by digit: "3" vs "2" → "30" is larger. For same-length strings like "12" vs "30", we compare lexicographically: "3" > "1" so "30" > "12".

The key insight: When strings have different lengths, the longer one represents a larger number (since there are no leading zeros). So "100" (3 digits) > "99" (2 digits).

## Brute Force Approach

The most straightforward approach is:

1. Sort all the strings in descending order based on their numeric values
2. Return the string at position `k-1` (0-indexed)

The challenge is in the comparison function. We need to handle:

- Different lengths: longer strings are larger
- Same length: compare lexicographically (which works for same-length numeric strings)

**Why this is problematic as a brute force?**
Actually, this approach is quite reasonable! The "brute force" here would be to convert all strings to integers, but that fails for extremely large numbers that exceed language limits. The string-based sorting approach with custom comparison is actually the correct solution.

However, a truly naive approach might try to convert everything to integers first:

```python
# DON'T DO THIS - fails for large numbers!
def kthLargestNumber(nums, k):
    int_nums = [int(num) for num in nums]  # May overflow!
    int_nums.sort(reverse=True)
    return str(int_nums[k-1])
```

This fails when numbers exceed Python's integer limits (though Python handles big integers well, other languages don't).

## Optimized Approach

We have two main optimization paths:

### Approach 1: Sorting with Custom Comparator (Most Intuitive)

Sort the array with a comparator that:

1. First compares string lengths (longer = larger number)
2. If lengths are equal, compares lexicographically

Time complexity: O(n log n) for sorting, where n is the number of strings.

### Approach 2: QuickSelect (More Efficient)

We can use the QuickSelect algorithm to find the kth largest element in O(n) average time, O(n²) worst case. This is similar to finding the kth largest element in an array of integers, but with string comparison.

The QuickSelect approach:

1. Partition the array around a pivot
2. If pivot is at position k-1, return it
3. If pivot position > k-1, search in left partition
4. If pivot position < k-1, search in right partition

### Approach 3: Min-Heap (Good for Streaming Data)

Maintain a min-heap of size k. For each number:

1. Add to heap
2. If heap size > k, remove smallest (maintains k largest elements)
3. At the end, the root is the kth largest

Time complexity: O(n log k), which is better than O(n log n) when k is small.

For this problem, the sorting approach is simplest and most readable. The heap approach is more efficient when k is small relative to n. QuickSelect offers the best average-case time but is more complex to implement correctly.

## Optimal Solution

We'll implement the min-heap approach as it's both efficient and demonstrates an important pattern for "kth largest" problems. The key is maintaining only the k largest elements we've seen so far.

<div class="code-group">

```python
# Time: O(n log k) where n = len(nums), k = k
# Space: O(k) for the heap
import heapq

def kthLargestNumber(nums, k):
    """
    Find the kth largest integer in an array of string representations.

    Approach: Use a min-heap to maintain the k largest elements seen so far.
    The root of the heap will be the kth largest element at the end.

    Args:
        nums: List of strings representing integers
        k: The position to find (1-indexed)

    Returns:
        String representing the kth largest integer
    """
    # Min-heap to store the k largest elements
    # We'll store tuples of (negative_length, string) for proper comparison
    # or we can use a custom comparator - Python's heapq doesn't support
    # custom comparators easily, so we'll implement comparison manually

    heap = []

    for num in nums:
        # Convert to tuple for comparison: (-length, string)
        # Negative length because we want longer strings (larger numbers)
        # to be "smaller" in our min-heap comparison
        item = (-len(num), num)

        # Push to heap
        heapq.heappush(heap, item)

        # If heap exceeds size k, remove the smallest (which is actually
        # the "largest" by our inverted comparison - confusing, I know!)
        # Actually, let's think differently...

        # Better approach: Store actual values and use custom comparison
        # We'll implement a wrapper class for proper comparison

    # Actually, let me implement this more cleanly with a custom comparator
    # using a wrapper class

class NumString:
    def __init__(self, s):
        self.s = s

    def __lt__(self, other):
        # For min-heap, we want the "smaller" element to be at the root
        # But we're looking for kth LARGEST, so we want to keep larger elements
        # Actually, we want to compare based on numeric value

        # Compare lengths first
        if len(self.s) != len(other.s):
            # Shorter length means smaller number
            return len(self.s) > len(other.s)  # Reverse for min-heap logic
        # Same length: compare lexicographically
        return self.s > other.s

    def __eq__(self, other):
        return self.s == other.s

def kthLargestNumber(nums, k):
    """
    Min-heap approach with custom comparator.
    """
    heap = []

    for num in nums:
        num_obj = NumString(num)

        # Push to heap
        heapq.heappush(heap, num_obj)

        # If heap size exceeds k, remove the smallest (which is the
        # "largest" by normal comparison, but smallest in our heap)
        if len(heap) > k:
            heapq.heappop(heap)

    # The root of the heap is the kth largest element
    return heap[0].s

# Alternative simpler approach: Sort with custom key
def kthLargestNumberSimple(nums, k):
    """
    Simpler approach: Sort with custom comparator.
    This is O(n log n) time, O(n) space for Python's Timsort.
    """
    # Sort in descending order using a custom key
    # Convert to tuple: (length, string) for comparison
    # Sort by length descending, then by string descending for same length
    nums.sort(key=lambda x: (len(x), x), reverse=True)

    # Return the kth largest (0-indexed)
    return nums[k-1]
```

```javascript
// Time: O(n log k) where n = nums.length, k = k
// Space: O(k) for the heap
class MinHeap {
  constructor(comparator) {
    this.heap = [];
    this.comparator = comparator || ((a, b) => a - b);
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.size() === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.size() > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return root;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  sinkDown(index) {
    const length = this.size();
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

function kthLargestNumber(nums, k) {
  /**
   * Find the kth largest integer using a min-heap.
   *
   * We maintain a min-heap of size k containing the k largest elements.
   * The comparator ensures we compare strings by numeric value.
   */

  // Custom comparator for string numbers
  // Returns negative if a < b, 0 if equal, positive if a > b
  const comparator = (a, b) => {
    // Compare by length first
    if (a.length !== b.length) {
      return a.length - b.length; // Shorter is smaller
    }
    // Same length: compare lexicographically
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  // Create min-heap with our comparator
  const heap = new MinHeap(comparator);

  for (const num of nums) {
    heap.push(num);

    // If heap exceeds size k, remove the smallest (root)
    if (heap.size() > k) {
      heap.pop();
    }
  }

  // The root is the kth largest element
  return heap.peek();
}

// Alternative simpler approach
function kthLargestNumberSimple(nums, k) {
  /**
   * Simpler approach: Sort with custom comparator.
   * Time: O(n log n), Space: O(n) for sorting
   */
  nums.sort((a, b) => {
    // First compare by length
    if (a.length !== b.length) {
      return b.length - a.length; // Descending by length
    }
    // Same length: compare lexicographically in descending order
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  });

  return nums[k - 1];
}
```

```java
// Time: O(n log k) where n = nums.length, k = k
// Space: O(k) for the priority queue
import java.util.PriorityQueue;

class Solution {
    public String kthLargestNumber(String[] nums, int k) {
        /**
         * Find the kth largest integer using a min-heap.
         *
         * We use a priority queue (min-heap) that maintains the k largest
         * elements. When the size exceeds k, we remove the smallest.
         *
         * Custom comparator compares strings by their numeric value:
         * 1. Longer strings are larger (no leading zeros)
         * 2. Same length: compare lexicographically
         */

        // Min-heap with custom comparator
        PriorityQueue<String> minHeap = new PriorityQueue<>((a, b) -> {
            // First compare by length
            if (a.length() != b.length()) {
                return a.length() - b.length(); // Shorter strings come first
            }
            // Same length: compare lexicographically
            return a.compareTo(b);
        });

        for (String num : nums) {
            minHeap.offer(num);

            // If heap exceeds size k, remove the smallest
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }

        // The root is the kth largest element
        return minHeap.peek();
    }
}

// Alternative approach using sorting
class SolutionSorting {
    public String kthLargestNumber(String[] nums, int k) {
        /**
         * Simpler approach: Sort with custom comparator.
         * Time: O(n log n), Space: O(n) for sorting
         */
        Arrays.sort(nums, (a, b) -> {
            // First compare by length (descending)
            if (a.length() != b.length()) {
                return b.length() - a.length();
            }
            // Same length: compare lexicographically (descending)
            return b.compareTo(a);
        });

        return nums[k - 1];
    }
}
```

</div>

## Complexity Analysis

### Min-Heap Approach:

- **Time Complexity**: O(n log k)
  - We process n elements
  - Each heap operation (insert/remove) takes O(log k) time
  - Total: O(n log k)
- **Space Complexity**: O(k)
  - The heap stores at most k elements
  - Additional O(1) for variables

### Sorting Approach:

- **Time Complexity**: O(n log n)
  - Sorting n elements with comparison sort
  - Each comparison takes O(L) time where L is string length, but typically L is small
- **Space Complexity**: O(n) or O(1)
  - O(n) for Python's Timsort (needs temporary storage)
  - O(1) for in-place sorting in some languages (but recursion stack may add O(log n))

### QuickSelect Approach (not shown):

- **Time Complexity**: O(n) average, O(n²) worst case
- **Space Complexity**: O(1) iterative, O(log n) recursive

The min-heap approach is optimal when k is much smaller than n. When k is close to n, sorting might be better due to lower constant factors.

## Common Mistakes

1. **Converting strings to integers**: This fails for extremely large numbers that exceed language limits (like 10^100). Always compare as strings using length and lexicographic comparison.

2. **Wrong comparison logic**: When comparing strings of different lengths, remember: longer string = larger number (assuming no leading zeros). Don't just compare lexicographically without checking length first.

3. **Off-by-one with k**: Remember k is 1-indexed (1st largest, 2nd largest, etc.), but arrays are 0-indexed. The kth largest is at position k-1 in a sorted descending array.

4. **Heap size management**: When using a min-heap for kth largest, you need to maintain exactly k elements. If you add all elements then try to extract k times, you get O(n log n) time instead of O(n log k).

5. **Forgetting about duplicates**: The problem states "duplicate numbers should be counted distinctly." So ["2", "2", "1"] with k=2 should return "2", not "1".

## When You'll See This Pattern

This "kth largest/smallest" pattern appears frequently in coding interviews:

1. **Kth Largest Element in an Array (LeetCode 215)**: The integer version of this problem, often solved with QuickSelect or heaps.

2. **Top K Frequent Elements (LeetCode 347)**: Similar heap-based approach but with frequency counting.

3. **Find Median from Data Stream (LeetCode 295)**: Uses two heaps to maintain median, related to finding kth element dynamically.

4. **K Closest Points to Origin (LeetCode 973)**: Another "top K" problem using heap or QuickSelect.

The pattern: When you need the kth largest/smallest element, consider:

- Sorting if n is small or you need all elements sorted anyway
- Min-heap (for kth largest) or max-heap (for kth smallest) if k is small
- QuickSelect for average O(n) time when you don't need sorted order

## Key Takeaways

1. **String number comparison**: When comparing numeric strings, compare length first (longer = larger), then lexicographically if lengths are equal. This handles arbitrarily large numbers.

2. **Heap for kth element**: A min-heap of size k maintains the k largest elements seen so far (root is the smallest of those k, i.e., the kth largest overall).

3. **Trade-offs matter**: Sorting is simpler O(n log n), heap is O(n log k) better for small k, QuickSelect is O(n) average but more complex. Choose based on constraints and interview context.

4. **Watch for 1-indexing**: "kth largest" usually means 1-indexed position, convert to 0-indexed for array access.

Related problems: [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array)
