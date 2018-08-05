/**
 * This is the entry point to the program
 *
 * @param {array} input Array of student objects
 */

const dateFormat = require("dateformat");

//function to get the date/age of the students
var getDate = (date = null) => {
  if (date !== null) {
    var date = new Date(date);
    var day = new Date(date).getUTCDate();
    var month = new Date(date).getUTCMonth();
    var year = new Date(date).getUTCFullYear();
    var readableDate = dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return {
      day,
      month,
      year,
      readableDate
    };
  } else {
    return {
      day: new Date().getUTCDate(),
      month: new Date().getUTCMonth(),
      year: new Date().getUTCFullYear(),
      readableDate: dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT")
    };
  }
};

function classifier(input) {
  //intializing the sorted object
  var obj = {};
  obj['noOfGroups'] = 0;

  if (input.length !== 0) {
    var studentArray = [];
    var arr = [];
    input.forEach(student => {
      var studentBirthDate = getDate(student.dob);
      var today = getDate();
      var dayDifference = today.day - studentBirthDate.day;
      var monthDifference = today.month - studentBirthDate.month;
      var age;

      age = today.year - studentBirthDate.year;

      var studentOutput = {
        name: student.name,
        age: age,
        dob: student.dob,
        regNo: student.regNo
      };

      studentArray.push(studentOutput);
    });

    studentArray.sort((a, b) => {
      return a.age - b.age;
    });

    var student = [];
    var length = studentArray.length;
    var array = [student[0]];
    var arrays = [];

    if (input.length !== 0) {

      for (i = 1; i <= length; i++) {
        var min = studentArray.reduce((acc, cur) => (acc.age <= cur.age ? acc : cur));
        student.push(min);
        studentArray.splice(studentArray.indexOf(min), 1);
      }

      var array = [student[0]];

      for (k = 1; k < student.length; k++) {
        if (Math.abs(student[k].age - array[0].age) <= 5 && array.length < 3) {
          array.push(student[k]);
        } else {
          arrays.push(array);
          array = [student[k]];
        }
      }
      arrays.push(array);

      arrays.sort((a, b) => {
        return a.dob - b.dob;
      })

      var groupName;

      obj["noOfGroups"] = arrays.length;
      var sum = 0;
      var regNos = [];

      for (var i = 0; i < arrays.length; i++) {
        groupName = "group" + (i + 1);
        obj[groupName] = {};
        obj[groupName]["members"] = arrays[i];

        for (k = 0; k < 3; k++) {
          if (arrays[i][k] !== undefined) {
            sum += arrays[i][k].age;
          }
        }

        var length = arrays[i][3];

        var oldest = arrays[i][arrays[i].length - 1].age;

        obj[groupName]["oldest"] = oldest;
        obj[groupName]["sum"] = sum;

        for (j = 0; j < 3; j++) {
          if (arrays[i][j]) {
            regNos.push(parseInt(arrays[i][j].regNo));
          }
        }

        regNos.sort((a, b) => {
          return a - b;
        })
        obj[groupName]['regNos'] = regNos;

        //clear regNos array for next student array.
        regNos = [];

        //resets the sum to 0 after calculating the sum for each array
        sum = 0;
      }
    }
  }
  return obj;
}

module.exports = classifier;
