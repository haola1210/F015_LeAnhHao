const ErrorMsg = {
  CALC_LIMIT: 'The result is greater than Number.MAX_SAFE_INTEGER',
  STACK_LIMIT: 'Maximum callstack size exceeded'
}

const runWithTimeTracking = (cb) => {
  const start = performance.now();
  const result = cb()
  const end = performance.now();
  const executionTime = end - start;
  const title = cb.toString().replace('() => ', '')
  if (result !== undefined) {
    console.table({
      [title]: {
        result,
        execution_time: `${executionTime.toFixed(6)} ms`
      }
    })
  } else {
    console.log(`The execution of ${title} failed`)
  }
}

/**
 * Time complexity: O(n)
 */
const sum_to_n_a = n => {
  try {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  } catch (error) {
    console.error(ErrorMsg.CALC_LIMIT)
  }

}

/**
 * Using the Gauss Summation
 */
const sum_to_n_b = n => {
  try {
    return n * (n + 1) / 2
  } catch (error) {
    console.error(ErrorMsg.CALC_LIMIT)
  }
}

/**
 * Another way is recursion. But not recommend this approach, detail in readme
 */
const sum_to_n_c = n => {
  try {
    if (n === 0) {
      return 0;
    }

    const v = sum_to_n_c(n-1);
    if (v === undefined) return v;
    
    return n + v;
  } catch (error) {
    console.error(ErrorMsg.STACK_LIMIT)
  }
}

// run normally

// console.log(sum_to_n_a(1000))
// console.log(sum_to_n_b(1000))
// console.log(sum_to_n_c(1000))

// run with time tracking
runWithTimeTracking(() => sum_to_n_a(1000))
runWithTimeTracking(() => sum_to_n_b(1000))
runWithTimeTracking(() => sum_to_n_c(1000))