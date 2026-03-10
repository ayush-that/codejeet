---
title: "Array Questions at MakeMyTrip: What to Expect"
description: "Prepare for Array interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-01"
category: "dsa-patterns"
tags: ["makemytrip", "array", "interview prep"]
---

If you're preparing for a software engineering interview at MakeMyTrip, you need to pay special attention to arrays. With 13 out of 24 total coding questions on their platform tagged as array problems, this isn't just another topic—it's the dominant data structure you'll encounter. This ratio (over 54%) tells a clear story: MakeMyTrip's technical screen heavily favors problems built on arrays, often layered with concepts from strings, two-pointers, and prefix sums. In real interviews, you're almost guaranteed to face at least one array-based question, frequently as the first coding challenge to assess fundamental problem-solving and clean code.

The emphasis makes practical sense. MakeMyTrip's core business—flight bookings, hotel searches, itinerary management—involves processing ordered sequences: lists of flights (sorted by price or time), arrays of hotel availability dates, or sequences of destination packages. Interviewers use array problems to test if you can efficiently manipulate and reason about this foundational data model.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's array problems aren't about obscure tricks. They focus on **applied algorithmic thinking for real-world data processing**. You'll see a strong preference for:

1.  **In-Place Array Manipulation & Two-Pointers:** This is their signature style. Problems often require rearranging or modifying an array without using extra space, mimicking memory-constrained processing of user data. Think: segregating even and odd numbers, moving zeros, or rotating arrays.
2.  **Prefix Sums and Sliding Window:** For problems involving subarrays, especially related to sums or averages. This directly models tasks like finding travel packages within a budget (subarray sum) or analyzing trends over a rolling date window.
3.  **Sorting-Based Solutions:** Many problems have a sorting step as a pre-processing move to simplify logic. This tests if you recognize when ordering data unlocks a simpler, often two-pointer, solution.
4.  **Basic Dynamic Programming (1D or 2D):** When present, DP is usually the iterative, tabulation variety for classic problems (like maximum subarray sum or climbing stairs), not complex recursive memoization. It's about efficient computation over sequences.

You will **not** typically find heavy graph theory, complex recursive DP, or advanced data structures like segment trees. The focus is on clean, efficient, and practical manipulation of linear data.

For example, a classic MakeMyTrip-style problem is **"Move all zeros to the end while maintaining the relative order of non-zero elements."** This tests in-place manipulation and two-pointer skills perfectly.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def moveZeroes(nums):
    """
    Uses a slow pointer `last_non_zero` to track the position for the next non-zero element.
    All elements before `last_non_zero` are non-zero in their original order.
    After the first pass, we fill the remainder of the array with zeros.
    """
    last_non_zero = 0
    # First pass: move all non-zero elements forward
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[last_non_zero] = nums[i]
            last_non_zero += 1
    # Second pass: fill the remaining indices with zeros
    for i in range(last_non_zero, len(nums)):
        nums[i] = 0
    return nums
```

```javascript
// Time: O(n) | Space: O(1)
function moveZeroes(nums) {
  let lastNonZero = 0;
  // Move non-zero elements to the front
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[lastNonZero] = nums[i];
      lastNonZero++;
    }
  }
  // Fill the rest with zeros
  for (let i = lastNonZero; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
}
```

```java
// Time: O(n) | Space: O(1)
public void moveZeroes(int[] nums) {
    int lastNonZero = 0;
    // Shift non-zero elements forward
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            nums[lastNonZero] = nums[i];
            lastNonZero++;
        }
    }
    // Zero out the remaining positions
    for (int i = lastNonZero; i < nums.length; i++) {
        nums[i] = 0;
    }
}
```

</div>

Another frequent pattern is the **"Prefix Sum"** used for problems like finding if there's a subarray with a given sum. This models checking for a sequence of travel options that fit a exact budget.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def subarraySum(nums, k):
    """
    Uses a hash map to store prefix sums and their frequencies.
    At each step, we check if (current_prefix_sum - k) exists in the map.
    If it does, it means a subarray summing to k exists ending at the current index.
    """
    count = 0
    prefix_sum = 0
    sum_map = {0: 1}  # Base case: prefix sum of 0 appears once

    for num in nums:
        prefix_sum += num
        # Check if we've seen the required complementary prefix sum before
        if (prefix_sum - k) in sum_map:
            count += sum_map[prefix_sum - k]
        # Update the frequency of the current prefix sum
        sum_map[prefix_sum] = sum_map.get(prefix_sum, 0) + 1
    return count
```

