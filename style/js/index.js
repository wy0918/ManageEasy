layui.use(['element', 'form', 'table', 'layer'], function () {
    var element = layui.element;
    var form = layui.form;
    var table = layui.table;
    var $ = layui.jquery, layer = layui.layer;
    // var s_userinfo2 = localStorage.getItem("p_userinfo");
    // var p_userinfo2 = JSON.parse(s_userinfo2);
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));

    $("#userName").html(userinfo.uName); //设置右上角的用户名
    getCharOptions();
    getPTypeOptions();
    getNtfTypeOptions();
    getDepOptions();
    getMajorOptions();
    getPLevelOptions();
    //设置对应角色所对应的菜单
    if (userinfo.cId == 1) {
        for (let i = 1; i <= 4; i++) {
            $("#teacher_right" + i).hide();
        }
        for (let i = 1; i <= 2; i++) {
            $("#expert_right" + i).hide();
        }
    } else if (userinfo.cId == 2) {
        for (let i = 1; i <= 6; i++) {
            $("#admin_right" + i).hide();
        }
        for (let i = 1; i <= 2; i++) {
            $("#expert_right" + i).hide();
        }
    } else if (userinfo.cId == 3) {
        for (let i = 1; i <= 6; i++) {
            $("#admin_right" + i).hide();
        }
        for (let i = 1; i <= 4; i++) {
            $("#teacher_right" + i).hide();
        }
    }

    $("#logout").click(function () {
        var settings = {
            "url": "http://localhost:8006/user/logout",
            "method": "GET",
            "timeout": 0,
            "xhrFields": { withCredentials: true },
        };

        $.ajax(settings).done(function (response) {
            if (response == '成功') {
                //退出成功的提示与跳转
                layer.msg('退出成功', {
                    offset: '15px'
                    , icon: 1
                    , time: 1000
                }, function () {
                    //alert("退出成功")
                    location.href = 'login.html';
                    localStorage.clear();
                });
            }
        }).fail(function (data, status, xhr) {
            alert(status)
        });
    })

    

});

//格式化事件（取前10位：年月日）
function formatTime(time) {
    var rtime = time + '';
    if (rtime != 'null') {
        return rtime.substring(0, 10);
    } else {
        return '';
    }
}


//获取所有角色下拉框选项（学校管理员，教职工，外部评审专家）
function getCharOptions() {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/list/character",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#cId").append("<option value=" + data[i].cId + ">" + data[i].cName + "</option>");
            $("#cName").append("<option value=" + data[i].cId + ">" + data[i].cName + "</option>");
        }
    });
}

//获取所有部门下拉框选项
function getDepOptions() {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/list/department",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#dId").append("<option value=" + data[i].dId + ">" + data[i].dName + "</option>");
        }
    });
}

//根据学院id得出学院名称
function getDename(did) {
    var $ = layui.jquery;
    var depname = "";
    var settings = {
        "url": "http://localhost:8006/list/department",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
        var dname = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].dId == did) {
                dname = data[i].dName;
            }
        }
        depname = dname;
    });
    return depname;
}

//获取所有专业下拉框选项
function getMajorOptions() {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/list/major",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
         for (var i = 0; i < data.length; i++) {
             $("#maId").append("<option value=" + data[i].maId + ">" + data[i].maName + "</option>");
         }
    });
}

//获取专业名
function getMajorName(maId) {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/list/major",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
        var maName = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].maId == maId) {
                maName = data[i].maName;
            }
            //$("#maId").append("<option value=" + data[i].maId + ">" + data[i].maName + "</option>");
        }
        $("#umajor").html(maName);
    });
}

//获取所有通知（申报，中期，结题）下拉框选项
function getNtfTypeOptions() {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/list/notificationType",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#ntId").append("<option value=" + data[i].ntId + ">" + data[i].ntType + "</option>");
        }
    });
}

//获取所有项目等级下拉框选项
function getPLevelOptions() {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/list/projectLevel",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#plId").append("<option value=" + data[i].plId + ">" + data[i].plName + "</option>");
        }
    });
}

//获取所有项目类型(教改，课程建设，专业建设)下拉框选项
function getPTypeOptions() {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/list/projectType",
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#ptId").append("<option value=" + data[i].ptId + ">" + data[i].ptName + "</option>");
        }
    });
}

//根据项目类型id得出项目类型名称
function getProtypename(ptid) {
    var ptname;
    if (ptid == 1) {
        ptname = "教改项目";
    } else if (ptid == 2) {
        ptname = "课程建设项目"
    } else if (ptid == 3) {
        ptname = "专业建设项目"
    } else {
        alert("error/ptid=" + ptid);
    }
    return ptname;
}

//根据id得出项目状态
function getProState(pState) {
    var pstatename = ["初审中", "初审通过", "不立项", "专家评审中", "专家评审完成", "立项", "中期检查审核中", "中期检查通过", "中期检查待整改", "结题验收审核中", "结题验收通过", "结题验收待整改"];
    var psname;
    psname = pstatename[pState];
    return psname;
}

//设置项目状态
function passorfail(data, pstate) {
    var $ = layui.jquery;
    var settings = {
        "url": "http://localhost:8006/project/setState",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            pId: data.pId,
            ptId: data.ptId,
            plId: data.plId,
            pName: data.pName,
            pStart: data.pStart,
            pEnd: data.pEnd,
            uId: data.uId,
            uPhone: data.uPhone,
            uEmail: data.uEmail,
            maId: data.maId,
            deFile: data.deFile,
            prFile: data.prFile,
            meFile: data.meFile,
            fiFile: data.fiFile,
            pState: pstate,//1,
            fReason: data.fReason
        })
    };
    $.ajax(settings).done(function (response) {
        if (response.pId != "" && response.pId != null) {
            layer.msg('success', {
                offset: '15px'
                , icon: 1
                , time: 1000
            }, function () {
                window.parent.location.reload();
                //   console.log(response);
            });
        }
    }).fail(function (data, status, xhr) {
        layer.msg('error', {
            offset: '15px'
            , icon: 1
            , time: 1000
        }, function () {
            console.log(data);
        });
    });
}

//获取URL参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}