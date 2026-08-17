const steps = [];

function recordStep(values, type, indices) {
    steps.push({
        values: [...values],
        type: type,
        indices: indices
    });
}

function bubbleSortRecursive (values, n) {
    if (n <= 1) {
        //base case, exit
        return;
    }
    
    for (let i = 1; i < n; i++) {
        recordStep(values, "compare", [i - 1, i]);

        if (values[i - 1] > values[i]) {
            const temp = values[i];
            values[i] = values[i - 1];
            values[i - 1] = temp;

            recordStep(values, "swap", [i - 1, i]);
        }
    }
    bubbleSortRecursive(values, n - 1);
}

export function bubbleSort(values) {
    //reset steps
    steps.length = 0;

    recordStep(values, "initial", []);

    bubbleSortRecursive(values, values.length);

    return steps;
}