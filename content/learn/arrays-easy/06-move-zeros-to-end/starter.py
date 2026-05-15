def move_zeros_to_end(a):
    # TODO: move all zeros to the end of a in place, preserving non-zero order.
    pass


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
move_zeros_to_end(a)
print(" ".join(str(x) for x in a))
