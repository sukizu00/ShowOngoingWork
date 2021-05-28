var actionList = {};

actionList['updatefolder_btn:click'] = function (event, target_) {
    log('updatefolder_btn');
    event.stopPropagation();
    var target = target_ || event.target;
    var record = target.closest('li.folder-element').folderRecord;
    var folderid = record.folderid;
    var foldername = record.tenthumuc;
    var maduan = record.maduan;

    showDialog('Sửa tên thư mục!', html_updatefolderform.innerHTML.replace('name="tenthumuc"', 'name="tenthumuc" value="' + foldername + '"'), 'Sửa thư mục', function () {
        var tenthumuc = document.getElementById('dialog_show').querySelector('.cvi-folder-tenthumuc').value;
        var obj = {
            'action': 'update',
            'folderid': folderid,
            'tenthumuc': tenthumuc,
            _sheetname: 'Folder',
            relativedproject: maduan
        };
        var jsonstr = JSON.stringify(obj);

        //startRunning();
        updateExecute({data: [obj]}, true);
        runAppScript('executeCommand', [jsonstr, WMS.executeCode++], 'confirmExecute');

        WMS.dialogM.close();
    });

};

actionList['do-focus:click'] = function (event, target_) {
    event.stopPropagation();
    var target = target_ || event.target;
    var child = findDomFromByWMSStr(target, 'wms-focus');
    child.focus();
}

actionList['do-show:click'] = function (event, target_) {
    event.stopPropagation();
    var target = target_ || event.target;
    findDomFromByWMSStr(target, 'wms-show').classList.remove('hidebyclass');
}

actionList['do-hide:click'] = function (event, target_) {
    event.stopPropagation();
    var target = target_ || event.target;
    findDomFromByWMSStr(target, 'wms-hide').classList.add('hidebyclass');
}

actionList['do-edit:click'] = function (event, target_) {
    event.stopPropagation();
    var target = target_ || event.target;
    var form = findDomFromByWMSStr(target, 'wms-edit');
    form.querySelectorAll('.form_edit').forEach(e => e.classList.remove('hidebyclass'));
    form.querySelectorAll('.form_disp').forEach(e => e.classList.add('hidebyclass'));
};

actionList['do-disp:click'] = function (event, target_) {
    event.stopPropagation();
    var target = target_ || event.target;
    var form = findDomFromByWMSStr(target, 'wms-disp');
    form.querySelectorAll('.form_edit').forEach(e => e.classList.add('hidebyclass'));
    form.querySelectorAll('.form_disp').forEach(e => e.classList.remove('hidebyclass'));
};

actionList['do-expand:click'] = function (event, target_) {
    event.stopPropagation();
    var target = target_ || event.target;
    expandDiv(target);
}

actionList['do-submit:click'] = function (event, target_) {

    event.stopPropagation();
    var target = target_ || event.target;

    var doSubmit = function (event, target) {
        myLog('event', event);
        myLog('target', target);

        var form = findDomFromByWMSStr(target, 'wms-submit');

        var obligatory = form.querySelectorAll('[wms-required]');
        if (obligatory.length != 0) {
            var strthongbao = '';
            for (var el of obligatory) {
                if (el.value == '') strthongbao += el.getAttribute('wms-required');
            }
            if (strthongbao != '') {
                alert(strthongbao);
                return;
            }
        }

        updateDynamicValueByAttribute(form, 'wms-updatebeforesubmit');

        var obj = convertFormToObj(form);
        var jsonstr = JSON.stringify(obj);

        updateExecute({data: [obj]}, true);
        runAppScript('executeCommand', [jsonstr, WMS.executeCode++], 'confirmExecute');

        updateDynamicValueByAttribute(form, 'wms-updateaftersubmit');
    }

    if (target.getAttribute('wms-submitconfirm') != null) {
        var arr = target.getAttribute('wms-submitconfirm').split('|');
        showDialog(arr[0], arr[1], arr[2], function () {
            doSubmit(event, target);
        });
    } else {
        doSubmit(event, target);
    }

    return false;
}

actionList['uploadfileinput:change'] = function (event, target_) {

    if (typeof WMS.lastuploaddiv != 'undefined' && WMS.lastuploaddiv != null) {
        WMS.lastUploadRunning = WMS.lastuploaddiv.closest('.congviec_edit').querySelector('.uploadrunning');
        WMS.lastUploadRunning.classList.remove('hidebyclass');
    }

    var files = document.getElementById('uploadfileinput').files;

    var fileparam = convertFormToObj(file_form);

    for (let file of files) {
        let reader = new FileReader();
        reader.onloadend = function (e) {
            runAppScriptPost('uploadFileToGoogleDrive', [e.target.result, file.name, fileparam]);
        };
        reader.readAsDataURL(file);
    }

};

