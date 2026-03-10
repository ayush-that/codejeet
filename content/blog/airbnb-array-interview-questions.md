---
title: "Array Questions at Airbnb: What to Expect"
description: "Prepare for Array interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2028-12-16"
category: "dsa-patterns"
tags: ["airbnb", "array", "interview prep"]
---

## Why Array Questions Dominate Airbnb Interviews

If you're preparing for Airbnb interviews, you'll notice something striking: 29 of their 64 tagged LeetCode problems are array-based. That's 45% of their technical question bank. This isn't a coincidence—it reflects Airbnb's actual engineering work. Unlike companies focused on low-level systems or theoretical algorithms, Airbnb's core business revolves around handling real-world data: listings, reservations, pricing calendars, search results, and user profiles. These are fundamentally array and matrix problems in disguise.

During my conversations with Airbnb engineers and from my own interview experiences there, I've observed that array questions appear in nearly every technical round. They're not just warm-ups; they're often the main event. The company tests arrays because they reveal how you think about data organization, edge cases, and practical optimization—skills directly applicable to building features like "similar listings" or "price suggestions."

## Specific Patterns Airbnb Favors

Airbnb's array problems cluster around three distinct patterns that mirror their product needs:

1. **Interval manipulation** - Think booking calendars, availability windows, and overlapping reservations. These aren't academic exercises; they're simplified versions of actual scheduling problems their engineers solve daily.

2. **String/array transformation** - Airbnb deals extensively with user-generated content: listing descriptions, review text, search queries. Problems that involve parsing, validating, or transforming string data appear frequently.

3. **Matrix traversal with constraints** - Their map views, photo grids, and listing displays often involve 2D data structures with specific navigation rules.

