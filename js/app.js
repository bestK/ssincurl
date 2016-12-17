new Vue({
        el: '#container',
        data: {
            message: '',
            email: '',
            password: '',
            configs: []
        },
        methods: {
            newConfig: function () {
                layer.msg('解析中', {
                    time: 0, //不自动关闭
                    shadeClose: false,
                    shade: 0.3
                });
                $('.btn.btn-default').attr("disabled", true)
                this.$http.get('api.php?email=' + this.email + '&password=' + this.password, {emulateJSON: true}).then(
                        function (response) {
                            if (response.body.indexOf('Failed') != -1) {
                                layer.msg(response.body, {icon: 2});
                                $('.btn.btn-default').attr("disabled", false)
                                return
                            }

                            var result = JSON.parse(response.body)
                            this.configs = []
                            for (var i = 0; i < result.data.length; i++) {
                                var ssObj = result.data[i].attributes.port_mappings
                                var jsonText = JSON.stringify(ssObj)
                                var json = eval('(' + jsonText + ')')
                                if (json != null) {
                                    for (var j = 0; j < json.length; j++) {
                                        for (var k = 0; k < json[j].length; k++) {
                                            var ssConfigs = {}
                                            ssConfigs.service_port = json[j][k].service_port
                                            ssConfigs.container_port = json[j][k].container_port
                                            ssConfigs.host = this.reHost(json[j][k].host)
                                            this.configs.push(ssConfigs)
                                        }
                                    }
                                }
                            }
                            layer.msg('解析成功!', {icon: 6});
                            $('.btn.btn-default').attr("disabled", false)
                            $('.table.table-danger').attr("style", "")
                            $('.ssform').css("display", "none")
                            $('.btn.btn-default').show()
                        }
                )
            },
            clearForm: function () {
                this.configs = []
                this.password = null
                $('.table.table-danger').hide()
                $('.btn.btn-default').show()
                $('.btn.btn-default.abc').hide()
                $('.ssform').css("display", "block")
            },
            reHost: function (oldhost) {
                host = oldhost.match(/seaof-(\S*).jp/)[1]
                host = host.replace(/-/g, ".")
                return host
            }
        }
    })