function findDomBySelector(dom, query) {
    var closest = query.split('|')[0];
    var selector = query.split('|')[1] || '';
    var parent, child;

    if (closest == '') parent = dom;
    else parent = dom.closest(closest);

    if (selector == '') child = parent;
    else child = parent.querySelector(selector);

    return child;
}

function findDomFromByWMSStr(dom, str) {
    var query = dom.getAttribute(str);
    return findDomBySelector(dom, query);
}

actionList['sangketiep:click'] = function (event, target) {
    event.stopPropagation();
    event.preventDefault();
    target = target || event.target;


    var index = icon_of.indexOf(target.textContent);
    if (index >= 3) return; // Phải trước 'Đã xong'
    index++;
    var form = findDomFromByWMSStr(target, 'wms-submit')

    form.querySelector('.cvi-work-tinhtrang').value = mean_of[index];
    target.textContent = icon_of[index];

    return false;
};

actionList['sangketiep:mousehold'] = function (event, target_) {
    event.stopPropagation();
    event.preventDefault();
    target = target_ || event.target;

    var index = icon_of.indexOf(target.textContent);
    if (index >= 3) return; // Phải trước 'Đã xong'
    index = 3;
    var form = findDomFromByWMSStr(target, 'wms-submit')
    form.querySelector('.cvi-work-tinhtrang').value = mean_of[index];
    target.textContent = icon_of[index];

    return false;
}

actionList['fileupload_dropper:dragover'] = function (event, target_) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    //setTimeout(function(){event.target.classList.remove('drop-suggest');}, 100);
};

actionList['fileupload_dropper:dragleave'] = function (event, target_) {
    event.stopPropagation();
    event.preventDefault();
    event.target.classList.remove('drop-suggest');
};


actionList['fileupload_dropper:dragenter'] = function (event, target_) {
    event.stopPropagation();
    event.preventDefault();
    event.target.classList.add('drop-suggest');

};

actionList['fileupload_dropper:drop'] = function (event, target_) {
    event.stopPropagation();
    event.preventDefault();
    updateInfoDomUpload(event.target);
    file_element.files = event.dataTransfer.files;
    actionList['uploadfileinput:change'](event);
};

actionList['attach_file:click'] = function (event, target_) {
    log('fileupload_dropper');
    updateInfoDomUpload(event.target);
    file_element.click();
};

actionList['btn_trasoat:click'] = function (event, target_) {
    let jsonstr = JSON.stringify({action: 'trasoat', _isnotexecute: true, _sheetname: 'System', relatedusers: '*'})
    runAppScript('executeCommand', [jsonstr, WMS.executeCode++], 'confirmExecute');
    startRunning();
};

actionList['pasteimage:click'] = function (event, target_) {
    log('pasteimage');
    event.stopPropagation();
};

actionList['pasteimage:paste'] = function (event, target_) {
    log('pasteimage');
    //https://ourcodeworld.com/articles/read/491/how-to-retrieve-images-from-the-clipboard-with-javascript-in-the-browser
    if (event.clipboardData == false) return false;
    var items = event.clipboardData.items;

    if (items == undefined) return false;

    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") == -1) continue;
        var blob = items[i].getAsFile();

        updateInfoDomUpload(event.target);

        WMS.lastUploadRunning = WMS.lastuploaddiv.closest('.congviec_edit').querySelector('.uploadrunning');
        WMS.lastUploadRunning.classList.remove('hidebyclass');

        var fileparam = {
            workid: WMS.uploadworkid,
            relatedusers: WMS.uploadusers,
            relatedproject: WMS.uploadmaduan
        }

        var reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            var data = reader.result;
            var fileext = data.split(';')[0].split('/')[1];
            runAppScriptPost('uploadFileToGoogleDrive', [data, WMS.userData.username + '-img-' + (Math.round(Math.random() * 9000) + 999) + '.' + fileext, fileparam]);
        }
    }

};

actionList['sidetab:click'] = function (event, target_) {
    log('sidetab');
    var current = event.target;
    event.preventDefault();
    var id = current.id;
    var pagename = id.split('_')[0];

    document.querySelectorAll('.pageview').forEach(e => e.classList.add('hidebyclass'));
    document.getElementById('' + pagename + '_page').classList.remove('hidebyclass');
    document.querySelectorAll('.sidetab').forEach(e => e.classList.remove('sidetabselected'));
    current.classList.add('sidetabselected');

    if (pagename == 'ailamgi') showPage('ailamgi');

};

