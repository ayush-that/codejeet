---
title: "Google vs Uber: Interview Question Comparison"
description: "Compare coding interview questions at Google and Uber — difficulty levels, topic focus, and preparation strategy."
date: "2028-07-23"
category: "tips"
tags: ["google", "uber", "comparison"]
---

# Google vs Uber: Interview Question Comparison

If you're interviewing at both Google and Uber, or trying to decide where to focus your preparation, you're facing a common but strategic challenge. While both companies test similar fundamental algorithms, their interview cultures, problem selection, and expectations differ in subtle but important ways. Preparing for one doesn't fully prepare you for the other—but there's significant overlap you can leverage. Think of it this way: Google interviews are like a comprehensive final exam covering everything in the textbook, while Uber interviews are more like a practical lab test focused on applied problem-solving.

## Question Volume and Difficulty

The numbers tell an immediate story. Google has 2,217 tagged questions on LeetCode (588 Easy, 1,153 Medium, 476 Hard), while Uber has 381 (54 Easy, 224 Medium, 103 Hard).

**Google's** massive question bank reflects their longer history of technical interviews and their tendency to pull from a deep, well-established problem set. The difficulty distribution (26% Easy, 52% Medium, 21% Hard) suggests they're comfortable asking challenging problems, but Mediums form the core of their interviews. The sheer volume means you can't "grind" your way to covering everything—you need pattern recognition.

**Uber's** smaller but more concentrated question bank indicates they favor certain problem types and scenarios. Their distribution (14% Easy, 59% Medium, 27% Hard) is actually more skewed toward Medium/Hard problems than Google's. This doesn't necessarily mean Uber interviews are harder, but it suggests they're more selective about the problems they choose—often favoring real-world scenarios and practical implementation over purely algorithmic puzzles.

## Topic Overlap

Both companies heavily test **Arrays, Strings, Hash Tables, and Dynamic Programming**—these four topics form the core overlap. If you master these, you're covering about 60-70% of what both companies test.

**Google's unique emphasis**: Trees & Graphs (especially advanced graph algorithms), System Design (at more junior levels than other companies), and sometimes more "academic" algorithms like number theory or geometry.

**Uber's unique emphasis**: Real-world simulation problems (ride matching, pricing algorithms), more frequent use of Object-Oriented Design questions alongside coding, and a noticeable tilt toward problems involving intervals, sorting, and greedy approaches that mirror operational decisions.

The key insight: Google problems often feel like "computer science" problems, while Uber problems often feel like "Uber business" problems abstracted into algorithms.

## Preparation Priority Matrix

Here's how to prioritize your study time if interviewing at both:

**High Priority (Overlap Topics - Study First)**

- Arrays & Strings: Sliding window, two pointers, prefix sums
- Hash Tables: Frequency counting, complement finding
- Dynamic Programming: 1D and 2D DP, especially knapsack variations
- Sorting: Custom comparators, interval merging

**Medium Priority (Google-Specific)**

- Advanced Graph Algorithms (Dijkstra, topological sort)
- Tree Traversals (especially iterative)
- Bit Manipulation

**Medium Priority (Uber-Specific)**

- Interval Problems (merging, scheduling)
- Design + Algorithm hybrid problems
- Simulation/Modeling problems

**Specific LeetCode problems useful for both**:

