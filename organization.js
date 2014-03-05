module.exports = function buildTree (arr) {
  var mafiaTuple = findMember(arr, 0, 'boss');
  return buildTreeAccumulator(mafiaTuple[1], mafiaTuple[0]);
};

function buildTreeAccumulator (mafiaArr, member) {
  if (member.crew.length) {
    for (var i = 0; i < member.crew.length; i++) {
      var memberID    = member.crew[i]
        , memberTuple = findMember(mafiaArr, memberID, 'id');
      member.crew[i] = buildTreeAccumulator(memberTuple[1], memberTuple[0]);
    }
  }
  else {
    return member;
  }
  return member;
}

function findMember (arr, val, attr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][attr] === val) {
      var member = arr.slice(i, i + 1)[0];
      return [member, arr];
    }
  }
  return console.error('NO BIG BOSS FOUND');
}
