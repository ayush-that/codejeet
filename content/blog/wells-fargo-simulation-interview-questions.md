---
title: "Simulation Questions at Wells Fargo: What to Expect"
description: "Prepare for Simulation interview questions at Wells Fargo — patterns, difficulty breakdown, and study tips."
date: "2031-06-14"
category: "dsa-patterns"
tags: ["wells-fargo", "simulation", "interview prep"]
---

Simulation questions test your ability to translate a real-world process or set of rules into working code. At Wells Fargo, these questions are not just another technical hurdle; they are a direct assessment of a critical on-the-job skill. Financial systems, transaction processing, batch jobs, and workflow automations are all built on precise, rule-based logic. Your ability to accurately model a described scenario—handling edge cases, state changes, and sequential steps—demonstrates the meticulous, process-oriented thinking required in banking technology. With 3 out of 24 total questions, performing well here shows you can bridge the gap between abstract business requirements and functional software.

## What to Expect — types of problems

Wells Fargo simulation problems typically involve modeling a system over time or through a sequence of events. You will be given a set of explicit rules and an initial state, and you must write code to process a series of inputs or steps to produce a final result or state log.

Common problem archetypes include:

- **Queue or Process Simulation:** Modeling customers arriving at a service line (like bank tellers), where each has a service time, and you must track wait times or total processing time.
- **State Machine or Workflow:** Tracking the status of a loan application, transaction, or document as it moves through defined stages (e.g., "received," "under review," "approved," "rejected") based on triggering events.
- **Resource Allocation:** Simulating the allocation of a limited resource (e.g., bank ATMs, cash reserves) to a series of requests over time.
- **Game or Rule-Based Simulation:** Implementing the logic for a simple card game, board game move, or a financial calculation with multiple conditional steps.

The key is careful reading. The problem statement _is_ your specification. Missing a single rule about timing, precedence, or state transition is the most common reason for failure.

## How to Prepare — study tips with one code example

1.  **Parse the Problem Like a Specification.** Before writing any code, list all the rules, states, and inputs. Annotate the description. Identify the core entities (e.g., `Customer`, `Teller`, `Account`) and their properties.
2.  **Choose the Right Data Structures.** Simulations often need efficient access. Common choices include:
    - **Queues (`deque` in Python, `Array` in JavaScript, `Queue` in Java):** For first-in-first-out (FIFO) processes like customer lines.
    - **Heaps/Priority Queues:** To always process the next event in time order.
    - **Hash Maps/Dictionaries:** For O(1) lookups to update entity states.
3.  **Model Time or Steps Explicitly.** Decide if you will advance in discrete time units or process events in sorted order. A main simulation loop is standard.
4.  **Test with Edge Cases.** What happens at time zero? What if the queue is empty? What if a rule's condition is never met? Build these tests mentally or with simple print statements.

Here is a classic example: simulating a single queue with multiple servers (like bank tellers). The core pattern involves tracking when each server next becomes available.

<div class="code-group">

```python
from collections import deque
import heapq

def simulate_bank_tellers(arrivals, service_times, k):
    """
    arrivals: list of arrival times (sorted)
    service_times: list of corresponding service durations
    k: number of tellers
    Returns: list of times each customer finishes service.
    """
    # Min-heap stores (available_time, teller_id). Initially all tellers free at time 0.
    available_tellers = [(0, i) for i in range(k)]
    heapq.heapify(available_tellers)

    finish_times = []

    for arr_time, svc_time in zip(arrivals, service_times):
        # Get the next available teller
        avail_time, teller_id = heapq.heappop(available_tellers)
        # Customer starts service at the later of arrival or teller free time
        start_time = max(arr_time, avail_time)
        finish = start_time + svc_time
        finish_times.append(finish)
        # Teller becomes available again at finish time
        heapq.heappush(available_tellers, (finish, teller_id))

    return finish_times
```

```javascript
function simulateBankTellers(arrivals, serviceTimes, k) {
  // Min-heap (priority queue) of [availableTime, tellerId]
  const availableTellers = new MinPriorityQueue({
    priority: (teller) => teller[0],
  });
  for (let i = 0; i < k; i++) {
    availableTellers.enqueue([0, i]);
  }

  const finishTimes = [];

  for (let i = 0; i < arrivals.length; i++) {
    const arrTime = arrivals[i];
    const svcTime = serviceTimes[i];
    // Get next available teller
    const {
      element: [availTime, tellerId],
    } = availableTellers.dequeue();
    // Customer starts at the later time
    const startTime = Math.max(arrTime, availTime);
    const finish = startTime + svcTime;
    finishTimes.push(finish);
    // Teller becomes available again
    availableTellers.enqueue([finish, tellerId]);
  }
  return finishTimes;
}
```

```java
import java.util.*;

public class BankSimulation {
    public static List<Integer> simulateBankTellers(int[] arrivals, int[] serviceTimes, int k) {
        // Min-heap of teller availability: priority queue of int[2] {availableTime, tellerId}
        PriorityQueue<int[]> availableTellers = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        for (int i = 0; i < k; i++) {
            availableTellers.offer(new int[]{0, i});
        }

        List<Integer> finishTimes = new ArrayList<>();

        for (int i = 0; i < arrivals.length; i++) {
            int arrTime = arrivals[i];
            int svcTime = serviceTimes[i];
            int[] teller = availableTellers.poll();
            int availTime = teller[0];
            int startTime = Math.max(arrTime, availTime);
            int finish = startTime + svcTime;
            finishTimes.add(finish);
            // Teller becomes available again at finish time
            availableTellers.offer(new int[]{finish, teller[1]});
        }
        return finishTimes;
    }
}
```

</div>

## Recommended Practice Order

1.  Start with basic single-queue, single-server simulations to grasp the loop and state tracking.
2.  Move to multi-server problems using a priority queue (heap) to manage resource scheduling, as shown above.
3.  Practice state machine problems using a hash map to store entities and their current status, transitioning based on input events.
4.  Finally, tackle combined simulations that might involve multiple queues, different event types, or conditional branching within the process.

The goal is not speed but accuracy. A clean, correct simulation that follows every rule will score highly.

[Practice Simulation at Wells Fargo](/company/wells-fargo/simulation)
