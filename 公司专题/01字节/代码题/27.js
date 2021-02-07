class Scheduler {
  constructor() {
    this.max = 2;
    this.queue = [];
    this.parallel = 0;
  }
  add(promiseCreator) {
    return new Promise((resolve) => {
      this.queue.push({ creator: promiseCreator, resolve });
      this.run(resolve);
    });
  }
  run() {
    if (this.parallel >= this.max || !this.queue.length) return;
    const { creator, resolve } = this.queue.shift();
    if (creator) {
      this.parallel++;
      creator().then(() => {
        this.parallel--;
        resolve();
        this.run();
      });
    }
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(5000, "1");
addTask(2500, "2");
addTask(1000, "3");
addTask(2000, "4");
// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4