Look at their most representative problems: **Meeting Rooms II (LeetCode #253)** tests interval overlapping with resource allocation—literally the "how many conference rooms needed" problem translates to "how many cleaning crews needed between bookings." **Text Justification (LeetCode #68)** appears surprisingly often because it tests both array partitioning and real-world text formatting logic. **Game of Life (LeetCode #289)** tests in-place matrix manipulation with state transitions, similar to how they might update listing availability across a calendar matrix.

Notice what's missing: pure mathematical array puzzles, complex dynamic programming requiring obscure recurrence relations, or theoretical sorting algorithms. Airbnb's problems tend to have clear connections to practical scenarios.

## How to Prepare: Master the Interval Merge Pattern

The single most important pattern to master for Airbnb is interval manipulation. Let's examine the core operation: merging overlapping intervals. This pattern appears in at least five different Airbnb-tagged problems.

<div class="code-group">

```python
def merge_intervals(intervals):
    """
    Merge overlapping intervals.
    Time: O(n log n) for sorting + O(n) for merging = O(n log n)
    Space: O(n) for output (or O(1) if we modify input and ignore sort space)
    """
    if not intervals:
        return []

    # Sort by start time - this is the key insight
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]

        # If current interval overlaps with last merged interval
        if current_start <= last_end:
            # Merge them by updating the end time
            merged[-1] = [last_start, max(last_end, current_end)]
        else:
            # No overlap, add as new interval
            merged.append([current_start, current_end])

    return merged
```

```javascript
function mergeIntervals(intervals) {
  /**
   * Merge overlapping intervals.
   * Time: O(n log n) for sorting + O(n) for merging = O(n log n)
   * Space: O(n) for output (or O(1) if we modify input and ignore sort space)
   */
  if (!intervals.length) return [];

  // Sort by start time - this is the key insight
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    // If current interval overlaps with last merged interval
    if (currentStart <= lastEnd) {
      // Merge them by updating the end time
      merged[merged.length - 1][1] = Math.max(lastEnd, currentEnd);
    } else {
      // No overlap, add as new interval
      merged.push([currentStart, currentEnd]);
    }
  }

  return merged;
}
```

```java
public int[][] merge(int[][] intervals) {
    /**
     * Merge overlapping intervals.
     * Time: O(n log n) for sorting + O(n) for merging = O(n log n)
     * Space: O(n) for output (or O(1) if we modify input and ignore sort space)
     */
    if (intervals.length <= 1) return intervals;

    // Sort by start time - this is the key insight
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = merged.get(merged.size() - 1);

        // If current interval overlaps with last merged interval
        if (current[0] <= last[1]) {
            // Merge them by updating the end time
            last[1] = Math.max(last[1], current[1]);
        } else {
            // No overlap, add as new interval
            merged.add(current);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}
```

</div>

The pattern is consistent: sort by start time, then iterate through while merging overlaps. Once you internalize this, variations like **Insert Interval (LeetCode #57)** or **Meeting Rooms II (LeetCode #253)** become much easier.

## How Airbnb Tests Array vs Other Companies

Airbnb's array questions differ from other companies in subtle but important ways:

**vs. Google**: Google often asks array problems with mathematical twists or requiring clever bit manipulation. Airbnb's problems are more grounded—you can usually visualize the real-world scenario.

**vs. Facebook**: Facebook leans heavily on graph and tree problems disguised as arrays (like friend suggestions). Airbnb's arrays are more often literal collections of items that need organizing or scheduling.

**vs. Amazon**: Amazon's array problems frequently involve sliding window for substring/search problems. Airbnb uses sliding window too, but more for time-based windows (like "find peak booking periods").

What's unique about Airbnb's approach is their emphasis on **clean, maintainable solutions** over clever one-liners. I've had interviewers explicitly ask about edge cases in date ranges, time zones, and empty states—practical considerations that matter when dealing with real booking data. They care that your solution would work correctly with actual user data, not just pass test cases.

## Study Order: A Logical Progression

Don't jump straight into Airbnb's hardest array problems. Build up systematically:

1. **Basic array manipulation** - Learn to traverse, modify, and search arrays efficiently. Master two-pointer techniques.
2. **Sorting and searching** - Understand how sorting transforms problems. Binary search on sorted arrays is fundamental.
3. **Interval patterns** - This is Airbnb's bread and butter. Start with simple merging before tackling insertion and scheduling.
4. **Matrix traversal** - Practice both BFS and DFS approaches on grids. Airbnb often adds constraints like "can't visit certain cells."
5. **String/array transformation** - These are essentially array problems where elements are characters. Practice in-place modifications.
6. **Advanced patterns** - Only after mastering the above, tackle problems combining multiple patterns.

This order works because each layer builds on the previous one. Interval problems require sorting understanding. Matrix traversal builds on basic array manipulation. You're constructing a mental toolkit where you can recognize which tools apply to which problems.

## Recommended Practice Order

Solve these in sequence to build competency:

1. **Two Sum (LeetCode #1)** - Basic hash map usage with arrays
2. **Merge Intervals (LeetCode #56)** - Foundational interval pattern
3. **Insert Interval (LeetCode #57)** - Interval pattern variation
4. **Meeting Rooms II (LeetCode #253)** - Interval pattern with counting
5. **Game of Life (LeetCode #289)** - Matrix manipulation with state
6. **Text Justification (LeetCode #68)** - Array partitioning with constraints
7. **Flatten 2D Vector (LeetCode #251)** - Iterator design over arrays
8. **Palindrome Pairs (LeetCode #336)** - Advanced string/array combination

Notice the progression: start with fundamental patterns, then apply them to Airbnb's favorite problem types, then combine patterns. By problem #8, you're solving challenges at the level Airbnb actually asks in interviews.

Here's one more essential pattern: the in-place array modification that appears in problems like moving zeroes or deduplication.

<div class="code-group">

```python
def move_zeroes(nums):
    """
    Move all zeroes to the end while maintaining relative order.
    Time: O(n) - single pass through array
    Space: O(1) - in-place modification
    """
    # Pointer for the next non-zero position
    next_non_zero = 0

    # First pass: move all non-zero elements forward
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[next_non_zero] = nums[i]
            next_non_zero += 1

    # Second pass: fill remaining positions with zeroes
    for i in range(next_non_zero, len(nums)):
        nums[i] = 0

    return nums
```

```javascript
function moveZeroes(nums) {
  /**
   * Move all zeroes to the end while maintaining relative order.
   * Time: O(n) - single pass through array
   * Space: O(1) - in-place modification
   */
  // Pointer for the next non-zero position
  let nextNonZero = 0;

  // First pass: move all non-zero elements forward
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[nextNonZero] = nums[i];
      nextNonZero++;
    }
  }

  // Second pass: fill remaining positions with zeroes
  for (let i = nextNonZero; i < nums.length; i++) {
    nums[i] = 0;
  }

  return nums;
}
```

```java
public void moveZeroes(int[] nums) {
    /**
     * Move all zeroes to the end while maintaining relative order.
     * Time: O(n) - single pass through array
     * Space: O(1) - in-place modification
     */
    // Pointer for the next non-zero position
    int nextNonZero = 0;

    // First pass: move all non-zero elements forward
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            nums[nextNonZero] = nums[i];
            nextNonZero++;
        }
    }

    // Second pass: fill remaining positions with zeroes
    for (int i = nextNonZero; i < nums.length; i++) {
        nums[i] = 0;
    }
}
```

</div>

This two-pointer in-place modification pattern appears in various forms across Airbnb problems. Master it, and you'll have a reliable tool for many array challenges.

Remember: Airbnb isn't testing whether you've memorized solutions. They're assessing how you think through problems that resemble their actual engineering work. When you practice, always ask yourself: "How would this apply to booking data, user content, or search results?" That mindset shift will prepare you better than any rote memorization.

[Practice Array at Airbnb](/company/airbnb/array)
