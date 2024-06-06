const canvas = document.getElementById('tacticalBoard');
const ctx = canvas.getContext('2d');

// グリッド線を描画する関数
function drawGrid() {
    const gridSize = 20; // グリッドのサイズ
    ctx.strokeStyle = "#ddd"; // 線の色

    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// コートを描画する関数
function drawCourt() {
    ctx.fillStyle = 'lightgreen'; // 背景色を薄い黄緑に
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // コートの白線
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // コートの境界線
    ctx.strokeRect(20, 20, 960, 560);

    // ハーフコートライン
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 20);
    ctx.lineTo(canvas.width / 2, 580);
    ctx.stroke();
    
    // キーパーゾーン1
    ctx.beginPath();
    ctx.moveTo(300, 20);
    ctx.lineTo(300, 580);
    ctx.stroke();

    // キーパーゾーン2
    ctx.beginPath();
    ctx.moveTo(700, 20);
    ctx.lineTo(700, 580);
    ctx.stroke();

    // センターサークル
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // ベンチエリア
    ctx.strokeRect(50, 580, 200, 30);
    ctx.strokeRect(750, 580, 200, 30);

    // クィディッチゴール
    const goalPositions = [
        { x: 160, y: 150 },
        { x: 160, y: 300 },
        { x: 160, y: 450 },
        { x: 840, y: 150 },
        { x: 840, y: 300 },
        { x: 840, y: 450 }
    ];

    ctx.strokeStyle = 'yellow';
    goalPositions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.stroke();
    });
}

// 選手を描画する関数
function drawPlayer(x, y, color, direction) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20 * Math.cos(direction), y + 20 * Math.sin(direction));
    ctx.lineTo(x + 20 * Math.cos(direction + Math.PI / 2), y + 20 * Math.sin(direction + Math.PI / 2));
    ctx.lineTo(x + 20 * Math.cos(direction - Math.PI / 2), y + 20 * Math.sin(direction - Math.PI / 2));
    ctx.closePath();
    ctx.fill();
}

// チームの選手を描画する関数
function drawTeam(players) {
    players.forEach(player => {
        drawPlayer(player.x, player.y, player.color, player.direction);
    });
}

// ボールを描画する関数
function drawBall(x, y, type) {
    ctx.fillStyle = type === 'volleyball' ? 'silver' : type === 'dodgeball' ? 'brown' : 'gold';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
}

// 初期位置の選手データ
const team1 = [
    { x: 210, y: 150, color: 'white', direction: Math.PI / 1.35 },
    { x: 210, y: 300, color: 'white', direction: Math.PI / 1.35 },
    { x: 210, y: 450, color: 'white', direction: Math.PI / 1.35 },
    { x: 290, y: 350, color: 'green', direction: Math.PI / 1.35 },
    { x: 170, y: 200, color: 'black', direction: Math.PI / 1.35 },
    { x: 170, y: 400, color: 'black', direction: Math.PI / 1.35 },
    { x: 480, y: 580, color: 'orange', direction: Math.PI / 1.35 }
];

const team2 = [
    { x: 790, y: 150, color: 'white', direction: -Math.PI / 4 },
    { x: 790, y: 300, color: 'white', direction: -Math.PI / 4 },
    { x: 790, y: 450, color: 'white', direction: -Math.PI / 4 },
    { x: 700, y: 350, color: 'green', direction: -Math.PI / 4 },
    { x: 840, y: 200, color: 'black', direction: -Math.PI / 4 },
    { x: 840, y: 400, color: 'black', direction: -Math.PI / 4 },
    { x: 520, y: 580, color: 'orange', direction: -Math.PI / 4 }
];

// ボールのデータ
const balls = [
    { x: 300, y: 360, type: 'volleyball' }, // バレーボール
    { x: 200, y: 200, type: 'dodgeball' },  // ドッジボール
    { x: 200, y: 400, type: 'dodgeball' },  // ドッジボール
    { x: 800, y: 200, type: 'dodgeball' },  // ドッジボール
    { x: 500, y: 580, type: 'snitch' }      // スニッチ
];

// 初期描画
drawGrid();
drawCourt();
drawTeam(team1);
drawTeam(team2);
balls.forEach(ball => drawBall(ball.x, ball.y, ball.type));


// インタラクティブ
let dragging = false;
let dragStart = { x: 0, y: 0 };
let draggedItem = null;

// プレイヤーまたはボールの検出関数
function detectItem(x, y, items) {
    return items.find(item => Math.hypot(x - item.x, y - item.y) < 15);
}

// マウスダウンイベント
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    draggedItem = detectItem(mouseX, mouseY, team1) || detectItem(mouseX, mouseY, team2) || detectItem(mouseX, mouseY, balls);

    if (draggedItem) {
        dragging = true;
        dragStart = { x: mouseX - draggedItem.x, y: mouseY - draggedItem.y };
    }
});

// マウスムーブイベント
canvas.addEventListener('mousemove', (e) => {
    if (dragging && draggedItem) {
        const rect = canvas.getBoundingClientRect();
        draggedItem.x = e.clientX - rect.left - dragStart.x;
        draggedItem.y = e.clientY - rect.top - dragStart.y;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
        drawGrid();
        drawCourt();
        drawTeam(team1);
        drawTeam(team2);
        balls.forEach(ball => drawBall(ball.x, ball.y, ball.type));
    }
});

// マウスアップイベント
canvas.addEventListener('mouseup', () => {
    dragging = false;
    draggedItem = null;
});
