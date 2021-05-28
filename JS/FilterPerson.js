connectDB = function () {
  wmsUser = { useremail: "dat.nguyen@consid.vn" };
  runAppScript("query", ["SELECT Work"], "showResult");
};

function showResult(data) {
  var arr = JSON.parse(data);
  // Trả về các tên của người làm
  var arr_name = [];
  var nameContainer = document.querySelector(".nameContainer");
  for (var i = 0; i < arr.length; i++) {
    var name = arr[i].nguoilam.split(",");
    arr_name = arr_name.concat(name);
    arr_name.unshift("Chọn tên người bạn cần");
  }
  arr_name = arr_name.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  var html_select = "";
  for (var i = 0; i < arr_name.length; i++) {
    html_select = html_select + "<option>" + arr_name[i] + "</option>";
  }
  nameContainer.innerHTML = html_select;

  //Gán sự kiện onChange cho select

  nameContainer.addEventListener("change", (event) => {
    var word = event.target.value;

    var arr_work = [];
    var arr_project1 = [];
    var ul1 = document.querySelector(".peopleContainer");
    var peopleContainer = ul1.querySelector(".col-sm-8");
    var test1 = ul1.querySelector(".col-sm-4");

    var arr_check = [];
    var arr_project2 = [];
    var ul2 = document.querySelector(".supervisorContainer");
    var supervisorContainer = ul2.querySelector(".col-sm-8");
    var test2 = ul2.querySelector(".col-sm-4");

    var arr_relation = [];
    var arr_project3 = [];
    var ul3 = document.querySelector(".relationContainer");
    var relationContainer = ul3.querySelector(".col-sm-8");
    var test3 = ul3.querySelector(".col-sm-4");


    for (var i = 0; i < arr.length; i++) {
      var getWork = arr[i].tencongviec;
      var getProject = arr[i].maduan;

      var searchA = arr[i].nguoilam.includes(word);
      if (searchA === true) {
        arr_work = arr_work.concat(getWork);
        arr_project1= arr_project1.concat(getProject);
      }

      var searchB = arr[i].nguoikiem.includes(word);
      if (searchB === true) {
        arr_check = arr_check.concat(getWork);
        arr_project2= arr_project2.concat(getProject);
      }
      var searchC = arr[i].nguoilienquan.includes(word);
      if (searchC === true) {
        arr_relation = arr_relation.concat(getWork);
        arr_project3= arr_project3.concat(getProject);

      }
    }

    //Trả về công việc của người đó làm
    var html_ul = "";
    for (var i = 0; i < arr_work.length; i++) {
      html_ul +=  "<li>" + arr_work[i] + "</li>";
    }
    peopleContainer.innerHTML = html_ul;

    // Trả về công việc người đó kiểm tra
    var html_ul = "";
    for (var i = 0; i < arr_check.length; i++) {
      html_ul = html_ul + "<li>"+ arr_check[i] +"</li>";
    }
    supervisorContainer.innerHTML = html_ul;

    // Trả về công việc người đó liên quan
    var html_ul = "";
    for (var i = 0; i < arr_relation.length; i++) {
      html_ul = html_ul + "<li>" + arr_relation[i] + "</li>";
    }
    relationContainer.innerHTML = html_ul;

    // Trả về dự án của công việc người đó làm
    var html_ul = "";
    for (var i = 0; i < arr_project1.length; i++) {
      html_ul = html_ul + "<li>" + arr_project1[i] + "</li>";
    }
    test1.innerHTML = html_ul;

    // Trả về dự án của công việc người đó kiểm tra
    var html_ul = "";
    for (var i = 0; i < arr_project2.length; i++) {
      html_ul = html_ul + "<li>" + arr_project2[i] + "</li>";
    }
    test2.innerHTML = html_ul;

    // Trả về dự án của công việc người đó liên quan
    var html_ul = "";
    for (var i = 0; i < arr_project3.length; i++) {
      html_ul = html_ul + "<li>" + arr_project3[i] + "</li>";
    }
    test3.innerHTML = html_ul;

    // Loại bỏ trung nhau
    arr_work = arr_work.filter((val) => !arr_work.includes(val));
    arr_check = arr_check.filter((val) => !arr_check.includes(val));
    arr_relation = arr_relation.filter((val) => !arr_relation.includes(val));
  });
}