function updateProjectInfo(jsonstr) {
    //myLog(jsonstr);
    stopRunning();

    var objs = JSON.parse(jsonstr);
    if (objs.length > 0) insertProjectDom(objs[0]);
    else alert('Không có thông tin về dự án được yêu cầu');
}

actionList['thempanelduan:click'] = function (event, target_) {
    var e = event.target.closest('.formthempanelduan').querySelector('select');
    var o = e.options[e.selectedIndex];
    var obj = {
        'maduan': o.value,
        'tenduan': o.text || '[' + o.value + ']'
    };
    showModule('work');
    startRunning();
    runAppScript('query', ['SELECT Project WHERE maduan=="' + o.value + '"'], 'updateProjectInfo');

};

actionList['worktitle:dragover'] = actionList['foldertitle:dragover'] = function (event, target_) {
    console.log('dragover');

    event.stopPropagation();
    event.preventDefault();
    var target = target_ || event.target;

    // nếu dragover đối tượng collection rỗng, thì thả vào
    if ((target.matches('ul.folder-' + WMS.dragType + '-collection') || target.matches('ul.project-' + WMS.dragType + '-collection')) &&
        target.querySelector(WMS.dragSelector) == null
    ) {
        target.appendChild(WMS.dragNode);
        return;
    }

    // Nếu dragover một đối tượng giống như bản thân, thì nhét vào
    if (!target.matches(WMS.dragSelector)) target = target.closest(WMS.dragSelector);
    if (target == null) return;

    console.log('dragover 1');

    var domRect = target.getBoundingClientRect();
    if (event.clientY < (domRect.top + (domRect.height / 2))) target.parentNode.insertBefore(WMS.dragNode, target);
    else target.parentNode.insertBefore(WMS.dragNode, target.nextSibling);
    console.log('dragover 2');
}

actionList['worktitle:dragstart'] = actionList['foldertitle:dragstart'] = function (event) {
    console.log('dragstart');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', null);

    //WMS.dragNode = document.getElementById('drag_dummy');
    //WMS.dragNode.classList.remove('hidebyclass');
    //WMS.dragParentNode = event.target.parentNode;
    //WMS.dragParentNode.insertBefore(WMS.dragNode, event.target);

    WMS.dragNode = event.target;
    WMS.dragParentNode = WMS.dragNode.parentNode;

    WMS.dragType = event.target.id.split('-')[0];

    WMS.dragNodeIndex = Array.from(WMS.dragParentNode.children).indexOf(WMS.dragNode);
    WMS.dragSelector = 'li[wms-action="' + event.target.getAttribute('wms-action') + '"]';
    console.log('WMS.dragSelector', WMS.dragSelector)
    setTimeout(function () {
        WMS.dragNode.querySelector('.collapsible-header').classList.add('dragnode');
    }, 10);
}

