const socket = new WebSocket("ws://localhost:8081");
const data = [];
const threshold = 50; // use this many data points to calc min and max
let width = window.innerWidth - 20;
let height = window.innerHeight - 20;
let min = 0;
let max = 0;
const toPercent = x => ((x - min) / (max - min) * 100);

socket.onmessage = result => {
  const item = JSON.parse(result.data);
  data.push(item);

  if (data.length > width) {
    data.splice(0, data.length - width);
  }

  const latest = data.filter((x, i) => i > data.length - threshold).map(x => x.ir);
  max = latest.reduce((p, c) => p > c ? p : c, 0);
  min = latest.reduce((p, c) => p < c ? p : c, max);

  const status = document.getElementById('status');
  const finger = item.ir < 10000 ? 'No Finger' : 'Finger';
  status.innerHTML = `${finger}<br>ir:${item.ir}<br>beatAvg:${item.beatAvg}<br>bpm:${item.bpm}`;
};

function setup() {
  createCanvas(width, height);
}

function windowResized() {
  width = window.innerWidth - 20;
  height = window.innerHeight - 20;
  resizeCanvas(width, height);
}

function draw() {
  const halfHeight = height / 1.2;

  clear();
  stroke(255);

  for (const i in data) {
    const last = data[i - 1];
    if (!last) continue;

    const now = data[i];
    const x = width - (data.length - i);

    line(
      x - 1,
      halfHeight - toPercent(last.ir),
      x,
      halfHeight - toPercent(now.ir)
    );
  }
}