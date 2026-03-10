---
title: "How to Solve Time Needed to Buy Tickets — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Time Needed to Buy Tickets. Easy difficulty, 72.2% acceptance rate. Topics: Array, Queue, Simulation."
date: "2028-01-08"
category: "dsa-patterns"
tags: ["time-needed-to-buy-tickets", "array", "queue", "simulation", "easy"]
---

# How to Solve "Time Needed to Buy Tickets"

This problem asks us to calculate the total time it takes for a specific person at position `k` to finish buying all their tickets. People in a queue take one second to buy one ticket, and after each purchase, they either leave the line (if they have no tickets left) or go to the back of the queue. The tricky part is that while we're tracking time for person `k`, everyone else is also moving through the queue, and we need to account for their purchases too.

## Visual Walkthrough

Let's trace through an example: `tickets = [2,3,2]` and `k = 2` (the third person who wants 2 tickets).

**Initial queue:** [Person0(2), Person1(3), Person2(2)]

**Time = 1:** Person0 buys 1 ticket → now has 1 ticket left → goes to back
Queue: [Person1(3), Person2(2), Person0(1)]

**Time = 2:** Person1 buys 1 ticket → now has 2 tickets left → goes to back  
Queue: [Person2(2), Person0(1), Person1(2)]

**Time = 3:** Person2 (our target) buys 1 ticket → now has 1 ticket left → goes to back
Queue: [Person0(1), Person1(2), Person2(1)]

**Time = 4:** Person0 buys 1 ticket → now has 0 tickets left → LEAVES
Queue: [Person1(2), Person2(1)]

**Time = 5:** Person1 buys 1 ticket → now has 1 ticket left → goes to back
Queue: [Person2(1), Person1(1)]

**Time = 6:** Person2 (our target) buys 1 ticket → now has 0 tickets left → LEAVES
Queue: [Person1(1)]

At this point, person `k` has finished buying all their tickets. Total time = **6 seconds**.

Notice the pattern: For people before `k` (index < k), they can buy at most `min(tickets[i], tickets[k])` tickets. For people after `k` (index > k), they can buy at most `min(tickets[i], tickets[k] - 1)` tickets because by the time we reach them after person `k` finishes, person `k` won't be in line anymore.

## Brute Force Approach

The most intuitive approach is to simulate the entire queue process. We could use an actual queue data structure and simulate each second:

1. Initialize a queue with all people (store their index and ticket count)
2. Initialize time = 0
3. While person `k` still has tickets:
   - Dequeue the front person
   - They buy 1 ticket (time += 1)
   - If they still have tickets left, enqueue them back
   - If this was person `k` and they're now out of tickets, return time

This simulation approach works but is inefficient. In the worst case where everyone wants many tickets, we might process each person many times. If `n` is the number of people and `m` is the maximum tickets anyone wants, the time complexity could be O(n × m).

## Optimal Solution

We can solve this in O(n) time with O(1) space by recognizing the mathematical pattern we observed in the visual walkthrough. For each person `i`:

- If `i ≤ k`: This person is before or at the same position as `k`. They will buy tickets until either they're done or person `k` is done. So they contribute `min(tickets[i], tickets[k])` seconds.
- If `i > k`: This person is after `k`. They will buy tickets until either they're done or person `k-1` is done (because once person `k` finishes, they leave the queue). So they contribute `min(tickets[i], tickets[k] - 1)` seconds.

Wait, why `tickets[k] - 1` for people after `k`? Let's think: When person `k` buys their last ticket, they immediately leave. People after `k` in the queue at that moment won't get another chance to buy tickets after person `k` finishes. So they can only buy while person `k` still has tickets, which means at most `tickets[k] - 1` times before person `k`'s final purchase.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def timeRequiredToBuy(tickets, k):
    """
    Calculate total time for person k to buy all their tickets.

    Args:
        tickets: List of ticket counts for each person
        k: Index of the person we're tracking

    Returns:
        Total time in seconds
    """
    total_time = 0

    # Iterate through all people in the queue
    for i in range(len(tickets)):
        if i <= k:
            # People before or at position k
            # They can buy at most min(tickets[i], tickets[k]) tickets
            total_time += min(tickets[i], tickets[k])
        else:
            # People after position k
            # They can buy at most min(tickets[i], tickets[k] - 1) tickets
            # because person k leaves after buying their last ticket
            total_time += min(tickets[i], tickets[k] - 1)

    return total_time
