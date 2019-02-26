//repdetails
layui.use(['element', 'table', 'form', 'layer', 'laydate', 'upload'], function () {
    var element = layui.element;
    var table = layui.table;
    var form = layui.form;
    var $ = layui.jquery, layer = layui.layer;
    var laydate = layui.laydate;
    var upload = layui.upload;
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    var ntfinfo = JSON.parse(localStorage.getItem("ntfinfo"));
    
    $("#n_title").html(ntfinfo.nTitle);
    $("#n_regTime").html(formatTime(ntfinfo.nRegtime));
    $("#pro_type").html(getProtypename(ntfinfo.ptId));
    $("#n_deadline").html(formatTime(ntfinfo.nDeadline));
    $("#n_content").html(ntfinfo.nContent);

    //执行laydate
    laydate.render({
        elem: '#startdate' //指定元素
    });
    laydate.render({
        elem: '#enddate' //指定元素
    });

    //下载申报通知书
    $("#downloadNtf").click(function () {
        var url = "http://localhost:8006/file/download?path=" + ntfinfo.nFiles;
        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
            //"xhrFields": { withCredentials: true },
        };

        $.ajax(settings).done(function (response) {
            window.location.href = url;
        }).fail(function (data, status, xhr) {
            layer.msg(status + ":未上传文件", {
                offset: '15px'
                , icon: 1
                , time: 1000
            });
        });
    })

    //上传项目申报书附件
    var form1 = new FormData();
    form1.append("file", "");
    upload.render({ //允许上传的文件后缀
        elem: '#addDe'
        , url: 'http://localhost:8006/project/addDe'
        , accept: 'file' //普通文件
        , method: 'post'
        , data: form1
        , exts: 'zip|rar|7z' //只允许上传压缩文件
        , done: function (res, index, upload) {
            layer.msg('上传成功!', {
                offset: '15px'
                , icon: 1
                , time: 1000
            })
            //alert("上传成功!");
        }
    });

    //上传项目立项承诺书
    var form2 = new FormData();
    form2.append("file", "");
    upload.render({ //允许上传的文件后缀
        elem: '#addPr'
        , url: 'http://localhost:8006/project/addPr'
        , accept: 'file' //普通文件
        , method: 'post'
        , data: form2
        , exts: 'zip|rar|7z' //只允许上传压缩文件
        , done: function (res, index, upload) {
            layer.msg('上传成功!', {
                offset: '15px'
                , icon: 1
                , time: 1000
            })
            //alert("上传成功!");
        }
    });

    //新增项目基本信息
    $(document).on('click', '#add', function () {
        layer.open({
            type: 1
            , title: '填写项目基本信息'
            , area: ['800px', '640px']
            , closeBtn: 1
            , shade: 0.8
            , id: 'LAY_layuipro' //设定一个id，防止重复弹出
            , btnAlign: 'c'
            , moveType: 1 //拖拽模式，0或者1
            , content: $('#adddetails')
        });
        form.val("formPro", {
            "ptId": ntfinfo.ptId
            , "uName": userinfo.uName
            , "dId": userinfo.dId
        });
        
    });

    //提交项目基本信息
    form.on('submit(repdetailsForm)', function (data) {
        var datas = data.field;
        var settings = {
            "url": "http://localhost:8006/project/add",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                ptId: datas.ptId,
                plId: datas.plId,
                maId: datas.maId,
                pName: datas.pName,
                pStart: datas.pStart,
                pEnd: datas.pEnd,
                uId: userinfo.uId,
                uPhone: datas.uPhone,
                uEmail: datas.uEmail,
                pState: 0
            })
        };
        $.ajax(settings).done(function (response) {
            if (response.pId !== '') {
                layer.msg('提交成功', {
                    offset: '15px'
                    , icon: 1
                    , time: 1000
                }, function () {
                    //location.href = 'repdetails.html';
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });
            }
        });
        return false;
    });
});
