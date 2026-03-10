---
title: "Greedy Interview Questions: Patterns and Strategies"
description: "Master Greedy problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-11"
category: "dsa-patterns"
tags: ["greedy", "dsa", "interview prep"]
---

# Greedy Interview Questions: Patterns and Strategies

You’ve just aced the first two questions in your interview. The interviewer smiles and says, “Let’s try one more.” They present a scheduling problem. You think, “This looks like dynamic programming—I need to consider all possibilities.” You start sketching a recursive tree, but the interviewer gently interrupts: “Is there a simpler approach?” That’s when you realize you’ve fallen into the classic trap of overcomplicating a greedy problem. The question was **Meeting Rooms II (LeetCode #253)**, and the optimal O(n log n) solution uses a greedy approach with sorting and a min-heap, not the O(2^n) DP monster you were building.

Greedy algorithms matter because they test your ability to recognize when a locally optimal choice leads to a globally optimal solution. With 367 questions tagged as greedy on major platforms (44 easy, 245 medium, 78 hard), this isn’t a niche topic. Amazon, Google, and Microsoft particularly love greedy problems because they mirror real-world optimization decisions: scheduling resources, minimizing costs, or maximizing throughput with limited information. The catch? Greedy problems often look deceptively simple, but they require rigorous proof of correctness—something interviewers watch for closely.

## Common Patterns

### Pattern 1: Interval Scheduling and Merging

This is the bread and butter of greedy problems. The intuition: when dealing with intervals (meetings, tasks, events), sorting by end time often reveals the optimal structure. Why? Because finishing earlier leaves more room for subsequent intervals.

**Key Problems:** Meeting Rooms II (#253), Non-overlapping Intervals (#435), Merge Intervals (#56)

Consider **Non-overlapping Intervals (#435)**: “Given a collection of intervals, find the minimum number of intervals you need to remove to make the rest non-overlapping.” The greedy insight: if you want to keep as many intervals as possible, always keep the interval that ends earliest (leaving maximum room for others). When conflicts arise, remove the interval that ends later.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    Greedy approach: sort by end time, keep earliest finishing intervals
    Time: O(n log n) for sorting, O(n) for traversal → O(n log n)
    Space: O(1) if sorting in-place, otherwise O(n) for timsort
    """
    if not intervals:
        return 0

    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    # Start from second interval
    for i in range(1, len(intervals)):
        start, end = intervals[i]
        if start < last_end:  # Overlap detected
            count += 1
        else:
            last_end = end  # No overlap, update last_end

    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  // Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
  if (!intervals.length) return 0;

  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < lastEnd) {
      count++;
    } else {
      lastEnd = end;
    }
  }

  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    // Time: O(n log n) | Space: O(log n) for Arrays.sort (timsort uses O(log n) stack space)
    if (intervals.length == 0) return 0;

    // Sort by end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];

        if (start < lastEnd) {
            count++;
        } else {
            lastEnd = end;
        }
    }

    return count;
}
```

</div>

### Pattern 2: Jump Game Variations

These problems ask: “Can you reach the end?” or “What’s the minimum jumps to reach the end?” The greedy insight: at each step, you don’t need to consider all possible jumps—just track the farthest you can reach from current positions.

**Key Problems:** Jump Game (#55), Jump Game II (#45), Gas Station (#134)

For **Jump Game II (#45)**: “Find the minimum number of jumps to reach the last index.” Instead of BFS (which would be O(n²) in worst case), use greedy: maintain current reach, farthest reach, and jumps. Each time you exhaust current reach, you must jump to extend your range.

<div class="code-group">

```python
def jump(nums):
    """
    Greedy BFS-like approach: track jumps, current reach, and farthest reach
    Time: O(n) - single pass through array
    Space: O(1) - only a few variables
    """
    if len(nums) <= 1:
        return 0

    jumps = 0
    current_reach = 0
    farthest = 0

    for i in range(len(nums) - 1):  # Don't need to process last element
        farthest = max(farthest, i + nums[i])

        if i == current_reach:  # Exhausted current jump range
            jumps += 1
            current_reach = farthest

            if current_reach >= len(nums) - 1:
                break

    return jumps
```

```javascript
function jump(nums) {
  // Time: O(n) | Space: O(1)
  if (nums.length <= 1) return 0;

  let jumps = 0;
  let currentReach = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentReach) {
      jumps++;
      currentReach = farthest;

      if (currentReach >= nums.length - 1) {
        break;
      }
    }
  }

  return jumps;
}
```

```java
public int jump(int[] nums) {
    // Time: O(n) | Space: O(1)
    if (nums.length <= 1) return 0;

    int jumps = 0;
    int currentReach = 0;
    int farthest = 0;

    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        if (i == currentReach) {
            jumps++;
            currentReach = farthest;

            if (currentReach >= nums.length - 1) {
                break;
            }
        }
    }

    return jumps;
}
```

</div>

### Pattern 3: Two-Pointers with Greedy Choice

When you need to maximize or minimize something with constraints, two pointers with greedy selection often works. The intuition: sorted data + moving inward/outward pointers lets you make locally optimal decisions.

**Key Problems:** Container With Most Water (#11), Assign Cookies (#455), Boats to Save People (#881)

For **Container With Most Water (#11)**: “Find two lines that together with x-axis form a container holding most water.” The greedy insight: start with widest container (first and last lines), then move the shorter line inward—you might gain more height while only losing minimal width.

<div class="code-group">

```python
def maxArea(height):
    """
    Two-pointer greedy: always move the shorter line inward
    Time: O(n) - single pass with two pointers
    Space: O(1) - only pointers and max_area variable
    """
    left, right = 0, len(height) - 1
    max_area = 0

    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        max_area = max(max_area, width * current_height)

        # Greedy choice: move the shorter line
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_area
```

```javascript
function maxArea(height) {
  // Time: O(n) | Space: O(1)
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, width * currentHeight);

    // Greedy: move the shorter line
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}
```

```java
public int maxArea(int[] height) {
    // Time: O(n) | Space: O(1)
    int left = 0;
    int right = height.length - 1;
    int maxArea = 0;

    while (left < right) {
        int width = right - left;
        int currentHeight = Math.min(height[left], height[right]);
        maxArea = Math.max(maxArea, width * currentHeight);

        // Greedy: move the shorter line
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}
```

</div>

## When to Use Greedy vs Alternatives

Recognizing greedy problems is half the battle. Here’s how to distinguish them from similar techniques:

**Greedy vs Dynamic Programming:**

- Use greedy when the problem has _optimal substructure_ AND the _greedy choice property_ (local optimal → global optimal).
- Use DP when you need to consider all possibilities or when greedy fails. Example: Coin Change (#322) vs Activity Selection. Coin Change requires DP because greedy fails for some coin systems.
- **Decision criteria:** Can you prove that making the locally optimal choice at each step leads to the global optimum? If yes, greedy. If you need to track multiple possibilities, DP.

**Greedy vs BFS/DFS:**

- Use greedy for optimization problems with a clear “best next step.”
- Use BFS/DFS when you need to explore all paths or find any valid path. Example: Jump Game (#55) can be solved with BFS, but greedy O(n) is better than BFS O(n²).
- **Decision criteria:** Does the problem ask for “minimum/maximum” with a structure that suggests sorting helps? Try greedy first.

**Greedy vs Sorting + Simple Traversal:**

- Many greedy problems are just “sort then process,” but the key is the _processing logic_. Regular sorting problems don’t make locally optimal choices during traversal.
- **Decision criteria:** Are you making decisions during traversal that affect future choices? That’s greedy.

## Edge Cases and Gotchas

1. **Empty or Single Element Inputs:** Always check `if not intervals` or `if len(nums) <= 1`. In Jump Game, empty array should return 0 jumps. In interval problems, 0 or 1 intervals means 0 removals needed.

2. **Negative Numbers and Zero Values:** In Jump Game, zeros create “traps”—you can’t move forward. Your greedy algorithm must handle this. Test case: `[3, 2, 1, 0, 4]` should return false.

3. **Ties in Sorting Keys:** When sorting intervals by end time, what if two intervals have the same end time but different start times? Most greedy algorithms still work, but be explicit: `sort by end, then start` for stability.

4. **Integer Overflow:** In problems like Container With Most Water, width × height could exceed 32-bit integer limits. Use 64-bit integers (Python handles this automatically, but in Java/C++ be mindful).

5. **Off-by-One in Jump Problems:** In Jump Game II, don’t process the last element in the loop—you’ve already arrived. The condition `i < len(nums) - 1` is crucial.

## Difficulty Breakdown: What the Split Means

With 12% easy, 67% medium, and 21% hard questions, here’s what this means for your preparation:

- **Easy (44 problems):** Master these first. They teach the core patterns without tricky variations. If you can’t solve these in <10 minutes, you’re not ready for medium ones.
- **Medium (245 problems):** This is where interviews live. Companies expect you to solve medium greedy problems in 20-25 minutes. Focus here after mastering easies.
- **Hard (78 problems):** These often combine greedy with other techniques (like union-find or segment trees). Prioritize based on target companies: Google asks more hards than Amazon.

**Study prioritization:** 70% medium, 20% easy (for speed), 10% hard (for depth). If short on time: do all easies, then medium problems tagged with your target companies.

## Which Companies Ask Greedy

**[Amazon](/company/amazon)**: Loves interval scheduling and resource allocation problems. Think meeting rooms, task scheduling, warehouse optimization. They often combine greedy with heaps.

**[Google](/company/google)**: Prefers tricky greedy proofs and combination problems. Expect Jump Game variations and problems that require mathematical insight. Google tests whether you can _prove_ greedy works.

**[Microsoft](/company/microsoft)**: Favors practical greedy problems: file merging, string compression, scheduling. Often medium difficulty with clean implementations.

**[Meta](/company/meta)**: Leans toward array-based greedy and two-pointer variations. Container With Most Water is a classic Meta question.

**[Bloomberg](/company/bloomberg)**: Asks greedy in financial contexts: transaction scheduling, profit maximization, portfolio optimization.

## Study Tips

1. **Prove Before You Code:** When you encounter a greedy problem, don’t just implement. Spend 2 minutes convincing yourself (and your imaginary interviewer) why greedy works. What’s the exchange argument? Why can’t a better solution exist?

2. **Sorting is Your Friend:** 80% of greedy problems start with sorting. Ask: “What if I sort by start time? End time? Value/weight ratio?” Try different sorting keys on sample inputs.

3. **Follow the 5-Problem Pattern Recognition:** Pick 5 problems from each pattern (intervals, jumps, two-pointers). Solve them consecutively. Your brain will start recognizing “this looks like Jump Game II” during interviews.

4. **Recommended Problem Order:**
   - Week 1: All easy problems (build confidence)
   - Week 2: Non-overlapping Intervals (#435), Jump Game II (#45), Container With Most Water (#11)
   - Week 3: Task Scheduler (#621), Gas Station (#134), Partition Labels (#763)
   - Week 4: Hard problems from target companies

Remember: Greedy algorithms test your insight, not just implementation. The interviewer wants to see that “aha!” moment when you recognize the pattern. Practice until these insights become second nature.

[Practice all Greedy questions on CodeJeet](/topic/greedy)
