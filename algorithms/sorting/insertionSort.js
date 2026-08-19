const steps = [];

function recordStep(values, type, indices) {
    steps.push({
        values: [...values],
        type: type,
        indices: indices
    });
}

function insertionSortRecursive(values, current) {
    if (current >= values.length) {
        return;
    }

    const key = values[current];
    let i = current - 1;

    while (i >= 0 && values[i] > key) {
        recordStep(values, "compare", [i, i + 1]);

        values[i + 1] = values[i];
        recordStep(values, "shift", [i, i + 1]);

        i--;
    }

    values[i + 1] = key;
    recordStep(values, "insert", [i + 1]);

    insertionSortRecursive(values, current + 1);
}

export function insertionSort(values) {
    steps.length = 0;

    recordStep(values, "initial", []);

    insertionSortRecursive(values, 1);

    return steps;
}