- Two Sum (#1) - The hash table classic
- Merge Intervals (#56) - Uber loves this, Google asks variations
- Longest Substring Without Repeating Characters (#3) - Sliding window mastery
- House Robber (#198) - DP foundation
- Valid Parentheses (#20) - Stack fundamentals

## Interview Format Differences

**Google** typically has:

- 4-5 rounds of 45-minute interviews (2 coding, 1 system design, 1 behavioral/Googliness)
- Often two problems per coding round (one easier, one harder)
- Strong emphasis on optimal solutions and time/space complexity analysis
- Whiteboard-style discussion even in virtual interviews
- System design expected for L4+ (mid-level) and above

**Uber** typically has:

- 3-4 rounds of 60-minute interviews
- Usually one substantial problem per round with multiple follow-ups
- More interactive discussion about trade-offs and real-world constraints
- Often includes an "Uber case study" problem simulating their business
- Behavioral questions woven into coding rounds rather than separate
- System design at similar levels, but often more practical than theoretical

The time difference is telling: Google's 45-minute slots encourage efficiency and quick thinking, while Uber's 60-minute slots allow for deeper exploration of a single problem.

## Specific Problem Recommendations

Here are 5 problems that provide exceptional cross-company preparation value:

1. **Meeting Rooms II (LeetCode #253)** - Uber asks this constantly for obvious reasons, but Google also loves interval problems. Master the heap-based solution.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minMeetingRooms(intervals):
    if not intervals:
        return 0

    # Separate start and end times
    start_times = sorted([i[0] for i in intervals])
    end_times = sorted([i[1] for i in intervals])

    start_ptr = end_ptr = 0
    rooms_needed = 0
    max_rooms = 0

    # Merge-like traversal
    while start_ptr < len(intervals):
        if start_times[start_ptr] < end_times[end_ptr]:
            rooms_needed += 1
            start_ptr += 1
            max_rooms = max(max_rooms, rooms_needed)
        else:
            rooms_needed -= 1
            end_ptr += 1

    return max_rooms
```

```javascript
// Time: O(n log n) | Space: O(n)
function minMeetingRooms(intervals) {
  if (!intervals.length) return 0;

  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let startPtr = 0,
    endPtr = 0;
  let rooms = 0,
    maxRooms = 0;

  while (startPtr < intervals.length) {
    if (starts[startPtr] < ends[endPtr]) {
      rooms++;
      startPtr++;
      maxRooms = Math.max(maxRooms, rooms);
    } else {
      rooms--;
      endPtr++;
    }
  }

  return maxRooms;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    int[] starts = new int[intervals.length];
    int[] ends = new int[intervals.length];

    for (int i = 0; i < intervals.length; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }

    Arrays.sort(starts);
    Arrays.sort(ends);

    int startPtr = 0, endPtr = 0;
    int rooms = 0, maxRooms = 0;

    while (startPtr < intervals.length) {
        if (starts[startPtr] < ends[endPtr]) {
            rooms++;
            startPtr++;
            maxRooms = Math.max(maxRooms, rooms);
        } else {
            rooms--;
            endPtr++;
        }
    }

    return maxRooms;
}
```

</div>

2. **LRU Cache (LeetCode #146)** - Tests hash table + linked list combination. Google asks this for system fundamentals, Uber for caching scenarios.

3. **Word Break (LeetCode #139)** - Excellent DP problem that both companies use. Teaches memoization and optimization thinking.

4. **Trapping Rain Water (LeetCode #42)** - Google's classic, but Uber also asks variations. Tests two-pointer and array manipulation skills.

5. **Design Hit Counter (LeetCode #362)** - Hybrid design-algorithm problem. Uber might ask for ride counting, Google for system metrics.

## Which to Prepare for First

Prepare for **Google first**, even if your Uber interview comes earlier. Here's why:

1. Google's broader coverage forces you to learn more algorithms. It's easier to specialize down (Google → Uber) than expand up (Uber → Google).

2. Google's emphasis on optimal solutions and rigorous analysis creates good habits that serve you well at Uber.

3. The 45-minute time pressure at Google makes Uber's 60-minute slots feel more comfortable.

4. If you can handle Google's potential "academic" curveballs, Uber's practical problems will feel more approachable.

Start with the overlap topics (Arrays, Strings, Hash Tables, DP), then add Google-specific topics (Graphs, Trees), then finally layer on Uber's unique flavors (intervals, simulations). This gives you maximum flexibility if interview dates shift.

Remember: Both companies care more about your problem-solving process than perfect code. Talk through your thinking, ask clarifying questions, and discuss trade-offs. The specific problems may differ, but the core skill—breaking down complex problems systematically—is what both are ultimately testing.

For more company-specific insights, check out our [Google interview guide](/company/google) and [Uber interview guide](/company/uber).
