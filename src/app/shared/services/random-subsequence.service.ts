export class RandomSubsequence {
  originalSequence: any[];

  constructor(sequence: any[]) {
    this.originalSequence = sequence.map((item) => ({
      target: item,
    }));
  }

  [Symbol.iterator]() {
    let sequence = [...this.originalSequence];

    return {
      next: () => {
        if (sequence.length > 0) {
          let max = sequence.length - 1;

          let randomed = this.random(0, max);

          let randomedItem = sequence[randomed];

          sequence.splice(randomed, 1);

          return { value: randomedItem, done: false };
        }
        return { done: true };
      },
    };
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
