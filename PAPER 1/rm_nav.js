const fs = require('fs');

function removeLink(file, hrefPattern) {
    let c = fs.readFileSync(file, 'utf8');
    const regex = new RegExp(`<a href="${hrefPattern}".*?<\/a>\\s*`, 'gs');
    c = c.replace(regex, '');
    fs.writeFileSync(file, c, 'utf8');
}

removeLink('quiz.html', 'quiz\\.html');
removeLink('material.html', 'quiz\\.html');
removeLink('material.html', 'material\\.html');

console.log('Removed specific nav links');
