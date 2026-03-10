---
title: "How to Solve Eliminate Maximum Number of Monsters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Eliminate Maximum Number of Monsters. Medium difficulty, 51.0% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-01-31"
category: "dsa-patterns"
tags: ["eliminate-maximum-number-of-monsters", "array", "greedy", "sorting", "medium"]
---

# How to Solve "Eliminate Maximum Number of Monsters"

You're defending a city from monsters that start at given distances and move toward the city at 1 km per minute. You can eliminate one monster per minute starting at minute 0. The challenge is determining the maximum number of monsters you can eliminate before one reaches the city. The tricky part is that monsters arrive at different times based on their distance, and you need to prioritize eliminating them before they arrive.

## Visual Walkthrough

Let's trace through an example: `dist = [1, 3, 4]`, `speed = [1, 1, 1]`

**Step 1: Calculate arrival times**

- Monster 0: distance 1 ÷ speed 1 = 1 minute to arrive
- Monster 1: distance 3 ÷ speed 1 = 3 minutes to arrive
- Monster 2: distance 4 ÷ speed 1 = 4 minutes to arrive

**Step 2: Sort arrival times**
Times: [1, 3, 4]

**Step 3: Simulate elimination minute by minute**

- Minute 0: Eliminate monster arriving at minute 1 (time[0] = 1)
- Minute 1: Check if monster arriving at minute 3 (time[1] = 3) has arrived yet. Current minute = 1, arrival time = 3, so monster hasn't arrived yet. Eliminate it.
- Minute 2: Check if monster arriving at minute 4 (time[2] = 4) has arrived yet. Current minute = 2, arrival time = 4, so monster hasn't arrived yet. Eliminate it.

**Step 4: Result**
We eliminated all 3 monsters before any reached the city.

Now consider a trickier example: `dist = [3, 2, 4]`, `speed = [5, 3, 2]`

**Step 1: Calculate arrival times**

- Monster 0: 3 ÷ 5 = 0.6 minutes → ceil(0.6) = 1 minute
- Monster 1: 2 ÷ 3 ≈ 0.667 minutes → ceil(0.667) = 1 minute
- Monster 2: 4 ÷ 2 = 2 minutes → ceil(2) = 2 minutes

**Step 2: Sort arrival times**
Times: [1, 1, 2]

**Step 3: Simulate elimination**

- Minute 0: Eliminate first monster arriving at minute 1
- Minute 1: Check second monster arriving at minute 1. Current minute = 1, arrival time = 1, so monster arrives NOW. Game over!

We eliminated only 1 monster. The key insight: we need to eliminate monsters in order of their arrival times, and a monster arriving at minute `t` must be eliminated by minute `t-1` at the latest.

## Brute Force Approach

A naive approach would be to simulate every possible elimination order, but with n monsters, there are n! permutations to check - clearly infeasible for n > 10.

Another brute force approach: at each minute, try to eliminate the monster that will reach the city soonest if not eliminated. We could:

1. Calculate arrival times for all monsters
2. Each minute: find the monster with smallest positive arrival time, eliminate it
3. Reduce remaining arrival times by 1 (since time passes)
4. Repeat until a monster's arrival time ≤ 0

This approach is O(n²) since each minute we scan all monsters to find the minimum. For n up to 10⁵, this is too slow.

## Optimized Approach

The key insight is that we should process monsters in order of their arrival times. Here's the reasoning:

1. **Arrival time calculation**: A monster at distance `d` with speed `s` takes `ceil(d / s)` minutes to reach the city. We use ceiling because if a monster would arrive at 2.3 minutes, it actually arrives at minute 3 (we check at integer minute boundaries).

2. **Sorting strategy**: If we sort monsters by arrival time, we can process them in the order they would reach the city if left unchecked.

3. **Greedy elimination**: At minute `i` (starting from 0), we check the `i`-th earliest arriving monster. If its arrival time ≤ `i`, it means this monster would have reached the city by now, so we lose. Otherwise, we eliminate it and continue.

Why does this work? Consider two monsters A and B where A arrives earlier than B. If we eliminate B first and A reaches the city, we lose. But if we eliminate A first, we might still have time for B. So eliminating in arrival order is optimal.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def eliminateMaximum(dist, speed):
    """
    Calculate the maximum number of monsters that can be eliminated
    before any reaches the city.

    Args:
        dist: List of initial distances of monsters from city
        speed: List of speeds of monsters (km per minute)

    Returns:
        Maximum number of monsters eliminated before city is breached
    """
    n = len(dist)

    # Step 1: Calculate arrival time for each monster
    # We use ceiling division: ceil(d / s) = (d + s - 1) // s
    arrival_times = []
    for i in range(n):
        # Calculate minutes until monster reaches city
        # Using integer ceiling division without math.ceil
        time = (dist[i] + speed[i] - 1) // speed[i]
        arrival_times.append(time)

    # Step 2: Sort arrival times in ascending order
    # This lets us process monsters in the order they would arrive
    arrival_times.sort()

    # Step 3: Greedy elimination minute by minute
    # At minute i (starting from 0), we try to eliminate the i-th monster
    for minute in range(n):
        # If a monster's arrival time <= current minute,
        # it means it would reach the city now (or already has)
        if arrival_times[minute] <= minute:
            # Game over - monster reached city
            return minute

    # If we eliminate all monsters without any reaching city
    return n