actionList['worktitle:dragend'] = actionList['foldertitle:dragend'] = function (event) {
    console.log('dragend');
    WMS.dragNode.querySelector('.collapsible-header').classList.remove('dragnode');

    // Vẫn ở vị trí cũ thì thoát
    if (WMS.dragNodeIndex == Array.from(WMS.dragParentNode.children).indexOf(WMS.dragNode)) {
        //myLog('Không thay đổi vị trí');
        return;
    }

    var objs = [];
    var maduan, parentid, parent_type;

    var work_folder = event.target.getAttribute('wms-action').replace('title', ''); // worktitle => work | foldertitle => folder
    var sheetname = work_folder.charAt(0).toUpperCase() + work_folder.slice(1);
    // Nếu drag sang thư mục khác hoặc dự án khác thì phải cập nhật các nội dung maduan, parentid, parent_type
    if (!WMS.dragParentNode.isSameNode(event.target.parentNode)) {
        var directParent;
        var currentObj = event.target[work_folder + 'Record'];

        directParent = event.target.closest('li.folder-element');
        // Nằm trong thư mục
        if (directParent != null) {
            maduan = directParent.folderRecord.maduan;
            parentid = directParent.folderRecord.folderid;
            parent_type = 'folder';
        } else {
            directParent = event.target.closest('li.project-element');
            maduan = directParent.projectRecord.maduan;
            parentid = directParent.projectRecord.projectid;
            parent_type = 'project';
        }

        Object.assign(currentObj, {maduan: maduan, parentid: parentid, parent_type: parent_type});

        updateObjectValuesToDom(currentObj, event.target);
        currentObj.action = 'update';
        currentObj._sheetname = sheetname;
        objs.push(currentObj);
    }

    var children = Array.from(event.target.parentNode.querySelectorAll('li[wms-action="' + work_folder + 'title"]'))
        .filter(v => v.parentNode.isSameNode(event.target.parentNode));

    // Update orderinparent lên hệ thống
    var childrenOfParent = [];
    var maduan = WMS.dragParentNode.closest('li').projectRecord.maduan;
    children.forEach((e, i) => {
        var obj = {};
        var id = obj[work_folder + 'id'] = e[work_folder + 'Record'][work_folder + 'id'];
        obj.orderinparent = (i + 1);
        obj.action = 'update';
        obj._sheetname = sheetname;
        obj.relatedproject = maduan;
        obj.relatedusers = '*';
        objs.push(obj);
        childrenOfParent.push(((work_folder == 'work') ? 'cvid_' : 'fdid_') + id);
    });

    // Nếu là con của Project, thì gửi lệnh reorder project, nếu là con của folder thì gửi lệnh reorder folder
    if (WMS.dragParentNode.classList.contains('project_collection')) {
        objs.push({
            action: 'reorder',
            _sheetname: 'Project',
            maduan: maduan,
            orderedchildren: childrenOfParent.join(',')
        });
    } else {
        var folderid = WMS.dragParentNode.closest('li').folderRecord.folderid;
        objs.push({
            action: 'reorder',
            _sheetname: 'Folder',
            folderid: folderid,
            orderedchildren: childrenOfParent.join(',')
        });
    }

    var jsonstr = JSON.stringify(objs);
    //updateExecute({data:objs},true); // Không cần reorder trực tiếp vì thực tế đã reorder
    runAppScript('executeCommand', [jsonstr, WMS.executeCode++], 'confirmExecute');
}

actionList['headercheckbox:change'] = function (event, target_) {
    var target = event.target;
    target.closest('li').draggable = target.checked;
}

var hintMsg = {
    'sangketiep': 'Click vào đây để chuyển công việc sang bước tiếp theo. Click và giữ để đánh dấu hoàn tất. Ý nghĩa: <i class="material-icons">assignment</i> - Chưa làm | <i class="material-icons">assignment_ind</i> - Đang làm | <i class="material-icons">assignment_late</i> - Chờ kiểm | <i class="material-icons">assignment_turned_in</i> - Đã xong ',
    'tieudecongviec': 'Tên công việc, click vào đây để xem / ẩn chi tiết',
    'card_new_btn': 'Click vào đây để tạo công việc mới',
    'cvi_tencongviec': 'Nhập tên công việc vào đây',
    'ava_nguoilam': 'Vòng tròn màu đỏ: Người làm',
    'ava_nguoikiem': 'Vòng tròn màu vàng: Người kiểm',
    'nguoilam': 'Người làm',
    'nguoikiem': 'Người kiểm',
    'ghichu': 'Công việc này có ghi chú',
    'filedinhkem': 'Công việc có file đính kèm',
    'thoigiancuoi': 'Thời gian cuối hiệu chỉnh công việc',
    'iconquantrong': 'Ngôi sao thể hiện đây là công việc quan trọng',
    'tieudeduan': 'Tiêu đề dự án, click vào đây để đóng mở panel dự án',
    'createsubfolder_project_btn': 'Click vào đây để tạo thư mục mới trong dự án',
    'updateproject_btn': 'Click vào đây để hiệu chỉnh tên dự án',
    'form_edit_btn': 'Click vào đây để hiệu chỉnh công việc',
    'card_delete_btn': 'Click vào đây để xóa công việc hiện hành',
    'tenthumuc': 'Tên thư mục, click vào đây để đóng mở panel thư mục',
    'createsubfolder_btn': 'Tạo thư mục con mới',
    'deletefolder_btn': 'xóa thư mục',
    'updatefolder_btn': 'Hiệu chỉnh thư mục',
    'danhdauquantrong': 'Click vào đây để đánh dấu công việc quan trọng',
    'nhaphanchot': 'Click vào để nhập hạn chót',
    'nhapnguoilienquan': 'Click vào để chọn người liên quan',
    'nhapnguoikiem': 'Click vào để chọn người kiểm',
    'nhapnguoilam': 'Click vào để chọn người làm',
    'ct_tencongviec': 'Chi tiết tên công việc',
    'ct_ghichu': 'Chi tiết ghi chú',
    'ct_nguoilam': 'Chi tiết người làm',
    'ct_nguoikiem': 'Chi tiết người kiểm',
    'ct_nguoilienquan': 'Chi tiết người liên quan',
    'ct_tinhtrang': 'Chi tiết tình trạng',
    'ct_hanchot': 'Chi tiết hạn chót',
    'ct_quantrong': 'Chi tiết độ quan trọng',
    'card_save_btn': 'Click vào đây để lưu hiệu chỉnh',
    'card_cancel_btn': 'Click vào đây để hủy, không lưu các hiệu chỉnh'

}

