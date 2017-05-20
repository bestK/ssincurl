new Vue({
    el: '#app',
    data: {
        email: '',
        password: '',
        configs: null
        //configsCache:localStorage.configsCache
    },
    methods: {
        newConfig: function () {
            layer.msg('解析中', {
                time: 0, //不自动关闭
                shadeClose: false,
                shade: 0.3
            });

            this.$http.get('api.php?email=' + this.email + '&password=' + this.password, {emulateJSON: true}).then(
                function (response) {
                    if (response.body.indexOf('Failed') != -1) {
                        layer.msg(response.body, {icon: 2});
                        return
                    }
                    //var result = JSON.parse(response.body)
                    var result = response.body
                    this.configs = []               
                    for (var i = 0; i < result.data.length; i++) {
                        var mappingsObj = result.data[i].attributes.port_mappings
                        var cmd = result.data[i].attributes.cmd
                        var pwd = this.rePwd(cmd)
                        var lock = this.reLock(cmd)
                        var image_name = result.data[i].attributes.image_name
                        if (image_name.indexOf("ss-with-net-speeder") ==-1) {
                            continue
                        }
                        var mappingText = JSON.stringify(mappingsObj)
                        var mappingJson = eval('(' + mappingText + ')')
                        var ssHead = 'ss://'
                        if (mappingJson) {
                            for (var j = 0; j < mappingJson.length; j++) {
                                for (var k = 0; k < mappingJson[j].length; k++) {
                                    var mappingResult = {}
                                    mappingResult.service_port = mappingJson[j][k].service_port
                                    mappingResult.container_port = mappingJson[j][k].container_port
                                    mappingResult.host = this.reHost(mappingJson[j][k].host)
                                    mappingResult.cmd = cmd
                                    mappingResult.pwd = pwd
                                    mappingResult.lock = lock
                                    ssUrl = lock+':'+pwd+'@'+this.reHost(mappingJson[j][k].host)+':'+mappingJson[j][k].service_port
                                    mappingResult.ss_url = ssHead+this.base64DeCode(ssUrl)
                                    this.configs.push(mappingResult)
                                }
                            }
                        }
                    }
                    
                    if (!this.configs.length>0) {
                        layer.msg('没有创建或启动任何实例', {icon: 5});
                        return
                    }
                    
                    layer.msg('解析成功!', {icon: 6})
                    //localStorage.configsCache = this.configs
                }
            )
        },
        clearForm: function () {
            this.configs = null
        },
        reHost: function (oldhost) {
            host = oldhost.match(/seaof-(\S*).jp/)[1]
            host = host.replace(/-/g, ".")
            return host
        },
        rePwd: function (oldpwd) {
            if(oldpwd == null) return
            pwd = oldpwd.substring(oldpwd.indexOf("k ") + 2,oldpwd.indexOf(" -m"))
            return pwd
        },
        reLock: function (oldLock) {
            if(oldLock == null) return
            lock = oldLock.substring(oldLock.indexOf("m ")+2)
            return lock
        },
        base64DeCode: function (str) {
            var rawStr = str
            var wordArray = CryptoJS.enc.Utf8.parse(rawStr)
            var base64 = CryptoJS.enc.Base64.stringify(wordArray)
            return base64
        },
        showQrCode: function (url,port) {
            $("canvas").remove()
            $("#"+port).qrcode(url)
        },
        lmsg: function () {
            layer.msg('Everything is Nothing', {icon: 6})
        }
    }
})
