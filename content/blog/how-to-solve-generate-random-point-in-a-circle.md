---
title: "How to Solve Generate Random Point in a Circle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Generate Random Point in a Circle. Medium difficulty, 42.5% acceptance rate. Topics: Math, Geometry, Rejection Sampling, Randomized."
date: "2028-06-22"
category: "dsa-patterns"
tags: ["generate-random-point-in-a-circle", "math", "geometry", "rejection-sampling", "medium"]
---

# How to Solve Generate Random Point in a Circle

This problem asks us to generate uniformly random points inside a circle given its radius and center coordinates. The challenge is that simply picking random x and y coordinates within a bounding square won't work—it would create a non-uniform distribution with more points near the corners. We need a mathematically correct way to ensure every point inside the circle has an equal probability of being selected.

## Visual Walkthrough

Let's say we have a circle with radius 1, centered at (0, 0). If we naively pick random x and y values between -1 and 1, we're actually picking points from a square that contains the circle. Points outside the circle (in the square's corners) would be invalid, so we'd need to reject them.

For example:

- Random point (0.5, 0.5): distance = √(0.5² + 0.5²) = √0.5 ≈ 0.707 ≤ 1 → valid point inside circle
- Random point (0.9, 0.9): distance = √(0.81 + 0.81) = √1.62 ≈ 1.27 > 1 → outside circle, must reject

The key insight is that to get a truly uniform distribution inside the circle, we can't just use uniform random coordinates—we need to account for the fact that there's more area near the edge of the circle than near the center.

## Brute Force Approach

The most straightforward approach is **rejection sampling**:

1. Generate random x and y coordinates within the square bounding the circle
2. Check if the point is inside the circle using the distance formula
3. If inside, return it; if not, try again

While this approach works and is simple to understand, it's inefficient because we waste computational effort generating points that fall outside the circle. In the worst case (when the circle fills only about 78.5% of the square), we'd reject about 21.5% of generated points. This approach also doesn't scale well if we need to generate many points quickly.

## Optimized Approach

The optimal solution uses polar coordinates with a mathematical trick. In polar coordinates, any point can be represented as:

- Distance from center (r)
- Angle from horizontal (θ)

The naive approach would be to pick r uniformly between 0 and radius, and θ uniformly between 0 and 2π. However, this creates a non-uniform distribution with more points near the center! Why? Because there's less area near the center—a small change in r near the center covers less area than the same change in r near the edge.

The correct approach is to pick r = √(random()) × radius. This square root transformation ensures uniform distribution over the area of the circle. Here's why:

- The area of a circle grows with r²
- To get uniform area distribution, we need probability density proportional to r
- Taking the square root of a uniform random variable gives us this distribution

Once we have r and θ, we convert back to Cartesian coordinates:

- x = x_center + r × cos(θ)
- y = y_center + r × sin(θ)

## Optimal Solution

<div class="code-group">

```python
import random
import math

class Solution:
    """
    Solution for generating uniformly random points inside a circle.
    Time: O(1) per randPoint call
    Space: O(1) for storing circle parameters
    """

    def __init__(self, radius: float, x_center: float, y_center: float):
        # Store circle parameters
        self.radius = radius
        self.x_center = x_center
        self.y_center = y_center

    def randPoint(self) -> List[float]:
        # Step 1: Generate random angle between 0 and 2π
        # Using random.random() gives uniform [0, 1)
        theta = random.random() * 2 * math.pi

        # Step 2: Generate random radius with square root transformation
        # This ensures uniform distribution over the circle's area
        # Without sqrt, points would cluster near the center
        r = math.sqrt(random.random()) * self.radius

        # Step 3: Convert polar coordinates to Cartesian coordinates
        # x = center_x + r * cos(θ)
        # y = center_y + r * sin(θ)
        x = self.x_center + r * math.cos(theta)
        y = self.y_center + r * math.sin(theta)

        return [x, y]
```

```javascript
class Solution {
  /**
   * Solution for generating uniformly random points inside a circle.
   * Time: O(1) per randPoint call
   * Space: O(1) for storing circle parameters
   */

  /**
   * @param {number} radius
   * @param {number} x_center
   * @param {number} y_center
   */
  constructor(radius, x_center, y_center) {
    // Store circle parameters
    this.radius = radius;
    this.x_center = x_center;
    this.y_center = y_center;
  }

  /**
   * @return {number[]}
   */
  randPoint() {
    // Step 1: Generate random angle between 0 and 2π
    // Math.random() gives uniform [0, 1)
    const theta = Math.random() * 2 * Math.PI;

    // Step 2: Generate random radius with square root transformation
    // This ensures uniform distribution over the circle's area
    // Without sqrt, points would cluster near the center
    const r = Math.sqrt(Math.random()) * this.radius;

    // Step 3: Convert polar coordinates to Cartesian coordinates
    // x = center_x + r * cos(θ)
    // y = center_y + r * sin(θ)
    const x = this.x_center + r * Math.cos(theta);
    const y = this.y_center + r * Math.sin(theta);

    return [x, y];
  }
}
```

```java
import java.util.Random;

class Solution {
    /**
     * Solution for generating uniformly random points inside a circle.
     * Time: O(1) per randPoint call
     * Space: O(1) for storing circle parameters
     */

    private double radius;
    private double x_center;
    private double y_center;
    private Random rand;

    public Solution(double radius, double x_center, double y_center) {
        // Store circle parameters
        this.radius = radius;
        this.x_center = x_center;
        this.y_center = y_center;
        this.rand = new Random();
    }

    public double[] randPoint() {
        // Step 1: Generate random angle between 0 and 2π
        // nextDouble() gives uniform [0, 1)
        double theta = rand.nextDouble() * 2 * Math.PI;

        // Step 2: Generate random radius with square root transformation
        // This ensures uniform distribution over the circle's area
        // Without sqrt, points would cluster near the center
        double r = Math.sqrt(rand.nextDouble()) * radius;

        // Step 3: Convert polar coordinates to Cartesian coordinates
        // x = center_x + r * cos(θ)
        // y = center_y + r * sin(θ)
        double x = x_center + r * Math.cos(theta);
        double y = y_center + r * Math.sin(theta);

        return new double[]{x, y};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) per `randPoint()` call

- Each call performs a constant number of operations: generating random numbers, calculating square roots, and computing trigonometric functions
- All operations have constant time complexity

**Space Complexity:** O(1)

- We only store the circle parameters (radius, x_center, y_center)
- No additional data structures that grow with input size
- The output array has fixed size (2 elements)

## Common Mistakes

1. **Forgetting the square root transformation**: The most common mistake is using `r = random() * radius` instead of `r = sqrt(random()) * radius`. Without the square root, points cluster near the center because the area of concentric circles grows with r², not r.

2. **Using degrees instead of radians**: Trigonometric functions in most programming languages expect angles in radians, not degrees. Using degrees would give completely wrong results.

3. **Incorrect bounds for the angle**: The angle θ should be uniformly distributed between 0 and 2π (approximately 6.283), not between 0 and π or 0 and 360.

4. **Not handling floating-point precision**: While not critical for this problem, in some implementations you might need to ensure the generated point is exactly on the boundary if that's required. For this problem, points on the boundary are acceptable.

## When You'll See This Pattern

This problem teaches the **transformation of random variables** technique, which is useful whenever you need to generate random points according to a specific probability distribution:

1. **Random Point in Non-overlapping Rectangles (LeetCode 497)**: Similar concept but for rectangles instead of circles. You need to select a rectangle weighted by area, then pick a random point within it.

2. **Generate Random Point in a Circle (variations)**: The same technique applies to generating points in spheres (3D) or higher-dimensional balls.

3. **Monte Carlo integration**: When estimating areas or integrals using random sampling, you often need to generate points uniformly within complex shapes.

4. **Computer graphics and simulations**: Generating random points with specific distributions is common in particle systems, ray tracing, and procedural generation.

## Key Takeaways

1. **Uniform area distribution ≠ uniform radius distribution**: To get points uniformly distributed over a circle's area, you need to transform the random radius using a square root. This accounts for the fact that area grows with r².

2. **Polar coordinates simplify circular problems**: When working with circles, converting to polar coordinates often makes the math cleaner. Remember to convert back to Cartesian coordinates for the final answer.

3. **Rejection sampling vs. direct sampling**: While rejection sampling (generate in bounding box, reject if outside circle) is simpler to implement, direct sampling using the correct mathematical transformation is more efficient for this problem.

Related problems: [Random Point in Non-overlapping Rectangles](/problem/random-point-in-non-overlapping-rectangles)