var xulyEvent = function (event, eventype) {
    //if (event.type.substring(0,5) != 'mouse') {  myLog(event);  }

    if (event.type == 'click') {
        let path = event.path || (event.composedPath && event.composedPath());
        var projectDom = path.filter(e => (e.nodeType == 1 && e.matches('li.project-element')))[0];
        if (typeof projectDom != 'undefined') renderFormSelect(projectDom, 'project');

        var folderDom = path.filter(e => (e.nodeType == 1 && e.matches('li.folder-element')))[0];
        if (typeof folderDom != 'undefined') renderFormSelect(folderDom, 'folder');

        var workDom = path.filter(e => (e.nodeType == 1 && e.matches('li.work-element')))[0];
        if (typeof workDom != 'undefined') renderFormSelect(workDom, 'work');

        //myLog(event.target);
        //myLog(path);
    }

    eventype = eventype || event.type;
    var target = event.target;

    if (eventype == 'keyup') {
        if ((event.keyCode === 13) && target.tagName == "INPUT") {
            event.preventDefault();
            (target.closest('form') || target.closest('.form-alter'))?.querySelector('[wms-submit]')?.click?.();
        }
        return;
    }

    var newtarget = null;
    var actionname = target.getAttribute('wms-action');
    if (actionname == null) {
        newtarget = target.closest('[wms-action]');
        if (newtarget == null) return;
        actionname = newtarget.getAttribute('wms-action');
        //if (actionname == null) return;
    }

    // Mouse click, drag ...
    for (var actionname1 of actionname.split(';')) {
        var findstr = actionname1 + ':' + eventype;
        if (typeof actionList[findstr] != 'undefined') {
            actionList[findstr](event, newtarget);
        }
    }

    if (event.nodeName == 'INPUT' || event.nodeName == 'SELECT') {
        var fieldstr = target.getAttribute('wms-field');
        if (fieldstr != null && ((event.type == 'INPUT' && eventype == 'focusout') || (event.type == 'SELECT' && eventype == 'change'))) {
            let action = fieldstr.split(':')[0];
            let sheet = fieldstr.split(':')[1].split('/')[0];
            let fieldname = fieldstr.split(':')[1].split('/')[1];
            let selector = (sheet == 'Work') ? 'li.work-element' : (sheet == 'Folder') ? 'li.folder-element' : 'li.project-element';

            var li = target.closest(selector);
            if (li != null) {
                let workRecord = li.workRecord;
                let value = (event.nodeName == 'INPUT') ? value = target.value : M.FormSelect.getInstance(target).getSelectedValues();
                workRecord[action][fieldname] = value;
            } else {
                myLog('Error li null')
            }
        }
    }
};

var showHint = function (event, eventype) {

    eventype = eventype || event.type;
    var target = event.target;

    var newtarget = null;
    var actionname = target.getAttribute('wms-hint');
    if (actionname == null) {
        newtarget = target.closest('[wms-hint]');
        if (newtarget == null) return;
        actionname = newtarget.getAttribute('wms-hint');
    }

    // Mouse hover
    if (eventype == 'mouseout') {
        WMS.$statusPanel.innerHTML = '';
        WMS.lastHintKey = '';
        return;
    }

    if (eventype == 'mouseover') {
        var msg = target.getAttribute('wms-hint');
        if (typeof msg != null) {
            WMS.$statusPanel.innerHTML = msg;
            WMS.lastHintKey = msg;
        }

    }

};

for (var evtype of ['click', 'change', 'focusout', 'dragover', 'dragenter', 'dragstart', 'dragend', 'drop', 'keyup', 'paste']) {
    document.addEventListener(evtype, window.xulyEvent, true);
}

for (var evtype of ['mouseover', 'mouseout']) {
    document.addEventListener(evtype, window.showHint, true);
}


document.addEventListener('mousedown', function (event, target_) {
    window.tId = setTimeout(function () {
        window.xulyEvent(event, 'mousehold');
    }, 1000);
}, true);
for (let tp of ['mouseup', 'mouseleave']) document.addEventListener(tp, function () {
    if (typeof window.tId != 'undefined') clearTimeout(window.tId);
}, true);
