var wmsUser = wmsUser || {};

function runAppScript(fname, args, callback, important = false){  

  if (!navigator.onLine) {
    setTimeout(function(){runAppScript(fname, args, callback, important);}, 5000);
    return;
  }

  var email = wmsUser.useremail;
  if (typeof email == 'undefined') return;  // 
  var strargs = JSON.stringify(args);
  var filename = encodeURI(globalSetting.scriptUrl + '?sname='+globalSetting.sname+'&sessionid='+WMS.sessionid+'&sessionhash='+WMS.sessionhash+'&fname='+fname+'&args='+ strargs +'&callback='+callback);
  var fileref=document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);

  //localStorage.setItem('cwm-' + WMS.executeCode, strargs);

  fileref.onerror = function() {
    var thongbao = document.getElementById('thongbao');
    thongbao.innerText = 'Lỗi khi kết nối với máy chủ !';
    thongbao.classList.remove('hidebyclass');

    document.getElementById('maincontent').querySelector('.progress').classList.add('hidebyclass');
    document.getElementById('hoatdong').classList.remove('indeterminate');
    console.log('error');
  };

  if (typeof fileref!="undefined") {
    try{
      document.getElementsByTagName("head")[0].appendChild(fileref);
    } catch (e) {
      myLog(e);
      // Nếu bị lỗi, thì sẽ chạy cái quan trọng lại 1 lần nữa.
      if (important) setTimeout(function(){runAppScript(fname, args, callback, important);}, 1000);
    }
  }
  else myLog('Error while load' + fname + ' - ');
  
}


window.addEventListener('load', function() {
  var status = document.getElementById("thongbao");
  function updateOnlineStatus(event) {
    var thongbao = (navigator.onLine)?'': 'Không có kết nối internet!'
    document.getElementById('thongbao').innerText = thongbao;
  }
  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

// uploadFileToGoogleDrive
function runAppScriptPost(fname, args){
  document.getElementById('iframeMakePost').onload = function(){
    runAppScript('getExecuteData',[WMS.lastExecuteIndex],'updateExecute');
  }
  var form = document.getElementById("formMakePost");
  form.action = globalSetting.scriptUrl;
  form.querySelector('[name="fname"]').value = fname;
  form.querySelector('[name="args"]').value = JSON.stringify(args);
  form.querySelector('[name="email"]').value = wmsUser.useremail;
  form.querySelector('[name="sname"]').value = globalSetting.sname;
  form.querySelector('[name="sessionhash"]').value = WMS.sessionhash;
  form.querySelector('[name="sessionid"]').value = WMS.sessionid;
  form.submit();
}

function showError(strobj){
  var obj = JSON.parse(strobj);
  alert(obj.errormessage);
}

window.WMS = window.WMS || {}; 