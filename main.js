const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let adding = false;

const width = 150
const size = 2
let grid = createGrid()

let mouseX = undefined
let mouseY = undefined

canvas.addEventListener('mousedown', touchStart)
canvas.addEventListener('touchstart', touchStart)

canvas.addEventListener('mousemove', touchMove)
canvas.addEventListener('touchmove', touchMove)

canvas.addEventListener('mouseup', touchEnd)
canvas.addEventListener('touchend', touchEnd)

canvas.addEventListener('mouseleave', touchEnd)
canvas.addEventListener('touchcancel', touchEnd)

function touchStart(e) {
  e.preventDefault()
  const clientX = e.clientX ?? e.touches[0].clientX
  const clientY = e.clientY ?? e.touches[0].clientY
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(clientX - rect.left);
  const y = Math.floor(clientY - rect.top);
  mouseX = x
  mouseY = y
  adding = true;
}

function touchMove(e) {
  e.preventDefault()
  const clientX = e.clientX ?? e.touches[0].clientX
  const clientY = e.clientY ?? e.touches[0].clientY
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(clientX - rect.left);
  const y = Math.floor(clientY - rect.top);
  mouseX = x
  mouseY = y
}

function touchEnd() {
  adding = false
}

let startTime = 0

const sandInterval = 10
let sandTimer = 0

requestAnimationFrame(loop)

function addSand(x, y) {
  const index = getIndex(x, y)
  grid[index] = 1
}

function loop(time) {
  const dt = time - startTime
  startTime = time

  sandTimer += dt
  if (sandTimer > sandInterval) {
    if (adding) {
      addSand(mouseX / 2 | 0, mouseY / 2 | 0)
    }
    update()
    sandTimer -= sandInterval
  }
  render()
  requestAnimationFrame(loop)
}

function update() {
  const newGrid = createGrid()
  for (let i = 0; i < grid.length; i += 1) {
    if (grid[i]) {
      const [x, y] = getXY(i)
      if (y >= width - 1) {
        newGrid[i] = grid[i]
        continue
      }
      const down = getIndex(x, y + 1)
      if (!grid[down]) {
        newGrid[down] = grid[i]
        newGrid[i] = 0
        continue
      }

      const leftDown = getIndex(x - 1, y + 1)
      const rightDown = getIndex(x + 1, y + 1)

      if (leftDown !== undefined && !grid[leftDown] && rightDown !== undefined && !grid[rightDown]) {
        const dir = Math.random() < 0.5 ? leftDown : rightDown
        newGrid[dir] = grid[i]
        newGrid[i] = 0
        continue
      }

      if (leftDown !== undefined && !grid[leftDown]) {
        newGrid[leftDown] = grid[i]
        newGrid[i] = 0
        continue
      }

      if (rightDown !== undefined && !grid[rightDown]) {
        newGrid[rightDown] = grid[i]
        newGrid[i] = 0
        continue
      }

      newGrid[i] = grid[i]
    }
  }
  grid = newGrid
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < grid.length; i += 1) {
    if (grid[i]) {
      ctx.fillStyle = "red"
      const [x, y] = getXY(i)
      ctx.fillRect(x * size, y * size, size, size)
    }
  }
}

function createGrid() {
  return Array(width * width).fill(0)
}

function getIndex(x, y) {
  if (x < 0 || x >= width || y < 0 || y >= width) {
    return undefined
  }
  return y * width + x
}

function getXY(i) {
  return [
    i % width,
    Math.floor(i / width)
  ]
}
