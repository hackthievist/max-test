/**
 * This is the entry point to the program
 *
 * @param {array} input Array of student objects
 */

const dateFormat = require("dateformat");
const arraySort = require("array-sort");
const express = require("express");
const util = require("util");

function classifier(input) {

  var obj = {};
  obj['noOfGroups'] = 0;
  if (input.length !== 0) {

    var getDate = (date = null) => {
      if (date !== null) {
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

    var studentArray = [];
    var arr = [];
    input.forEach(student => {
      var studentBirthDate = getDate(student.dob);
      var today = getDate();
      var dayDifference = today.day - studentBirthDate.day;
      var monthDifference = today.month - studentBirthDate.month;
      var age;

      if (monthDifference >= 0) {
        age = today.year - studentBirthDate.year;
      } else {
        age = today.year - studentBirthDate.year - 1;
      }

      var studentOutput = {
        name: student.name,
        age: age,
        dob: student.dob,
        regNo: student.regNo
      };

      studentArray.push(studentOutput);
    });

    arraySort(studentArray, "age"); //sorted student array

    var obj = {};
    var student = [];
    var length = studentArray.length;
    var array = [student[0]];
    var arrays = [];

    if (input.length !== 0) {

      for (i = 1; i <= length; i++) {
        var min = studentArray.reduce((acc, cur) => (acc.age < cur.age ? acc : cur));
        student.push(min);
        studentArray.splice(studentArray.indexOf(min), 1);
      }

      var array = [student[0]];

      for (k = 1; k < student.length; k++) {
        if (student[k].age - array[0].age <= 5 && array.length < 3) {
          array.push(student[k]);
        } else {
          arrays.push(array);
          array = [student[k]];
        }
      }

      var groupName;

      obj["noOfGroups"] = arrays.length;
      var sum = 0;
      var regNos = [];

      for (var i = 0; i < arrays.length; i++) {
        groupName = "group" + (i + 1);
        obj[groupName] = {};
        obj[groupName]["members"] = arrays[i];
        sum += arrays[i][0].age;
        var length = arrays[i][3];
        if (arrays[i][1] !== undefined) {
          sum += arrays[i][1].age;
        }
        if (arrays[i][2] !== undefined) {
          sum += arrays[i][2].age;
        }
        var oldest = arrays[i][arrays[i].length - 1].age;

        obj[groupName]["oldest"] = oldest;
        obj[groupName]["sum"] = sum;
        //regNos = arrays[i][0].regNo, arrays[i][1].regNo, arrays[i][2].regNo;
        if (arrays[i][0]) {
          regNos.push(arrays[i][0].regNo);
        }

        if (arrays[i][1]) {
          regNos.push(arrays[i][1].regNo);
        }

        if (arrays[i][2]) {
          regNos.push(arrays[i][2].regNo);
        }

        obj[groupName]['regNos'] = regNos;


        regNos = [];

        sum = 0;
        return obj;
      }
    } else {
      obj['noOfGroups'] = 0;
    }
  }
  return obj;
}

module.exports = classifier;
