const exec = require('child_process').exec
const path = require('path')
const readline = require('readline')
const rl = readline.createInterface(process.stdin, process.stdout)

function checkInput(line) {
  const re = /^\d{4}-\d{2}-\d{2}$/
  return re.test(line)
}

function commond (line) {
  const remotePath = `/data/work/PianoServer/public/one_money/${line}`
  return `ssh develop@42.62.40.66 "[ -d ${remotePath} ] && echo ok || mkdir -p ${remotePath}" && scp -r ${path.resolve(__dirname,'../build/*')} develop@42.62.40.66:${remotePath}`
}

function execCommond(line) {
  const child = exec(commond(line),
    (error, stdout, stderr) => {
      console.log('发布完成')
      console.log(`查看效果: http://m.wanliu.biz/one_money/${line}/`)
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
  });
}

rl.setPrompt('请输入活动时间, 例如: 2016-01-01: ')
rl.prompt()
rl.on('line', function(line) {
  line = line.trim()
  if (checkInput(line)) {
    console.log('请等待...')
    // 执行相关操作
    execCommond(line)
    rl.close()
  } else {
    rl.setPrompt('日期错误, 请重新输入: ')
    rl.prompt()
  }
})