```javascript
// Time: O(n) | Space: O(n)
function subarraySum(nums, k) {
  let count = 0;
  let prefixSum = 0;
  const sumMap = new Map();
  sumMap.set(0, 1); // Base case

  for (const num of nums) {
    prefixSum += num;
    // Check for needed complement
    if (sumMap.has(prefixSum - k)) {
      count += sumMap.get(prefixSum - k);
    }
    // Update map
    sumMap.set(prefixSum, (sumMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int subarraySum(int[] nums, int k) {
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> sumMap = new HashMap<>();
    sumMap.put(0, 1); // Base case

    for (int num : nums) {
        prefixSum += num;
        // Check for complement
        if (sumMap.containsKey(prefixSum - k)) {
            count += sumMap.get(prefixSum - k);
        }
        // Update frequency
        sumMap.put(prefixSum, sumMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
```

</div>

## How MakeMyTrip Tests Array vs Other Companies

Compared to FAANG companies, MakeMyTrip's array questions are less about knowing the most esoteric algorithm and more about **demonstrating practical, bug-free implementation**. The difficulty often lies in the edge cases and the in-place constraint, not in the complexity of the underlying algorithm.

- **vs. Google/Amazon:** These companies might embed an array problem within a more complex system design scenario or use it to test knowledge of advanced data structures (e.g., solving a range query with a segment tree). MakeMyTrip's problems are more self-contained and classic.
- **vs. Startups:** Startups might ask more abstract, open-ended problems. MakeMyTrip's questions are usually well-defined LeetCode-style problems with clear optimal solutions.
- **The Unique Angle:** The "MakeMyTrip flavor" is the strong bias towards **space efficiency**. You'll frequently see the follow-up: "Can you do it in O(1) extra space?" This reflects a practical engineering mindset for handling large datasets (like user itineraries) efficiently.

## How to Prepare

1.  **Master In-Place Operations First:** Get comfortable with the two-pointer technique for partitioning, reversing, and sliding windows. Practice until you can write these methods without off-by-one errors.
2.  **Think in Prefixes:** For any problem involving subarray sums or contiguous segments, immediately consider if a prefix sum (or its hash map variant) can help.
3.  **Sort as a Tool:** If a problem mentions "pairs," "triplets," or "closest to target," consider if sorting the array first would allow a two-pointer solution. This is a common optimization step.
4.  **Practice Verbalizing Trade-offs:** Be ready to explain why you chose O(n) space vs. O(1) space, or why sorting is an acceptable pre-processing step. Interviewers here appreciate clarity on engineering decisions.

## Study Order

Follow this progression to build competence logically:

1.  **Basic Traversal & Two-Pointers:** Start with the absolute fundamentals of iterating and swapping elements in-place (e.g., Reverse String, Move Zeroes).
2.  **Sorting & Two-Pointers on Sorted Arrays:** Learn how sorting transforms problems (e.g., Two Sum II, 3Sum). This is a huge pattern cluster.
3.  **Prefix Sum & Sliding Window:** Master techniques for subarray analysis. Understand the difference between fixed-size windows (sliding window) and variable-size windows using a hash map of prefix sums.
4.  **Basic 1D Dynamic Programming:** Apply DP to sequences for classic problems like Maximum Subarray or Climbing Stairs. Focus on the iterative, tabulation approach.
5.  **Matrix/2D Array Traversal:** Finally, extend your skills to 2D arrays (matrixes), which often use variations of the same patterns (spiral traversal, search in a sorted matrix).

## Recommended Practice Order

Solve these problems in sequence to build the specific skills MakeMyTrip tests:

1.  **Move Zeroes (LeetCode #283)** - The quintessential in-place, two-pointer problem.
2.  **Two Sum II (LeetCode #167)** - Two-pointers on a sorted array.
3.  **3Sum (LeetCode #15)** - Sorting + two-pointers, a critical pattern.
4.  **Maximum Subarray (LeetCode #53)** - Introduces Kadane's algorithm (a form of DP).
5.  **Subarray Sum Equals K (LeetCode #560)** - The definitive prefix sum + hash map problem.
6.  **Product of Array Except Self (LeetCode #238)** - Tests clever use of prefix and suffix products, often in O(1) extra space.
7.  **Find All Duplicates in an Array (LeetCode #442)** - Advanced in-place manipulation using the array itself as a hash map.
8.  **Rotate Array (LeetCode #189)** - Tests understanding of reversal algorithms for in-place rotation.

By following this focused path, you'll be targeting the exact skills MakeMyTrip interviewers are looking for: efficient, practical, and clean manipulation of array data.

[Practice Array at MakeMyTrip](/company/makemytrip/array)
