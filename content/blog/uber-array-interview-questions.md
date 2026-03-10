---
title: "Array Questions at Uber: What to Expect"
description: "Prepare for Array interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-05-20"
category: "dsa-patterns"
tags: ["uber", "array", "interview prep"]
---

## Why Array Questions Dominate Uber Interviews

If you're preparing for Uber, here's a number you need to know: 212. That's how many array-related problems appear in their tagged LeetCode questions out of 381 total — over 55% of their technical interview content. This isn't a coincidence or a quirk of their tagging system. It reflects a fundamental reality about Uber's engineering problems.

Uber's core business — matching riders with drivers, calculating optimal routes, pricing trips dynamically, and managing surge pricing — is built on processing massive streams of location data, time series, and discrete events. These are all fundamentally array problems. When you're tracking millions of moving vehicles, you're dealing with arrays of coordinates. When you're calculating ETAs, you're processing arrays of historical travel times. When you're implementing surge pricing, you're analyzing arrays of supply/demand ratios over time.

In real interviews, you'll almost certainly encounter at least one array problem, often as your first technical question. They use arrays not just to test basic coding ability, but as a vehicle for evaluating how you think about **real-time data processing, state management over time, and optimization under constraints** — the exact skills needed to keep their platform running.

## Specific Patterns Uber Favors

Uber's array problems cluster around a few distinct patterns that mirror their engineering challenges:

1. **Sliding Window with Complex Conditions**: Not just basic "find the longest subarray with sum ≤ K" problems. Uber loves windows where the constraint involves maintaining multiple invariants simultaneously. Think "longest subarray with at most two distinct elements" or "subarrays where max-min ≤ limit." These model real problems like finding time windows where driver supply meets certain quality thresholds.

