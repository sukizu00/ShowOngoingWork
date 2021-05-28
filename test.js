const li_template =
  '<li><div class="row"><div class="col-sm-8">$(tencongviec)</div><div class="col-sm-4">$(maduan)</div></div></li>';
var replacer = function (tpl, data) {
  var re = /\$\(([^\)]+)?\)/g,
    match;
  while ((match = re.exec(tpl))) {
    tpl = tpl.replace(match[0], data[match[1]]);
    re.lastIndex = 0;
  }
  return tpl;
};

connectDB = function () {
  wmsUser = { useremail: "dat.nguyen@consid.vn" };
  runAppScript("query", ["SELECT Work "], "showResult");
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
    wmsUser = { useremail: "dat.nguyen@consid.vn" };
    runAppScript(
      "query",
      ["SELECT Work WHERE nguoilam.includes('" + word + "')"],
      "showPeople"
    );

    wmsUser = { useremail: "dat.nguyen@consid.vn" };
    runAppScript(
      "query",
      ["SELECT Work WHERE nguoikiem.includes('" + word + "')"],
      "showSupervisor"
    );

    wmsUser = { useremail: "dat.nguyen@consid.vn" };
    runAppScript(
      "query",
      ["SELECT Work WHERE nguoilienquan.includes('" + word + "')"],
      "showRelation"
    );
  });

  showPeople = (data) => {
    var abc = JSON.parse(data);
    html_ul = ''
    var peopleContainer = document.querySelector(".peopleContainer");
    for (var i = 0; i < abc.length; i++) {
      html_ul += replacer(li_template, abc[i]);
    }
    peopleContainer.innerHTML = html_ul;
  };

  showSupervisor = (data) => {
    var abc = JSON.parse(data);
    html_ul = ''
    var supervisorContainer = document.querySelector(".supervisorContainer");
    for (var i = 0; i < abc.length; i++) {
      html_ul += replacer(li_template, abc[i]);
    }
    supervisorContainer.innerHTML = html_ul;
  };

  showRelation = (data) => {
    var abc = JSON.parse(data);
    html_ul = ''
    var relationContainer = document.querySelector(".relationContainer");
    for (var i = 0; i < abc.length; i++) {
      html_ul += replacer(li_template, abc[i]);
    }
    relationContainer.innerHTML = html_ul;
  };
}
