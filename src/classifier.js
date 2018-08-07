/**
 * This is the entry point to the program
 *
 * @param {array} input Array of student objects
 */

function classifier(input) {
  //intializing the output object
  var output = {};

  //setting the number of groups to 0 for empty input arrays.
  output["noOfGroups"] = 0;

  if (input.length !== 0) {
    //execute this block if input array is not empty
    var studentArray = [];
    var arr = [];
    var studentBirthYear;
    var currentYear;
    var age;

    input.map(student => {
      //mutate the original array creating an object for each student
      studentBirthYear = new Date(student.dob).getUTCFullYear();
      currentYear = new Date().getUTCFullYear();

      age = currentYear - studentBirthYear;

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

    var arrays = []; //array for all students
    var allAgeArray = []; //an array for all student ages
    var regNos = []; //array for all regNos

    if (input.length !== 0) {
      var array = [studentArray[0]];
      var ageArray = [studentArray[0].age];
      var regNo = [parseInt(studentArray[0].regNo)];

      for (k = 1; k < studentArray.length; k++) {
        if (
          Math.abs(studentArray[k].age - array[0].age) <= 5 &&
          array.length < 3
        ) {
          //push the students, ages and regNos into different arrays for readability and better manipulation
          array.push(studentArray[k]);
          ageArray.push(studentArray[k].age);
          regNo.push(parseInt(studentArray[k].regNo));
        } else {
          arrays.push(array);
          allAgeArray.push(ageArray);
          regNos.push(regNo);
          array = [studentArray[k]];
          ageArray = [studentArray[k].age];
          regNo = [parseInt(studentArray[k].regNo)];
        }
      }
      arrays.push(array);
      allAgeArray.push(ageArray);
      regNos.push(regNo);

      var groupName;
      output["noOfGroups"] = arrays.length;

      ///reduce function to add the sum of items in a given array [the agesArray]
      var reducer = (a, b) => a + b;

      for (var i = 0; i < arrays.length; i++) {
        arrays.forEach(student => {
          groupName = "group" + (i + 1);

          output[groupName] = {};
          output[groupName]["members"] = arrays[i];
          output[groupName]["sum"] = 0;
          output[groupName]["sum"] += allAgeArray[i].reduce(reducer);
          output[groupName]["oldest"] = Math.max(...allAgeArray[i]);
          output[groupName]["regNos"] = regNos[i];

          //sort the regNos array
          output[groupName]["regNos"].sort((a, b) => {
            return a - b;
          });
        });
      }
    }
  }
  return output;
}

module.exports = classifier;