2. **Interval Merging and Scheduling**: This is huge. Uber constantly deals with intervals — driver availability windows, ride requests with pickup time ranges, maintenance schedules for vehicles. Problems like **Meeting Rooms II (#253)** and **Merge Intervals (#56)** appear frequently because they directly model resource allocation.

3. **Array Transformation with State Machines**: Problems where you need to apply rules to transform an array based on neighboring elements. **Game of Life (#289)** is a classic example, but Uber often uses variations that model state changes in their systems (like a driver's status changing based on nearby requests).

4. **Two-Pointer with Non-Obvious Pairing**: Beyond simple two-sum, they favor problems where you need to intelligently move pointers based on derived values. **Trapping Rain Water (#42)** is a favorite because it requires maintaining left/right max states while processing — similar to calculating capacity constraints in real-time.

<div class="code-group">

```python
# Uber's Favorite: Sliding Window with Complex State
# Problem: Longest Subarray with At Most K Distinct Elements (LeetCode #340)
# Time: O(n) | Space: O(k) where k is number of distinct elements allowed
def longest_subarray_with_k_distinct(nums, k):
    if not nums or k == 0:
        return 0

    char_count = {}
    left = 0
    max_length = 0

    for right in range(len(nums)):
        # Add current character to window
        char_count[nums[right]] = char_count.get(nums[right], 0) + 1

        # Shrink window while we have too many distinct elements
        while len(char_count) > k:
            char_count[nums[left]] -= 1
            if char_count[nums[left]] == 0:
                del char_count[nums[left]]
            left += 1

        # Update max length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Uber's Favorite: Sliding Window with Complex State
// Problem: Longest Subarray with At Most K Distinct Elements (LeetCode #340)
// Time: O(n) | Space: O(k) where k is number of distinct elements allowed
function longestSubarrayWithKDistinct(nums, k) {
  if (!nums || nums.length === 0 || k === 0) return 0;

  const charCount = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < nums.length; right++) {
    // Add current element to window
    charCount.set(nums[right], (charCount.get(nums[right]) || 0) + 1);

    // Shrink window while we have too many distinct elements
    while (charCount.size > k) {
      charCount.set(nums[left], charCount.get(nums[left]) - 1);
      if (charCount.get(nums[left]) === 0) {
        charCount.delete(nums[left]);
      }
      left++;
    }

    // Update max length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
// Uber's Favorite: Sliding Window with Complex State
// Problem: Longest Subarray with At Most K Distinct Elements (LeetCode #340)
// Time: O(n) | Space: O(k) where k is number of distinct elements allowed
public int longestSubarrayWithKDistinct(int[] nums, int k) {
    if (nums == null || nums.length == 0 || k == 0) return 0;

    Map<Integer, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < nums.length; right++) {
        // Add current element to window
        charCount.put(nums[right], charCount.getOrDefault(nums[right], 0) + 1);

        // Shrink window while we have too many distinct elements
        while (charCount.size() > k) {
            charCount.put(nums[left], charCount.get(nums[left]) - 1);
            if (charCount.get(nums[left]) == 0) {
                charCount.remove(nums[left]);
            }
            left++;
        }

        // Update max length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

## How to Prepare

Don't just solve array problems — solve them with Uber's constraints in mind. Here's my approach:

1. **Always think in terms of streaming data**: Uber processes data in real-time. When you solve an array problem, ask: "Could this work if the array was arriving one element at a time?" This mindset will lead you to optimal sliding window and two-pointer solutions instead of brute force.

2. **Master the state transition**: For interval problems, practice drawing the timeline. For sliding window, practice tracking the exact invariants. Uber interviewers want to see you manage complexity cleanly.

3. **Practice deriving formulas**: Many Uber array problems involve calculating something like "number of subarrays where max-min ≤ limit." You need to be comfortable going from the brute force O(n³) to the optimal O(n) by recognizing patterns.

<div class="code-group">

```python
# Interval Scheduling Pattern (Uber Core Concept)
# Problem: Meeting Rooms II (LeetCode #253)
# Time: O(n log n) | Space: O(n)
def min_meeting_rooms(intervals):
    if not intervals:
        return 0

    # Separate start and end times
    start_times = sorted([i[0] for i in intervals])
    end_times = sorted([i[1] for i in intervals])

    start_ptr = 0
    end_ptr = 0
    rooms_needed = 0
    max_rooms = 0

    # Process in timeline order
    while start_ptr < len(intervals):
        if start_times[start_ptr] < end_times[end_ptr]:
            # A meeting is starting before one ends
            rooms_needed += 1
            start_ptr += 1
            max_rooms = max(max_rooms, rooms_needed)
        else:
            # A meeting ended, free up a room
            rooms_needed -= 1
            end_ptr += 1

    return max_rooms
```

```javascript
// Interval Scheduling Pattern (Uber Core Concept)
// Problem: Meeting Rooms II (LeetCode #253)
// Time: O(n log n) | Space: O(n)
function minMeetingRooms(intervals) {
  if (!intervals || intervals.length === 0) return 0;

  // Separate start and end times
  const startTimes = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const endTimes = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let startPtr = 0;
  let endPtr = 0;
  let roomsNeeded = 0;
  let maxRooms = 0;

  // Process in timeline order
  while (startPtr < intervals.length) {
    if (startTimes[startPtr] < endTimes[endPtr]) {
      // A meeting is starting before one ends
      roomsNeeded++;
      startPtr++;
      maxRooms = Math.max(maxRooms, roomsNeeded);
    } else {
      // A meeting ended, free up a room
      roomsNeeded--;
      endPtr++;
    }
  }

  return maxRooms;
}
```

```java
// Interval Scheduling Pattern (Uber Core Concept)
// Problem: Meeting Rooms II (LeetCode #253)
// Time: O(n log n) | Space: O(n)
public int minMeetingRooms(int[][] intervals) {
    if (intervals == null || intervals.length == 0) return 0;

    // Separate start and end times
    int[] startTimes = new int[intervals.length];
    int[] endTimes = new int[intervals.length];

    for (int i = 0; i < intervals.length; i++) {
        startTimes[i] = intervals[i][0];
        endTimes[i] = intervals[i][1];
    }

    Arrays.sort(startTimes);
    Arrays.sort(endTimes);

    int startPtr = 0;
    int endPtr = 0;
    int roomsNeeded = 0;
    int maxRooms = 0;

    // Process in timeline order
    while (startPtr < intervals.length) {
        if (startTimes[startPtr] < endTimes[endPtr]) {
            // A meeting is starting before one ends
            roomsNeeded++;
            startPtr++;
            maxRooms = Math.max(maxRooms, roomsNeeded);
        } else {
            // A meeting ended, free up a room
            roomsNeeded--;
            endPtr++;
        }
    }

    return maxRooms;
}
```

</div>

## How Uber Tests Array vs Other Companies

Uber's array questions differ from other companies in three key ways:

1. **More applied, less theoretical**: Compared to Google, which might ask about array algorithms with pure mathematical constraints, Uber's problems usually have a clear real-world analogy. You're not just finding subarrays — you're finding time windows where certain business conditions hold.

2. **Emphasis on optimal incremental updates**: Facebook might accept a solution that re-scans parts of the array. Uber wants solutions that maintain state efficiently as you move through the array, because their systems need to handle data streams with minimal recomputation.

3. **Medium-hard difficulty sweet spot**: Uber rarely asks the hardest array problems (like some of Google's DP monsters), but their medium problems often have tricky edge cases. They care about clean handling of boundary conditions because their systems run at scale where edge cases become critical failures.

## Study Order

1. **Two-pointer basics** - Start with problems like **Two Sum (#1)** and **Container With Most Water (#11)**. These teach you how to efficiently explore array pairs without brute force.

2. **Sliding window fundamentals** - Master **Maximum Subarray (#53)** and **Minimum Size Subarray Sum (#209)** first. Understand when to expand vs contract the window.

3. **Interval operations** - Learn **Merge Intervals (#56)** and **Insert Interval (#57)**. These are building blocks for more complex scheduling problems.

4. **Advanced sliding window** - Tackle **Longest Substring with At Most K Distinct Characters (#340)** and **Subarrays with K Different Integers (#992)**. These teach you to manage complex window invariants.

5. **Array transformation** - Practice **Game of Life (#289)** and **Rotate Image (#48)**. These help you think about in-place operations with dependencies.

6. **Optimization patterns** - Finally, combine patterns in problems like **Trapping Rain Water (#42)** and **Maximum Product Subarray (#152)**.

## Recommended Practice Order

Solve these in sequence to build up your Uber array skills:

1. **Two Sum (#1)** - Basic hash map usage
2. **Best Time to Buy and Sell Stock (#121)** - Simple single pass
3. **Merge Intervals (#56)** - Fundamental interval pattern
4. **Meeting Rooms II (#253)** - Uber's favorite scheduling problem
5. **Longest Substring Without Repeating Characters (#3)** - Basic sliding window
6. **Minimum Window Substring (#76)** - Complex sliding window
7. **Trapping Rain Water (#42)** - Two-pointer with state
8. **Game of Life (#289)** - Array transformation with rules
9. **Longest Substring with At Most K Distinct Characters (#340)** - Uber-style window
10. **Insert Delete GetRandom O(1) (#380)** - Data structure design with arrays

Each problem builds on the previous one. By the time you reach #340, you'll be applying sliding window techniques to problems with the kind of complex constraints Uber actually uses in their systems.

Remember: Uber isn't testing whether you can solve array problems. They're testing whether you can think about real-time data processing. Every array problem you solve should be approached with the question: "How would this work if new data was constantly arriving, and I needed to maintain the answer incrementally?"

[Practice Array at Uber](/company/uber/array)