```

```javascript
// Time: O(n) | Space: O(1)
function timeRequiredToBuy(tickets, k) {
  let totalTime = 0;

  // Iterate through all people in the queue
  for (let i = 0; i < tickets.length; i++) {
    if (i <= k) {
      // People before or at position k
      // They can buy at most min(tickets[i], tickets[k]) tickets
      totalTime += Math.min(tickets[i], tickets[k]);
    } else {
      // People after position k
      // They can buy at most min(tickets[i], tickets[k] - 1) tickets
      // because person k leaves after buying their last ticket
      totalTime += Math.min(tickets[i], tickets[k] - 1);
    }
  }

  return totalTime;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int timeRequiredToBuy(int[] tickets, int k) {
        int totalTime = 0;

        // Iterate through all people in the queue
        for (int i = 0; i < tickets.length; i++) {
            if (i <= k) {
                // People before or at position k
                // They can buy at most min(tickets[i], tickets[k]) tickets
                totalTime += Math.min(tickets[i], tickets[k]);
            } else {
                // People after position k
                // They can buy at most min(tickets[i], tickets[k] - 1) tickets
                // because person k leaves after buying their last ticket
                totalTime += Math.min(tickets[i], tickets[k] - 1);
            }
        }

        return totalTime;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of people in the queue. We simply iterate through the array once, performing constant-time operations for each person.

**Space Complexity:** O(1). We only use a few integer variables regardless of the input size. The solution doesn't require any additional data structures that grow with input size.

## Common Mistakes

1. **Forgetting the -1 for people after k:** This is the most common mistake. Candidates often use `min(tickets[i], tickets[k])` for everyone. But people after `k` get one fewer opportunity to buy tickets because once person `k` finishes, they leave immediately.

2. **Using simulation when not needed:** While simulating the queue process is conceptually simple, it's inefficient for large inputs. Interviewers expect you to recognize the mathematical pattern and provide the O(n) solution.

3. **Off-by-one errors with indices:** When checking `i <= k` vs `i < k`, remember that person `k` themselves should be included in the first group. The condition should be `i <= k` not `i < k`.

4. **Not handling edge cases:** What if `tickets[k] = 0`? Or what if `k` is the last person? Test these:
   - If `tickets[k] = 0`, the answer should be 0 (they're done immediately)
   - If `k` is last, people after `k` don't exist, so our loop handles it correctly

## When You'll See This Pattern

This problem uses a **mathematical simplification of a simulation process**. Instead of actually simulating each step, we derive a formula that gives us the answer directly. This pattern appears in:

1. **Number of Students Unable to Eat Lunch (Easy):** Similar queue simulation problem where students cycle through a line. The optimal solution often involves counting rather than simulating.

2. **Task Scheduler (Medium):** While more complex, it also involves calculating minimum time for tasks with cooldowns without simulating every time unit.

3. **Queue-based problems in general:** Whenever you see a problem involving people/items moving through a queue or circular buffer, consider whether you can find a mathematical formula instead of simulating.

## Key Takeaways

1. **Look for mathematical patterns in simulations:** Many problems that seem to require simulation can be solved more efficiently by finding the underlying mathematical relationship. Ask yourself: "Can I calculate this directly instead of simulating step-by-step?"

2. **Pay attention to position-based differences:** In queue problems, elements at different positions often have different behaviors. Identify these groups and handle them separately.

3. **Test with small examples:** Tracing through a concrete example (like we did with [2,3,2], k=2) is the best way to discover the pattern and avoid off-by-one errors.

Related problems: [Number of Students Unable to Eat Lunch](/problem/number-of-students-unable-to-eat-lunch)
