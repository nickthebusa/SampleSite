function leftpaD(str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}


console.log(leftpaD('j', 9, 'u'));


function goodP(str, len, ch) {
  return new Array(len - str.length).fill(!ch && ch !== 0 ? ' ' : ch).join("") + str;
}

console.log(goodP('j', 9, 'u'));

function fasterPad(str, len, ch) {
  return (len > str.length) ? (ch ?? "").repeat(len - str.length) + str : str;
}

console.log(fasterPad('j', 9, 'u'));

