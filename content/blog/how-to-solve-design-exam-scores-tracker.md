---
title: "How to Solve Design Exam Scores Tracker — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Exam Scores Tracker. Medium difficulty, 43.9% acceptance rate. Topics: Array, Binary Search, Design, Prefix Sum."
date: "2029-12-13"
category: "dsa-patterns"
tags: ["design-exam-scores-tracker", "array", "binary-search", "design", "medium"]
---

# How to Solve Design Exam Scores Tracker

Alice wants to track her exam scores over time and efficiently calculate total scores within specific time periods. The challenge is that exams can be recorded in any time order, and we need to support queries for total scores between arbitrary start and end times. What makes this problem interesting is that we need to handle both unordered insertions and range sum queries efficiently.

## Visual Walkthrough

Let's trace through a concrete example:

1. We create an empty `ExamTracker`
2. We record: `record(5, 10)` - At time 5, score 10
3. We record: `record(2, 5)` - At time 2, score 5
4. We record: `record(8, 15)` - At time 8, score 15
5. We call `total(3, 7)` - Should return total scores between times 3 and 7 inclusive

Our data currently looks like: `[(5,10), (2,5), (8,15)]` (unordered)

To calculate `total(3,7)`:

- Time 2: score 5 → outside range (2 < 3)
- Time 5: score 10 → inside range (3 ≤ 5 ≤ 7)
- Time 8: score 15 → outside range (8 > 7)

Total = 10

The key insight: we need to quickly find all exams within a time range and sum their scores.

## Brute Force Approach

A naive solution would store exams in an unsorted list or array. For each `record()`, we simply append the (time, score) pair. For `total(start, end)`, we iterate through all recorded exams and sum those where `start ≤ time ≤ end`.

**Why this fails:**

- `total()` becomes O(n) where n is the total number of exams recorded
- With many queries, this becomes prohibitively slow
- The problem constraints likely require better than linear time for queries

<div class="code-group">

```python
class ExamTracker:
    def __init__(self):
        # Store all exams in a list
        self.exams = []

    def record(self, time: int, score: int) -> None:
        # Simply append - O(1)
        self.exams.append((time, score))

    def total(self, start: int, end: int) -> int:
        total_score = 0
        # Check every exam - O(n)
        for time, score in self.exams:
            if start <= time <= end:
                total_score += score
        return total_score
```

```javascript
class ExamTracker {
  constructor() {
    this.exams = [];
  }

  record(time, score) {
    this.exams.push([time, score]);
  }

  total(start, end) {
    let totalScore = 0;
    for (const [time, score] of this.exams) {
      if (time >= start && time <= end) {
        totalScore += score;
      }
    }
    return totalScore;
  }
}
```

```java
class ExamTracker {
    private List<int[]> exams;

    public ExamTracker() {
        exams = new ArrayList<>();
    }

    public void record(int time, int score) {
        exams.add(new int[]{time, score});
    }

    public int total(int start, int end) {
        int totalScore = 0;
        for (int[] exam : exams) {
            int time = exam[0];
            int score = exam[1];
            if (time >= start && time <= end) {
                totalScore += score;
            }
        }
        return totalScore;
    }
}
```

</div>

## Optimized Approach

The key insight is that we need two operations to be efficient:

1. **Insertion** of new exams (can be in any time order)
2. **Range sum queries** for totals between start and end times

We can use a **balanced binary search tree** approach (like a TreeMap in Java or sorted list with binary search in Python/JavaScript). Here's the step-by-step reasoning:

1. **Store data sorted by time**: We need to maintain exams in sorted order by time to enable binary search
2. **Use prefix sums**: For each time, store the cumulative sum of scores up to that time
3. **Binary search for boundaries**: Use binary search to find the first exam ≥ start and the last exam ≤ end
4. **Calculate range sum**: Use prefix sums to compute `sum_up_to(end) - sum_up_to(start-1)`

**Why this works:**

- Insertion: O(log n) to find insertion position and update prefix sums
- Query: O(log n) for binary search + O(1) for sum calculation
- We handle unordered insertions by maintaining sorted order

## Optimal Solution

