const globalSetting = {
    'sname':'csdev',
    'scriptUrl':'https://script.google.com/a/consid.vn/macros/s/AKfycbyDUMgcxOUW4wHWPkGWFiOIogMLc70nk78FBNtQkHoW1R-T2GdtCcR6asaWMpdb1Oxp/exec',
    'googleClientId':'229685861885-b3o3ss5of8htsqvv8hi8avetd7sb84ql.apps.googleusercontent.com',
    'classroom':'https://classroom.google.com/u/3/w/NTM0MzkzMjc3ODFa/t/all',
    'contactEmail':'i@consid.vn',
    'wikiUrl':'https://wiki.consid.vn'
}

document.querySelectorAll('.contactemail').forEach(e => e.innerHTML = globalSetting.contactEmail);