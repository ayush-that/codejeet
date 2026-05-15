def move_zeros_to_end(a):
    write = 0
    for read in range(len(a)):
        if a[read] != 0:
            a[write], a[read] = a[read], a[write]
            write += 1


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
move_zeros_to_end(a)
print(" ".join(str(x) for x in a))
