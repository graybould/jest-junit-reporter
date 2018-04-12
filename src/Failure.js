class Failure {
  constructor (message) {

    var fix = message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    fix = fix.replace(/(?:\r\n|\r|\n|\t)/g, ' ');

    var startResult = 0;
    var endResult = 0;

    if (fix.indexOf("Expected value to equal") >= 0){
      startResult = fix.indexOf("Expected value");
      endResult = fix.indexOf("Difference:");
    }else{
        startResult = fix.indexOf("Expected value");
        endResult = fix.indexOf("at Object.<anon");
    }

    message = fix.substring(startResult, endResult);

    var expect = message.substring(0, message.indexOf("Received:"));
    var receive = message.substring(message.indexOf("Received:"));

    expect = expect.replace(/'/g, '\"');
    receive = receive.replace(/'/g, '\"');

      this.failure =
      {
        expected: expect,
        received: receive
      }
  }
}

module.exports = Failure;

