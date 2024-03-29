﻿var ar, elAr, iters, endAr, clicks;
var colors = ['white', '#0080AA', '#A0AA00', '#C8C8FA', '#F03232'];
var containW = 500;
t.style.setProperty('width', containW+'px');
function getClick(x, y) {
    return function () { update(x, y) };
}
function initTable(ww, hh, variations) {
    iters = variations;
    ar = [];
    elAr = [];
    clicks = [];
    endAr = [ww, hh, variations];
    while (t.childNodes.length > 0) {
        t.removeChild(t.childNodes[0]);
    }
    while (colorsDisplay.childNodes.length > 0) {
        colorsDisplay.removeChild(colorsDisplay.childNodes[0]);
    }
    for (var col = 0; col < hh; ++col) {
        var tr = document.createElement('div');
        t.appendChild(tr);
        ar.push([]);
        elAr.push([]);
        clicks.push([]);
        for (var row = 0; row < ww; ++row) {
            var cell = document.createElement('cell');
            cell.addEventListener('click', getClick(col, row));
            tr.appendChild(cell);
            ar[col].push(0);
            elAr[col].push(cell);
            clicks[col].push(0);
        }
    }
    t.style.setProperty('height', (containW / ww * hh)+'px');
}

function updateEl(x, y) {
    elAr[x][y].style.setProperty('background-color', colors[ar[x][y]]);
}
function updateVal(x, y) {
    ar[x][y] += 1;
    ar[x][y] %= iters;
}
function updateCell(x, y) {
    if (elAr[x] && elAr[x][y]) {
        updateVal(x, y);
        updateEl(x, y);
    }
}
function update(x, y) {
    clicks[x][y] += 1;
    clicks[x][y] %= iters;

    updateCell(x, y);
    updateCell(x + 1, y);
    updateCell(x - 1, y);
    updateCell(x, y + 1);
    updateCell(x, y - 1);
}
newT.addEventListener('click', function () {
    ask(['level width', 'level height', 'number of colors (2-5)'], function (answers) {
        initTable(parseInt(answers[0]), parseInt(answers[1]), parseInt(answers[2]));
    })
})
function getRes() {
    var off = [];
    for (var i = 0; i < clicks.length; ++i) {
        for (var j = 0; j < clicks[i].length; ++j) {
            if (clicks[i][j] > 0) off.push(i, j, clicks[i][j]);
        }
    };
    return 'custom level.'+endAr[0] + '.' + endAr[1] + '.' + endAr[2] + '.' + (off.join('.'))
}
printR.addEventListener('click', function () {
    
    result.textContent = getRes();
})
play.addEventListener('click', function () {
    window.location.replace('index.html#' + getRes());
})
initTable(5, 5, 5);
//avoid prompt
function ask(questions, onsubmit) {
    var asker = document.createElement('asker');
    for (var i = 0; i < questions.length; ++i) {
        var p = document.createElement('p');
        p.innerHTML = questions[i] + '<br><input id=asker' + i + ' class=question>';
        asker.appendChild(p);
    }
    var p = document.createElement('p');
    p.innerHTML = '<input type=button id=submit value=SUBMIT>';
    asker.appendChild(p);
    document.body.appendChild(asker);
    submit.addEventListener('click', function () {
        var answers = [];
        for (var i = 0; i < questions.length; ++i) {
            answers.push(document.getElementById('asker' + i).value);
        }
        onsubmit(answers);
        document.body.removeChild(asker);
    })
}