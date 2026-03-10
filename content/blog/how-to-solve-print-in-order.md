---
title: "How to Solve Print in Order — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Print in Order. Easy difficulty, 72.8% acceptance rate. Topics: Concurrency."
date: "2028-06-27"
category: "dsa-patterns"
tags: ["print-in-order", "concurrency", "easy"]
---

# How to Solve Print in Order

This problem asks you to ensure that three methods (`first`, `second`, `third`) are always executed in order, even when called by different threads concurrently. The challenge is synchronizing threads so that `second` waits for `first` to complete, and `third` waits for `second` to complete, regardless of thread scheduling. This is a classic concurrency coordination problem that tests your understanding of thread signaling mechanisms.

## Visual Walkthrough

Let’s trace what happens without synchronization. Suppose three threads start nearly simultaneously:

- Thread A calls `first()`
- Thread B calls `second()`
- Thread C calls `third()`

Without coordination, the threads might execute in any order. For example:

1. Thread B prints "second" first ❌
2. Thread C prints "third" second ❌
3. Thread A prints "first" last ❌

The output would be "secondthirdfirst", which violates the requirement.

With proper synchronization, we need to enforce:

1. `first()` must complete before `second()` can proceed
2. `second()` must complete before `third()` can proceed

Think of it like a relay race where each runner must wait for the baton from the previous runner before starting.

## Brute Force Approach

A naive approach might use busy-waiting (spinning) with flags:

```python
class Foo:
    def __init__(self):
        self.first_done = False
        self.second_done = False

    def first(self):
        print("first")
        self.first_done = True

    def second(self):
        while not self.first_done:
            pass  # Busy waiting
        print("second")
        self.second_done = True

    def third(self):
        while not self.second_done:
            pass  # Busy waiting
        print("third")
```

**Why this fails:**

1. **CPU waste**: The while loops constantly check flags, consuming CPU cycles unnecessarily
2. **Visibility issues**: Without proper synchronization, changes to `first_done` and `second_done` might not be visible to other threads due to CPU caching
3. **Not thread-safe**: Race conditions could still occur

This approach demonstrates the need for proper thread synchronization primitives.

## Optimal Solution

We need a solution that efficiently blocks threads until it's their turn to execute. The best approach uses semaphores or condition variables to signal between threads. Each method waits for permission from the previous method before proceeding.

<div class="code-group">

```python
# Time: O(1) per method | Space: O(1)
from threading import Semaphore

class Foo:
    def __init__(self):
        # Create two semaphores initialized to 0 (locked)
        # second_lock controls when second() can run
        # third_lock controls when third() can run
        self.second_lock = Semaphore(0)
        self.third_lock = Semaphore(0)

    def first(self, printFirst: 'Callable[[], None]') -> None:
        # printFirst() outputs "first". Do not change or remove this line.
        printFirst()

        # Release the second_lock semaphore, allowing second() to proceed
        self.second_lock.release()

    def second(self, printSecond: 'Callable[[], None]') -> None:
        # Acquire second_lock - this will block until first() releases it
        self.second_lock.acquire()

        # printSecond() outputs "second". Do not change or remove this line.
        printSecond()

        # Release the third_lock semaphore, allowing third() to proceed
        self.third_lock.release()

    def third(self, printThird: 'Callable[[], None]') -> None:
        # Acquire third_lock - this will block until second() releases it
        self.third_lock.acquire()

        # printThird() outputs "third". Do not change or remove this line.
        printThird()
```

```javascript
// Time: O(1) per method | Space: O(1)

class Foo {
  constructor() {
    // Create two promises that will be resolved when ready
    // p1 controls when second() can run
    // p2 controls when third() can run
    this.p1 = new Promise((resolve) => (this.resolve1 = resolve));
    this.p2 = new Promise((resolve) => (this.resolve2 = resolve));
  }

  async first(printFirst) {
    // printFirst() outputs "first". Do not change or remove this line.
    printFirst();

    // Resolve the first promise, allowing second() to proceed
    this.resolve1();
  }

  async second(printSecond) {
    // Wait for first() to complete before proceeding
    await this.p1;

    // printSecond() outputs "second". Do not change or remove this line.
    printSecond();

    // Resolve the second promise, allowing third() to proceed
    this.resolve2();
  }

  async third(printThird) {
    // Wait for second() to complete before proceeding
    await this.p2;

    // printThird() outputs "third". Do not change or remove this line.
    printThird();
  }
}
```