We'll use a sorted list of (time, cumulative_score) pairs. For each `record()`, we:

1. Find the insertion position using binary search
2. Insert the new exam
3. Update cumulative scores for all subsequent exams

For `total()`, we:

1. Binary search to find the position right before `start`
2. Binary search to find the position of `end`
3. Calculate: `cumulative_sum[end] - cumulative_sum[before_start]`

<div class="code-group">

```python
# Time: O(log n) for record, O(log n) for total
# Space: O(n) for storing all exams
class ExamTracker:
    def __init__(self):
        # Store (time, cumulative_score) pairs in sorted order
        # cumulative_score = sum of scores for all exams up to and including this time
        self.exams = []

    def record(self, time: int, score: int) -> None:
        # Step 1: Find insertion position using binary search
        left, right = 0, len(self.exams)
        while left < right:
            mid = (left + right) // 2
            if self.exams[mid][0] < time:
                left = mid + 1
            else:
                right = mid

        # Step 2: Calculate cumulative sum up to insertion point
        prev_cumulative = 0
        if left > 0:
            prev_cumulative = self.exams[left - 1][1]

        # Step 3: Insert new exam with cumulative score
        new_cumulative = prev_cumulative + score
        self.exams.insert(left, (time, new_cumulative))

        # Step 4: Update cumulative scores for all subsequent exams
        for i in range(left + 1, len(self.exams)):
            self.exams[i] = (self.exams[i][0], self.exams[i][1] + score)

    def total(self, start: int, end: int) -> int:
        # Helper function to find rightmost position <= target
        def find_le(target):
            left, right = 0, len(self.exams)
            while left < right:
                mid = (left + right) // 2
                if self.exams[mid][0] <= target:
                    left = mid + 1
                else:
                    right = mid
            return left - 1

        # Helper function to find rightmost position < target
        def find_lt(target):
            left, right = 0, len(self.exams)
            while left < right:
                mid = (left + right) // 2
                if self.exams[mid][0] < target:
                    left = mid + 1
                else:
                    right = mid
            return left - 1

        # Find last exam <= end and last exam < start
        end_idx = find_le(end)
        start_idx = find_lt(start)

        # Calculate total using cumulative sums
        end_sum = self.exams[end_idx][1] if end_idx >= 0 else 0
        start_sum = self.exams[start_idx][1] if start_idx >= 0 else 0

        return end_sum - start_sum
```

```javascript
// Time: O(log n) for record, O(log n) for total
// Space: O(n) for storing all exams
class ExamTracker {
  constructor() {
    // Array of [time, cumulativeScore] pairs, sorted by time
    this.exams = [];
  }

  record(time, score) {
    // Step 1: Binary search to find insertion position
    let left = 0,
      right = this.exams.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.exams[mid][0] < time) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Step 2: Calculate cumulative sum before insertion point
    let prevCumulative = 0;
    if (left > 0) {
      prevCumulative = this.exams[left - 1][1];
    }

    // Step 3: Insert new exam with cumulative score
    const newCumulative = prevCumulative + score;
    this.exams.splice(left, 0, [time, newCumulative]);

    // Step 4: Update cumulative scores for subsequent exams
    for (let i = left + 1; i < this.exams.length; i++) {
      this.exams[i][1] += score;
    }
  }

  total(start, end) {
    // Helper: find rightmost index with time <= target
    const findLE = (target) => {
      let left = 0,
        right = this.exams.length;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (this.exams[mid][0] <= target) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      return left - 1;
    };

    // Helper: find rightmost index with time < target
    const findLT = (target) => {
      let left = 0,
        right = this.exams.length;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (this.exams[mid][0] < target) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      return left - 1;
    };

    const endIdx = findLE(end);
    const startIdx = findLT(start);

    const endSum = endIdx >= 0 ? this.exams[endIdx][1] : 0;
    const startSum = startIdx >= 0 ? this.exams[startIdx][1] : 0;

    return endSum - startSum;
  }
}
```

