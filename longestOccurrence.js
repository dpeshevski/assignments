// 1. Longest consecutive occurence of char in stringWrite a method which takes a string and a char as input,
// and outputs the maximum length of consecutive occurrences of the char in the stringExample 
const str = 'ttaahaa79aaaaoofewijfffweioffffjweoifjweaaaaaaaaaaa';
const ch = 'a';
// function getLongestOccurence(str, ch) => returns 11;

function getLongestOccurence(str, ch) {
  let current = str[0];
  let count = 1;
  let longestOccurrence = []

  for (let i = 1; i < str.length; i++) {
    if (current == str[i]) {
      count++;
    } else {
      longestOccurrence.push({ current, count });
      count = 1;
      current = str[i];
    }
  }
  longestOccurrence.push({ current, count });

  longestOccurrence = longestOccurrence.reduce((memo, char) => {
    if (char.current === ch) {
      memo.push(char.count)
    }
    return memo;
  }, []);

  // Using filter and map
  // longestOccurrence = longestOccurrence.filter(char => char.current === ch).map(c => c.count);

  return Math.max(...longestOccurrence);
}

console.log(`Longest occurence of ${ch} is`, getLongestOccurence(str, ch));
