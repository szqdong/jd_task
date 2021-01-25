const exec = require("child_process").execSync;
const fs = require("fs");
const axios = require("axios");
const smartReplace = require("./smartReplace");

async function changeFiele() {
    var  appU =process.env.SYNCURL.split('/');
    var L = appU[appU.length - 1];
    console.log(L);//拿到当前页名称 判断传递参数
    let response = fs.readFileSync(L);
    //let response = fs.readFileSync(process.env.SYNCURL);
    //console.log(response.toString());
    let content = response.toString();
    content=content.replace('"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);','');
    content = await smartReplace.inject(content);
    await fs.writeFileSync("./executeOnce.js", content, "utf8");
    console.log("替换变量完毕");

}

async function start() {
    console.log(`当前执行时间:${new Date().toString()}`);
    if (!process.env.JD_COOKIE) {
        console.log("请填写 JD_COOKIE 后在继续");
        return;
    }
    if (!process.env.SYNCURL) {
        console.log("请填写 SYNCURL 后在继续");
        return;
    }
    console.log(`当前共${process.env.JD_COOKIE.split("&").length}个账号需要签到`);
    try {
        await changeFiele();
        await exec("node executeOnce.js", { stdio: "inherit" });
    } catch (e) {
        console.log("执行异常:" + e);
    }
    console.log("执行完毕");
}
start();
