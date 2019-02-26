layui.use(['element', 'form', 'table', 'layer'], function () {
    var element = layui.element;
    var form = layui.form;
    var table = layui.table;
    var $ = layui.jquery, layer = layui.layer;
    var s_userinfo2 = localStorage.getItem("p_userinfo");
    var p_userinfo2 = JSON.parse(s_userinfo2);

    var ShowUserTable = function (url) {
        //教改项目table
        table.render({
            elem: '#usertable'
            , url: url
            , title: '用户信息管理'
            , request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            }
            , response: {
                statusName: 'code' //规定数据状态的字段名称，默认：code
                //,statusCode: 200 //规定成功的状态码，默认：0
                , msgName: 'msg' //规定状态信息的字段名称，默认：msg
                , countName: 'totalCount' //规定数据总数的字段名称，默认：count
                , dataName: 'data' //规定数据列表的字段名称，默认：data
            }
            , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                var datas = [];
                for (let i = 0; i < (res.data).length; i++) {
                    datas[i] = Object.assign(res.data[i].users, res.data[i].departments);
                }
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "totalCount": res.totalCount, //解析数据长度
                    "data": datas //解析数据列表
                };
            }
            , cols: [[
                { field: 'uId', title: '用户编号', align: 'center' }
                , { field: 'uName', title: '用户名称', align: 'center' }
                , { field: 'uPassword', title: '用户密码', align: 'center' }
                , { field: 'dName', title: '所属部门', align: 'center' }
                , { field: 'uRegtime', title: '创建时间', align: 'center', templet: function (d) { return formatTime(d.uRegtime) } }
                , { field: 'uUptime', title: '更新时间', align: 'center', templet: function (d) { return formatTime(d.uUptime) } }
                , { fixed: 'right', title: '操作', align: 'center', toolbar: '#bar1' }
            ]]
            , page: true
            , limit: 10  //默认十条数据一页
            , limits: [10, 20, 30, 50]  //数据分页条

        });
    }
    var url1 = 'http://localhost:8006/user/query?cid=' + $("#cName").find("option:selected").val();
    ShowUserTable(url1);
    //监听select事件
    form.on('select(select_cName)', function (data) {
        var url = 'http://localhost:8006/user/query?cid=' + data.value;
        ShowUserTable(url);
    });

    //监听行工具事件
    table.on('tool(usertable)', function (obj) {
        var data = obj.data;
        //console.log(obj)
        if (obj.event === 'edit') {
            $("#updateUser").css({ "display": "inline" });
            $("#addUserinfo").css({ "display": "none" });
            $("#div_uid").css({ "display": "block" });

            layer.open({
                type: 1
                , title: '修改用户信息'
                , area: ['700px', '550px']
                , closeBtn: 1
                , shade: 0.8
                //, id: 'LAY_layuipro' //设定一个id，防止重复弹出
                , btnAlign: 'c'
                , moveType: 1 //拖拽模式，0或者1
                , content: $('#adduserdetails')
            });
            form.val("formUser", {
                "uId": data.uId
                , "uName": data.uName
                , "uPassword": data.uPassword
                , "dId": data.dId
                , "cId": data.cId
                , "uComment": data.uComment
            })
            $("#uId").attr("readonly", "readonly");

            var datas = data;
            //提交修改用户的数据
            form.on('submit(LAY-user-update-submit)', function (data) {
                var uName = $("#uName").val();
                var uPassword = $("#uPassword").val();
                var did = $("#dId").find("option:selected").val();
                var cid = $("#cId").find("option:selected").val();
                var uComment = $("#uComment").val();
                var settings = {
                    "url": "http://localhost:8006/user/update",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        uId: datas.uId,
                        uName: uName,
                        uPassword: uPassword,
                        dId: did,
                        cId: cid,
                        uComment: uComment,
                        uRegtime: datas.uRegtime,
                        uUptime: datas.uUptime
                    })
                    //"{\n\t\"uName\":\""+uName+"\",\n\t\"uPassword\":\"123456\",\n\t\"uComment\":\"no\",\n\t\"cId\":1,\n\t\"dId\":1\n}",
                };
                $.ajax(settings).done(function (response) {
                    //var data = JSON.parse(response);    //转换为json对象
                    if (response.uId !== '') {
                        //console.log(response);
                        //修改成功的提示与跳转
                        layer.msg('修改成功', {
                            offset: '15px'
                            , icon: 1
                            , time: 1000
                        }, function () {
                            //location.href = 'user.html';
                            window.parent.location.reload();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        });
                    }
                }).fail(function (data, status, xhr) {
                    alert(status)
                });
                return false;
            });
        } else if (obj.event === 'del') {//删除功能（只能一个一个删除）
            layer.confirm('真的删除行么', function (index) {
                $.ajax({
                    url: "http://localhost:8006/user/delete?id=" + data.uId,
                    type: "DELETE",
                    data: "",//{ eqptType: data.eqptType, eqptIdCode: data.eqptIdCode },
                    success: function (msg) {
                        if (msg == "Success!") {
                            layer.msg("删除成功", { icon: 6 }, function () {
                                window.parent.location.reload();
                                //删除这一行
                                obj.del();
                                //关闭弹框
                                layer.close(index);
                            });
                        } else {
                            layer.msg("删除失败", { icon: 5 });
                        }
                    }
                }).fail(function (data, status, xhr) {
                    alert(status)
                });
                return false;
            });
        }
    });

    //新增用户信息
    $(document).on('click', '#adduser', function () {
        $('#formUser')[0].reset();
        $("#div_uid").css({ "display": "none" });
        $("#addUserinfo").css({ "display": "inline" });
        $("#updateUser").css({ "display": "none" });
        layer.open({
            type: 1
            , title: '新增用户信息'
            , area: ['700px', '500px']
            , closeBtn: 1
            , shade: 0.8
            //, id: 'LAY_layuipro' //设定一个id，防止重复弹出
            , btnAlign: 'c'
            , moveType: 1 //拖拽模式，0或者1
            , content: $('#adduserdetails')
        });
    });

    //提交新增用户的数据
    //$(document).on('click', '#addUser', function () {
    form.on('submit(LAY-user-add-submit)', function (data) {
        var uName = $("#uName").val();
        var uPassword = $("#uPassword").val();
        var did = $("#dId").find("option:selected").val();
        var cid = $("#cId").find("option:selected").val();
        var uComment = $("#uComment").val();

        var settings = {
            "url": "http://localhost:8006/user/add",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                uName: uName,
                uPassword: uPassword,
                dId: did,
                cId: cid,
                uComment: uComment
            })
            //"{\n\t\"uName\":\""+uName+"\",\n\t\"uPassword\":\"123456\",\n\t\"uComment\":\"no\",\n\t\"cId\":1,\n\t\"dId\":1\n}",
        };
        $.ajax(settings).done(function (response) {
            //var data = JSON.parse(response);    //转换为json对象
            if (response.uId !== '') {
                //登入成功的提示与跳转
                layer.msg('提交成功', {
                    offset: '15px'
                    , icon: 1
                    , time: 1000
                }, function () {
                    location.href = 'user.html';
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });
            }
        }).fail(function (data, status, xhr) {
            alert(status)
        });
        return false;
    });

});