```java
// Time: O(1) per method | Space: O(1)
import java.util.concurrent.Semaphore;

class Foo {
    // Create two semaphores initialized to 0 (locked)
    // secondSemaphore controls when second() can run
    // thirdSemaphore controls when third() can run
    private Semaphore secondSemaphore = new Semaphore(0);
    private Semaphore thirdSemaphore = new Semaphore(0);

    public Foo() {
        // Constructor - semaphores are already initialized
    }

    public void first(Runnable printFirst) throws InterruptedException {
        // printFirst.run() outputs "first". Do not change or remove this line.
        printFirst.run();

        // Release the secondSemaphore, allowing second() to proceed
        secondSemaphore.release();
    }

    public void second(Runnable printSecond) throws InterruptedException {
        // Acquire secondSemaphore - this will block until first() releases it
        secondSemaphore.acquire();

        // printSecond.run() outputs "second". Do not change or remove this line.
        printSecond.run();

        // Release the thirdSemaphore, allowing third() to proceed
        thirdSemaphore.release();
    }

    public void third(Runnable printThird) throws InterruptedException {
        // Acquire thirdSemaphore - this will block until second() releases it
        thirdSemaphore.acquire();

        // printThird.run() outputs "third". Do not change or remove this line.
        printThird.run();
    }
}
```

</div>

**How it works:**

1. **Semaphore approach (Python/Java)**: We use two semaphores initialized to 0 (locked). `second()` waits on `second_lock`, which `first()` releases after printing. `third()` waits on `third_lock`, which `second()` releases after printing.

2. **Promise approach (JavaScript)**: We use promises that get resolved when the previous method completes. `second()` awaits the first promise, `third()` awaits the second promise.

3. **Key insight**: Each method only proceeds when explicitly signaled by the previous method. This creates a chain of dependencies that ensures execution order.

## Complexity Analysis

**Time Complexity**: O(1) per method call

- Each method performs a constant amount of work: printing and signaling
- The semaphore operations (acquire/release) or promise resolutions are O(1) operations
- No loops or recursion that depend on input size

**Space Complexity**: O(1)

- We use a constant amount of extra space regardless of input
- Semaphores or promises use a fixed amount of memory
- No data structures that grow with input size

## Common Mistakes

1. **Using sleep() or yield()**: Some candidates try to use `Thread.sleep()` or `Thread.yield()` hoping threads will magically synchronize. This doesn't guarantee order and creates race conditions.

2. **Forgetting to initialize semaphores to 0**: If semaphores start at 1, `second()` might run before `first()`, breaking the ordering.

3. **Missing volatile/atomic flags in busy-waiting solutions**: Without proper memory barriers, flag changes might not be visible across threads, causing infinite loops.

4. **Deadlock from incorrect acquire/release order**: Releasing a semaphore before acquiring it, or acquiring in the wrong order, can cause threads to wait forever.

5. **Not handling InterruptedException in Java**: Failing to declare or handle `InterruptedException` in the method signatures can cause compilation errors.

## When You'll See This Pattern

This pattern appears in any problem requiring sequential execution of concurrent tasks:

1. **Print FooBar Alternately (LeetCode 1115)**: Similar concept but with alternating two methods instead of sequential three methods.

2. **Building H2O (LeetCode 1117)**: Requires coordinating hydrogen and oxygen threads in specific ratios (2:1).

3. **Traffic Light Controlled Intersection (LeetCode 1279)**: Coordinates multiple cars through an intersection without collisions.

4. **Design Bounded Blocking Queue (LeetCode 1188)**: Uses similar synchronization primitives to coordinate producers and consumers.

The core technique is using synchronization primitives (semaphores, mutexes, condition variables, promises) to enforce execution order or resource access patterns between concurrent threads.

## Key Takeaways

1. **Use proper synchronization primitives** for thread coordination instead of busy-waiting. Semaphores, mutexes, and condition variables are designed for this purpose.

2. **Think in terms of dependencies**: Map out which threads/methods must wait for which others, then use synchronization objects to enforce those dependencies.

3. **Initialize synchronization objects correctly**: Semaphores initialized to 0 start locked, which is often what you want for "wait for signal" scenarios.

4. **Test with different thread schedules**: The solution should work regardless of which thread starts first or how the OS schedules them.

Related problems: [Print FooBar Alternately](/problem/print-foobar-alternately)
