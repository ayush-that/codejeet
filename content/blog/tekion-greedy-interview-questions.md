---
title: "Greedy Questions at Tekion: What to Expect"
description: "Prepare for Greedy interview questions at Tekion — patterns, difficulty breakdown, and study tips."
date: "2031-06-30"
category: "dsa-patterns"
tags: ["tekion", "greedy", "interview prep"]
---

# Greedy Questions at Tekion: What to Expect

If you're preparing for a Tekion interview, you might have noticed their question breakdown: 3 Greedy questions out of 23 total. That's about 13% of their problem pool. While this doesn't make Greedy their dominant focus, it's far from negligible. In real interviews, this translates to a solid chance you'll encounter at least one Greedy problem, especially in the technical phone screen or early coding rounds.

Here's what matters: Tekion builds automotive retail and service platforms—systems that handle scheduling, resource allocation, and optimization. Greedy algorithms are the workhorses for these real-time decision problems. When an interview asks, "How would you schedule service appointments to maximize technician utilization?" they're testing whether you can recognize when a locally optimal choice leads to a globally optimal solution. That's Greedy thinking.

The 13% figure is actually telling. It's higher than at pure infrastructure companies but lower than at trading firms. This means Tekion uses Greedy as a practical tool, not an academic exercise. You won't get obscure, mathematically complex Greedy proofs. You'll get problems where the Greedy choice is intuitive but requires careful justification.

## Specific Patterns Tekion Favors

Tekion's Greedy problems cluster around two practical themes: **interval scheduling** and **resource allocation**. These mirror their business domains—scheduling service appointments and allocating technicians or parts.

The most common pattern is **"earliest finish time" scheduling**. Think LeetCode #435 (Non-overlapping Intervals) or #452 (Minimum Number of Arrows to Burst Balloons). The core insight: to fit the most activities, always pick the one that finishes earliest. This frees up your resource for the next task sooner.

Another frequent pattern is **"minimum cost" assignment**, often disguised as a sorting problem. LeetCode #1029 (Two City Scheduling) is a classic example. You're asked to allocate resources (people to cities) to minimize total cost. The Greedy approach sorts by cost difference and assigns accordingly.

Here's the key variation Tekion adds: they often embed these patterns in **domain-specific narratives**. Instead of "burst balloons," you might be asked to "schedule test drives" where each time interval is a customer availability slot. The algorithm is identical, but you need to translate the business problem into the known pattern.

<div class="code-group">

```python
# Tekion-style interval scheduling: Maximum non-overlapping appointments
# Similar to LeetCode #435
def max_appointments(intervals):
    """
    intervals: list of [start, end] for appointment requests
    Returns: maximum number of non-overlapping appointments
    """
    if not intervals:
        return 0

    # Sort by end time (earliest finish first)
    intervals.sort(key=lambda x: x[1])

    count = 1
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= last_end:  # No overlap
            count += 1
            last_end = end

    return count

# Time: O(n log n) for sorting, O(n) for iteration → O(n log n)
# Space: O(1) if we ignore sorting space, O(log n) for Timsort
```

```javascript
// Tekion-style interval scheduling: Maximum non-overlapping appointments
function maxAppointments(intervals) {
  if (!intervals.length) return 0;

  // Sort by end time (earliest finish first)
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }

  return count;
}

// Time: O(n log n) | Space: O(1) (sorting in-place)
```

```java
// Tekion-style interval scheduling: Maximum non-overlapping appointments
import java.util.Arrays;

public class AppointmentScheduler {
    public int maxAppointments(int[][] intervals) {
        if (intervals.length == 0) return 0;

        // Sort by end time (earliest finish first)
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 1;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            int start = intervals[i][0];
            int end = intervals[i][1];

            if (start >= lastEnd) {
                count++;
                lastEnd = end;
            }
        }

        return count;
    }
}

// Time: O(n log n) | Space: O(log n) for Arrays.sort() (quicksort variant)
```

</div>

## How to Prepare

The biggest mistake candidates make with Greedy problems is assuming the solution is obvious. At Tekion, you need to **prove** your Greedy choice works. Practice this three-step approach:

1. **Identify the Greedy choice** — What's your local decision rule? (e.g., "pick earliest finishing interval")
2. **Prove optimal substructure** — Show that an optimal solution contains your Greedy choice
3. **Demonstrate Greedy-choice property** — Prove that your local choice leads to a global optimum

For interval problems, always sort by end time unless you have a specific reason to sort by start time. For assignment problems, sort by the metric that minimizes cost difference.

Here's a pattern variation they test: **"minimum resources needed"** problems. Instead of maximizing activities (like above), you minimize resources to cover all activities. LeetCode #253 (Meeting Rooms II) is the classic. The Greedy approach uses a min-heap to track resource availability.

