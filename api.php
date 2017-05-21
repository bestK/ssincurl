<?php
header("Content-type: application/json");

$cookie = dirname(__FILE__) . '/cookie_ss.txt';

//登录成功之后保存cookie
login($cookie);

//获取数据
get_content($cookie);

//删除cookie文件
@ unlink($cookie);


function login($cookie)
{
    $data = array(
        'email' => isset($_GET['email']) ? $_GET['email'] : null,
        'password' => isset($_GET['password']) ? $_GET['password'] : null
    );
    $loginUrl = "https://app.arukas.io/api/login";
    $ch_login = curl_init();
    curl_setopt($ch_login, CURLOPT_URL, $loginUrl);
    curl_setopt($ch_login, CURLOPT_POST, 1);
    curl_setopt($ch_login, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch_login, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch_login, CURLOPT_COOKIEJAR, $cookie);
    $result = curl_exec($ch_login);

    $content = json_decode($result);

    $status = $content->status;

    if ($status != "200") {
        return $content;
        exit;
    };
    curl_close($ch_login);
}


//登录成功后获取数据
function get_content($cookie)
{
    //登录成功之后访问的页面
    $contextUrl = "https://app.arukas.io/api/containers";
    $ch_content = curl_init();
    curl_setopt($ch_content, CURLOPT_URL, $contextUrl);
    //curl_setopt($ch, CURLOPT_HEADER, 0);
    //curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
    curl_setopt($ch_content, CURLOPT_COOKIEFILE, $cookie); //读取cookie
    $result = curl_exec($ch_content);

    $httpcode = curl_getinfo($ch_content, CURLINFO_HTTP_CODE);
    if ($httpcode != "200") {
        echo "Oops!";
        exit;
    }

    return $result;
    curl_close($ch_content);
    
}


/*


function curlPost($url, $data = array(), $timeout = 30, $CA = true){

    $cacert = getcwd() . '/cacert.pem'; //CA根证书
    $SSL = substr($url, 0, 8) == "https://" ? true : false;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout-2);
    if ($SSL && $CA) {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);   // 只信任CA颁布的证书
        curl_setopt($ch, CURLOPT_CAINFO, $cacert); // CA根证书（用来验证的网站证书是否是CA颁布）
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2); // 检查证书中是否设置域名，并且是否与提供的主机名匹配
    } else if ($SSL && !$CA) {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 信任任何证书
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 1); // 检查证书中是否设置域名
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Expect:')); //避免data数据过长问题
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    //curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data)); //data with URLEncode

    $ret = curl_exec($ch);
    var_dump(curl_error($ch));  //查看报错信息

    curl_close($ch);
    return $ret;
}



    curlPost($url,$data2);*/


//curl_setopt($ch, CURLOPT_HTTPHEADER, array());
//curl_setopt($ch, CURLOPT_USERAGENT, $UserAgent);
#curl_setopt ($ch, CURLOPT_REFERER, "https://app.arukas.io");
//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);//超时
//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);//禁用ssl
#curl_setopt($ch, CURLOPT_POSTFIELDS , http_build_query($data));
?>
