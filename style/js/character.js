layui.use(['element', 'form', 'table', 'layer'], function () {
    var element = layui.element;
    var form = layui.form;
    var table = layui.table;
    var $ = layui.jquery, layer = layui.layer;

    //教改项目table  
    table.render({
        elem: '#charactertable'
        , url: 'http://localhost:8006/character/query?content'
        , title: '角色信息管理'
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
            return {
                "code": 0, //解析接口状态
                "msg": '', //解析提示文本
                "totalCount": res.totalCount, //解析数据长度
                "data": res.data //解析数据列表
            };
        }
        , page: true
        , limit: 10  //默认十条数据一页
        , limits: [10, 20, 30, 50]  //数据分页条
        , cols: [[
            { field: 'cId', title: '角色编号', align: 'center' }
            , { field: 'cName', title: '角色名称', align: 'center' }
            , { field: 'cDesc', title: '角色描述', align: 'center' }
            , { field: 'cRegtime', title: '创建时间', align: 'center', templet: function (d) { return formatTime(d.cRegtime) } }
            , { field: 'cUptime', title: '更新时间', align: 'center', templet: function (d) { return formatTime(d.cUptime) } }
            , { field: 'cComment', title: '备注', align: 'center' }
            , { fixed: 'right', title: '操作', align: 'center', toolbar: '#bar1' }
        ]]
    });

    //监听行工具事件
    table.on('tool(charactertable)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            $("#updateChar").css({ "display": "inline" });
            $("#addChar").css({ "display": "none" });
            layer.open({
                type: 1
                , title: '修改角色信息'
                , area: ['600px', '400px']
                , closeBtn: 1
                , shade: 0.8
                //, id: 'LAY_layuipro' //设定一个id，防止重复弹出
                , btnAlign: 'c'
                , moveType: 1 //拖拽模式，0或者1
                , content: $('#addcharacterdetails')
            });
            form.val("formCharacter", {
                //"cId": data.cId,
                "cName": data.cName
                , "cDesc": data.cDesc
                , "cComment": data.cComment
            })

            var datas = data;
            //提交修改角色的数据
            form.on('submit(LAY-char-update-submit)', function (data) {
                var cName = $("#cName").val();
                var cDesc = $("#cDesc").val();
                var cComment = $("#cComment").val();
                var settings = {
                    "url": "http://localhost:8006/character/update",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        cId: datas.cId,
                        cName: cName,
                        cDesc: cDesc,
                        cComment: cComment,
                        cRegtime: datas.cRegtime,
                        cUptime: datas.cUptime
                    })
                    //"{\n\t\"uName\":\""+uName+"\",\n\t\"uPassword\":\"123456\",\n\t\"uComment\":\"no\",\n\t\"cId\":1,\n\t\"dId\":1\n}",
                };
                $.ajax(settings).done(function (response) {
                    //var data = JSON.parse(response);    //转换为json对象
                    if (response.cId !== '') {            //修改成功的提示与跳转
                        layer.msg('修改成功', {
                            offset: '15px'
                            , icon: 1
                            , time: 1000
                        }, function () {
                            location.href = 'character.html';
                            window.parent.location.reload();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        });
                    }
                });
                return false;
            });
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                $.ajax({
                    url: "http://localhost:8006/character/delete?id=" + data.cId,
                    type: "DELETE",
                    data:"",// { eqptType: data.eqptType, eqptIdCode: data.eqptIdCode },
                    success: function (msg) {
                        //alert(msg);
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
                });
                return false;
            });
        }
    });

    //新增角色信息
    $(document).on('click', '#addcharacter', function () {
        $('#formCharacter')[0].reset();
        $("#addChar").css({ "display": "inline" });
        $("#updateChar").css({ "display": "none" });
        layer.open({
            type: 1
            , title: '新增角色'
            , area: ['600px', '400px']
            , closeBtn: 1
            , shade: 0.8
            //, id: 'LAY_layuipro' //设定一个id，防止重复弹出
            , btnAlign: 'c'
            , moveType: 1 //拖拽模式，0或者1
            , content: $('#addcharacterdetails')
        });
    });

    //提交新增角色的数据
    form.on('submit(LAY-char-add-submit)', function (data) {
        var cName = $("#cName").val();
        var cDesc = $("#cDesc").val();
        var cComment = $("#cComment").val();

        var settings = {
            "url": "http://localhost:8006/character/add",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                cName: cName,
                cDesc: cDesc,
                cComment: cComment
            })
        };
        $.ajax(settings).done(function (response) {
            //var data = JSON.parse(response);    //转换为json对象
            if (response.cId !== '') {
                //登入成功的提示与跳转
                layer.msg('提交成功', {
                    offset: '15px'
                    , icon: 1
                    , time: 1000
                }, function () {
                    location.href = 'character.html';
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });
            }
        });
        return false;
    });
});