<div class="code-group">

```python
# Minimum technicians needed to cover all appointments
# Similar to LeetCode #253
import heapq

def min_technicians(intervals):
    """
    intervals: list of [start, end] for appointments
    Returns: minimum technicians needed (no overlapping appointments per tech)
    """
    if not intervals:
        return 0

    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    # Min-heap to track end times of assigned technicians
    heap = []

    for start, end in intervals:
        # If earliest finishing technician is free before this appointment starts
        if heap and heap[0] <= start:
            heapq.heappop(heap)  # Reuse this technician

        # Assign current appointment to a technician
        heapq.heappush(heap, end)

    return len(heap)

# Time: O(n log n) for sorting + O(n log n) for heap operations → O(n log n)
# Space: O(n) for the heap
```

```javascript
// Minimum technicians needed to cover all appointments
function minTechnicians(intervals) {
  if (!intervals.length) return 0;

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  // Min-heap to track end times of assigned technicians
  const heap = new MinHeap();

  for (const [start, end] of intervals) {
    // If earliest finishing technician is free before this appointment starts
    if (heap.size() > 0 && heap.peek() <= start) {
      heap.extractMin();
    }

    // Assign current appointment to a technician
    heap.insert(end);
  }

  return heap.size();
}

// MinHeap implementation omitted for brevity
// Time: O(n log n) | Space: O(n)
```

```java
// Minimum technicians needed to cover all appointments
import java.util.Arrays;
import java.util.PriorityQueue;

public class TechnicianAllocator {
    public int minTechnicians(int[][] intervals) {
        if (intervals.length == 0) return 0;

        // Sort by start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        // Min-heap to track end times of assigned technicians
        PriorityQueue<Integer> heap = new PriorityQueue<>();

        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];

            // If earliest finishing technician is free before this appointment starts
            if (!heap.isEmpty() && heap.peek() <= start) {
                heap.poll();  // Reuse this technician
            }

            // Assign current appointment to a technician
            heap.offer(end);
        }

        return heap.size();
    }
}

// Time: O(n log n) | Space: O(n)
```

</div>

## How Tekion Tests Greedy vs Other Companies

Tekion's Greedy questions differ from other companies in three key ways:

1. **Business context over mathematical purity** — Unlike Google or Facebook, which might ask abstract Greedy proofs, Tekion wraps problems in automotive retail scenarios. The algorithm is standard, but you need to extract it from the story.

2. **Medium difficulty with implementation twists** — Their questions are typically LeetCode Medium level, but they add small twists. For example, instead of simple intervals, appointments might have priorities or technician skill requirements. This tests whether you truly understand the pattern or just memorized code.

3. **Follow-up questions about edge cases** — They'll ask: "What if appointments can be moved by 15 minutes?" or "How would you handle technician preferences?" These test your ability to modify the Greedy approach for real-world constraints.

Compared to trading firms (which ask harder Greedy problems) or big tech (which might combine Greedy with other patterns), Tekion stays practical. They want to see if you can implement a working solution and discuss trade-offs.

## Study Order

Don't jump straight into complex Greedy problems. Build your understanding progressively:

1. **Basic sorting-based Greedy** — Start with problems where sorting makes the Greedy choice obvious. LeetCode #455 (Assign Cookies) is perfect. You learn that sorting both arrays enables a simple two-pointer solution.

2. **Interval scheduling** — Master the "earliest finish time" pattern with LeetCode #435. Then learn the "minimum resources" variation with LeetCode #253. These are Tekion's bread and butter.

3. **Assignment problems** — Practice cost minimization with LeetCode #1029. This teaches you to sort by difference metrics.

4. **Greedy with data structures** — Learn when to combine Greedy with heaps (like in the technician example above) or queues.

5. **Proof practice** — For each problem, write a brief proof of why the Greedy choice works. This is what separates adequate from excellent candidates at Tekion.

## Recommended Practice Order

Solve these problems in sequence to build Tekion-relevant Greedy skills:

1. **LeetCode #455 (Assign Cookies)** — Simplest sorting Greedy
2. **LeetCode #435 (Non-overlapping Intervals)** — Core interval pattern
3. **LeetCode #452 (Minimum Number of Arrows)** — Interval variation
4. **LeetCode #253 (Meeting Rooms II)** — Minimum resources pattern
5. **LeetCode #1029 (Two City Scheduling)** — Assignment/cost minimization
6. **LeetCode #406 (Queue Reconstruction by Height)** — Advanced sorting Greedy
7. **LeetCode #621 (Task Scheduler)** — Greedy with counting/heaps

After these seven, you'll have covered 90% of Tekion's Greedy question types. Focus on clean implementations and clear explanations of why your Greedy approach works.

[Practice Greedy at Tekion](/company/tekion/greedy)