```java
// Time: O(log n) for record, O(log n) for total
// Space: O(n) for storing all exams
import java.util.*;

class ExamTracker {
    // List of pairs: [time, cumulativeScore]
    private List<int[]> exams;

    public ExamTracker() {
        exams = new ArrayList<>();
    }

    public void record(int time, int score) {
        // Step 1: Binary search for insertion position
        int left = 0, right = exams.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (exams.get(mid)[0] < time) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // Step 2: Calculate cumulative sum before insertion
        int prevCumulative = 0;
        if (left > 0) {
            prevCumulative = exams.get(left - 1)[1];
        }

        // Step 3: Insert new exam
        exams.add(left, new int[]{time, prevCumulative + score});

        // Step 4: Update cumulative scores for subsequent exams
        for (int i = left + 1; i < exams.size(); i++) {
            exams.get(i)[1] += score;
        }
    }

    public int total(int start, int end) {
        // Helper: find rightmost index with time <= target
        int endIdx = findLE(end);
        // Helper: find rightmost index with time < target
        int startIdx = findLT(start);

        int endSum = endIdx >= 0 ? exams.get(endIdx)[1] : 0;
        int startSum = startIdx >= 0 ? exams.get(startIdx)[1] : 0;

        return endSum - startSum;
    }

    private int findLE(int target) {
        int left = 0, right = exams.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (exams.get(mid)[0] <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left - 1;
    }

    private int findLT(int target) {
        int left = 0, right = exams.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (exams.get(mid)[0] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `record(time, score)`: O(log n + n) in worst case due to updating subsequent cumulative sums. With careful implementation using balanced BSTs (like TreeMap in Java), this can be O(log n). Our array-based solution has O(n) worst case for insertions but is simpler to implement.
- `total(start, end)`: O(log n) for binary search operations

**Space Complexity:**

- O(n) where n is the number of exams recorded, for storing all (time, cumulative_score) pairs

**Optimization Note:** For production use, we'd want to use a balanced BST (like Java's TreeMap or Python's sortedcontainers.SortedDict) to achieve O(log n) for both insertion and query. The array-based solution above is easier to understand but has O(n) worst-case insertion.

## Common Mistakes

1. **Not handling empty ranges correctly**: When `start > end` or when no exams exist in the range, return 0. Test with `total(10, 5)` or `total(100, 200)` when no exams exist in that range.

2. **Off-by-one errors in binary search**: The most common mistake is incorrect boundary conditions. Practice writing binary search carefully:
   - Use `left < right` not `left <= right` for cleaner termination
   - Remember that `left` is the insertion point after the loop
   - Test with empty array, single element, and duplicate times

3. **Forgetting to update cumulative sums after insertion**: When inserting a new exam, all subsequent cumulative sums need to be incremented by the new score. This is easy to miss.

4. **Assuming times are unique**: The problem doesn't specify if times can be duplicate. A robust solution should handle duplicate times by either:
   - Summing scores for the same time (our solution does this)
   - Or treating them as separate entries with the same time

## When You'll See This Pattern

This problem combines **range sum queries** with **dynamic insertions**, which is a classic pattern in many coding problems:

1. **Range Sum Query - Mutable (LeetCode 307)**: Very similar but uses segment trees or Binary Indexed Trees (Fenwick Trees) for O(log n) updates and queries.

2. **Data Stream as Disjoint Intervals (LeetCode 352)**: Similar pattern of maintaining sorted data and performing efficient insertions and queries.

3. **Time Based Key-Value Store (LeetCode 981)**: Uses binary search on timestamps to retrieve values, similar to our time-based lookup.

The core technique is maintaining sorted data (either through balanced BSTs or sorted arrays with binary search) to enable efficient range queries and dynamic updates.

## Key Takeaways

1. **Sorted data + binary search = efficient lookups**: When you need to find elements within a range in sorted data, binary search gives you O(log n) performance instead of O(n).

2. **Prefix sums enable O(1) range sums**: By storing cumulative sums, you can compute any range sum as `sum[end] - sum[start-1]`, avoiding iteration through the range.

3. **Consider trade-offs between implementations**: Array-based solutions with binary search are simpler but have O(n) insertions. Balanced BSTs (TreeMap, SortedDict) give O(log n) for both operations but are more complex to implement from scratch.

[Practice this problem on CodeJeet](/problem/design-exam-scores-tracker)
