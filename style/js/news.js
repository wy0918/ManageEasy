layui.use(['element', 'form', 'table', 'layer', 'laydate', 'upload'], function () {
    var element = layui.element;
    var form = layui.form;
    var table = layui.table;
    var $ = layui.jquery, layer = layui.layer;
    var laydate = layui.laydate;
    var upload = layui.upload;

    //教改项目table  
    var showNtfTable = function (url) {
        table.render({
            elem: '#newstable'
            , url: url
            , title: '通知信息管理'
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
                    datas[i] = Object.assign(res.data[i].notifications, res.data[i].projecttype);
                }
                return {
                    "code": 0, //解析接口状态
                    "msg": '', //解析提示文本
                    "totalCount": res.totalCount, //解析数据长度
                    "data": datas //解析数据列表
                };
            }
            , cols: [[
                { field: 'nTitle', title: '通知标题', align: 'center' }
                , { field: 'ptName', title: '项目类型', align: 'center' }
                , { field: 'nDeadline', title: '截止时间', align: 'center', templet: function (d) { return formatTime(d.nDeadline) } }
                , { field: 'nRegtime', title: '创建时间', align: 'center', templet: function (d) { return formatTime(d.nRegtime) } }
                , { field: 'nUptime', title: '更新时间', align: 'center', templet: function (d) { return formatTime(d.nUptime) } }
                , { field: 'nComment', title: '备注', align: 'center' }
                , { fixed: 'right', title: '操作', align: 'center', toolbar: '#bar1' }
            ]]
            , page: true
        });
    }

    var url1 = 'http://localhost:8006/notification/query?ntid=' + $("#ntId").find("option:selected").val();
    showNtfTable(url1);
    //监听select事件
    form.on('select(select_nttype)', function (data) {
        var url = 'http://localhost:8006/notification/query?ntid=' + data.value;
        showNtfTable(url);
    });

    //监听行工具事件
    table.on('tool(newstable)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            layer.open({
                type: 1
                , title: '修改通知信息'
                , area: ['700px', '600px']
                , closeBtn: 1
                , shade: 0.8
                //, id: 'LAY_layuipro' //设定一个id，防止重复弹出
                , btnAlign: 'c'
                , moveType: 1 //拖拽模式，0或者1
                , content: $('#modifynews')
            });

            form.val("formUpdateNtf", {
                "nTitle": data.nTitle,
                "ntId": data.ntId,
                "ptId": data.ptId,
                "nDeadline": formatTime(data.nDeadline),
                "nComment": data.nComment,
                "nContent": data.nContent,
                "nFiles": data.nFiles,
                "ptName": data.ptName
            })

            var formrar = new FormData();
            var updatefile = data.nFiles;
            formrar.append("file", "");
            //上传压缩文件
            upload.render({ //允许上传的文件后缀
                elem: '#rar'
                , url: 'http://localhost:8006/notification/file'
                , accept: 'file' //普通文件
                , method: 'post'
                , data: formrar
                , exts: 'zip|rar|7z' //只允许上传压缩文件
                , done: function (res, index, upload) {
                    //console.log(res);
                    alert("上传成功!");
                    updatefile = res.address;
                }
            });

            var datas = data;
            //提交修改通知的数据
            form.on('submit(LAY-news-update-submit)', function (data) {
                var formdata = data.field;
                var settings = {
                    "url": "http://localhost:8006/notification/update",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "xhrFields": { withCredentials: true },
                    "data": JSON.stringify({
                        nTitle: formdata.nTitle,
                        ptId: formdata.ptId,
                        nDeadline: formdata.nDeadline,//formatTime(formdata.nDeadline),
                        nContent: formdata.nContent,
                        nComment: formdata.nComment,
                        ntId: datas.ntId,//$("#ntid").find("option:selected").val(),
                        nId: datas.nId,
                        nFiles: updatefile,
                        nRegtime: datas.nRegtime,//formatTime(datas.nRegtime),
                        nUptime: datas.nUptime,//formatTime(datas.nUptime),
                    })
                };
                $.ajax(settings).done(function (response) {
                    //var data = JSON.parse(response);    //转换为json对象
                    if (response.nId !== '' && response.nId != null) {            //修改成功的提示与跳转
                        layer.msg('修改成功', {
                            offset: '15px'
                            , icon: 1
                            , time: 1000
                        }, function () {
                            //location.href = 'news.html';
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
                    url: "http://localhost:8006/notification/delete?id=" + data.nId,
                    type: "DELETE",
                    xhrFields: { withCredentials: true },
                    data: "",// { eqptType: data.eqptType, eqptIdCode: data.eqptIdCode },
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
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest.status);
                        //alert(XMLHttpRequest.readyState); 
                        //alert(textStatus);        
                    }
                });
                return false;
            });
        }
    });

    //执行laydate
    laydate.render({
        elem: '#nDeadline' //指定元素
    });


    // upload.render({ //允许上传的文件后缀
    //     elem: '#file'
    //     , url: '/upload/'
    //     , accept: 'file' //普通文件
    //     , done: function (res) {
    //         console.log(res)
    //     }
    // });


});