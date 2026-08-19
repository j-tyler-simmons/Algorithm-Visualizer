const steps = [];

function recordStep(values, type, indices) {
    steps.push({
        values: [...values],
        type: type,
        indices: indices
    });
}

function selectionSortRecursive(values, start) {
    if (start >= values.length - 1) {
        return;
    }
    else {
        let minIndex = start;

        for(let i = start + 1; i < values.length; i++) {
            recordStep(values, "compare", [minIndex, i]);

            if (values[i] < values[minIndex]) {
                minIndex = i;
            }
        }
        if (minIndex !== start) {
            const temp = values[start];
            values[start] = values[minIndex];
            values[minIndex] = temp;

            recordStep(values, "swap", [start, minIndex]);
        }
        
        selectionSortRecursive(values, start + 1);
    }
}

export function selectionSort(values) {
    steps.length = 0;

    recordStep(values, "initial", []);

    selectionSortRecursive(values, 0);

    return steps;
}