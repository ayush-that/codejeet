#include <iostream>
#include <vector>
using namespace std;

int largest(const vector<int>& a) {
    int best = a[0];
    for (size_t i = 1; i < a.size(); i++) {
        if (a[i] > best) best = a[i];
    }
    return best;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << largest(a) << "\n";
    return 0;
}
