export default class Utils {
  static concatAll = (arr) => {
    var results = [];
    arr.forEach(function (subArray) {
      if (Array.isArray(subArray))
        subArray.forEach((item) => results.push(item))
      else
        throw new Error('Its not two dimensional array;');
    });
    return results;
  }
}