```

```javascript
// Time: O(n log n) | Space: O(n)
function eliminateMaximum(dist, speed) {
  /**
   * Calculate the maximum number of monsters that can be eliminated
   * before any reaches the city.
   *
   * @param {number[]} dist - Initial distances of monsters from city
   * @param {number[]} speed - Speeds of monsters (km per minute)
   * @return {number} Maximum number of monsters eliminated
   */
  const n = dist.length;

  // Step 1: Calculate arrival time for each monster
  // Using Math.ceil for ceiling division
  const arrivalTimes = new Array(n);
  for (let i = 0; i < n; i++) {
    // Calculate minutes until monster reaches city
    arrivalTimes[i] = Math.ceil(dist[i] / speed[i]);
  }

  // Step 2: Sort arrival times in ascending order
  // This lets us process monsters in the order they would arrive
  arrivalTimes.sort((a, b) => a - b);

  // Step 3: Greedy elimination minute by minute
  // At minute i (starting from 0), we try to eliminate the i-th monster
  for (let minute = 0; minute < n; minute++) {
    // If a monster's arrival time <= current minute,
    // it means it would reach the city now (or already has)
    if (arrivalTimes[minute] <= minute) {
      // Game over - monster reached city
      return minute;
    }
  }

  // If we eliminate all monsters without any reaching city
  return n;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int eliminateMaximum(int[] dist, int[] speed) {
        /**
         * Calculate the maximum number of monsters that can be eliminated
         * before any reaches the city.
         *
         * @param dist Initial distances of monsters from city
         * @param speed Speeds of monsters (km per minute)
         * @return Maximum number of monsters eliminated
         */
        int n = dist.length;

        // Step 1: Calculate arrival time for each monster
        double[] arrivalTimes = new double[n];
        for (int i = 0; i < n; i++) {
            // Calculate minutes until monster reaches city
            // Using double division then Math.ceil
            arrivalTimes[i] = Math.ceil((double) dist[i] / speed[i]);
        }

        // Step 2: Sort arrival times in ascending order
        // This lets us process monsters in the order they would arrive
        Arrays.sort(arrivalTimes);

        // Step 3: Greedy elimination minute by minute
        // At minute i (starting from 0), we try to eliminate the i-th monster
        for (int minute = 0; minute < n; minute++) {
            // If a monster's arrival time <= current minute,
            // it means it would reach the city now (or already has)
            if (arrivalTimes[minute] <= minute) {
                // Game over - monster reached city
                return minute;
            }
        }

        // If we eliminate all monsters without any reaching city
        return n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating arrival times: O(n) - one pass through all monsters
- Sorting arrival times: O(n log n) - dominant term
- Scanning through sorted times: O(n)
- Total: O(n + n log n + n) = O(n log n)

**Space Complexity: O(n)**

- We store an array of arrival times of size n
- Sorting typically uses O(log n) to O(n) additional space depending on algorithm, but we count the output array as O(n)

The O(n log n) time is efficient for n up to 10⁵, which is typical for LeetCode constraints.

## Common Mistakes

1. **Forgetting to use ceiling division**: Using floor division `dist[i] // speed[i]` is incorrect. If a monster takes 2.3 minutes to arrive, it actually arrives at minute 3, not minute 2. The monster is moving continuously, and we check at integer minute boundaries.

2. **Not sorting arrival times**: Some candidates try to process monsters in their original order or by some other metric. The optimal strategy requires eliminating monsters in order of their arrival times.

3. **Off-by-one errors in the loop**: The loop condition `arrival_times[i] <= i` is correct because:
   - At minute 0, we eliminate a monster before any time passes
   - A monster arriving at minute 1 must be eliminated at minute 0
   - So if `arrival_time ≤ current_minute`, the monster has arrived

4. **Using floating-point division carelessly**: In Java, `dist[i] / speed[i]` with integers does integer division. You need to cast to double first: `(double) dist[i] / speed[i]`. In Python, `/` gives float, `//` gives integer floor. Use `math.ceil()` or the integer trick `(d + s - 1) // s`.

## When You'll See This Pattern

This problem uses a **greedy scheduling** pattern with **deadline constraints**. Similar problems include:

1. **Meeting Rooms II (LeetCode 253)**: Schedule meetings in rooms where you need to minimize rooms needed. Like monsters arriving at specific times, meetings have start/end times.

2. **Task Scheduler (LeetCode 621)**: Schedule tasks with cooldown periods. Similar to eliminating monsters with the constraint of one per minute.

3. **Maximum Number of Events That Can Be Attended (LeetCode 1353)**: Attend events with start/end days, similar to eliminating monsters before they "expire" (reach the city).

The core pattern: when you have tasks/events with deadlines and limited processing capacity, sort by deadline and process greedily.

## Key Takeaways

1. **Greedy with sorting by deadline**: When you can only process one item per time unit and items have deadlines, sort by deadline and process in order. This is often optimal for maximizing completed tasks.

2. **Ceiling division for arrival times**: When calculating when something arrives given constant speed, use ceiling division because arrival happens at discrete time checks.

3. **Minute-by-minute simulation can be optimized**: Instead of actually simulating time passing, we can use mathematical comparison `arrival_time ≤ current_minute` to check if we're too late.

**Related problems:** [Minimum Health to Beat Game](/problem/minimum-health-to-beat-game), [Minimum Time to Kill All Monsters](/problem/minimum-time-to-kill-all-monsters)
